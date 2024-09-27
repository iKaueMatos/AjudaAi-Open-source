package com.imageupload.image.infra.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.imageupload.image.application.dto.ImageProcessingDataRequest;
import com.imageupload.image.application.service.IImageProcessingService;
import com.imageupload.image.domain.service.ImageResizerService;
import com.imageupload.image.domain.service.ImageZipService;
import com.imageupload.image.domain.service.TempFileService;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class ImageProcessingService implements IImageProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(ImageProcessingService.class);

    private final ImageResizerService imageResizerService;
    private final ImageZipService zipService;
    private final TempFileService tempFileService;

    public ImageProcessingService(ImageResizerService imageResizerService, ImageZipService zipService,
                                  TempFileService tempFileService) {
        this.imageResizerService = imageResizerService;
        this.zipService = zipService;
        this.tempFileService = tempFileService;
    }

    @Override
    public void processImages(MultipartFile[] files, ImageProcessingDataRequest requestData, HttpServletResponse response) throws IOException {
        validateFiles(files);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try (ZipArchiveOutputStream zipOutputStream = new ZipArchiveOutputStream(byteArrayOutputStream)) {
            processEachFile(files, requestData, zipOutputStream);
            zipOutputStream.finish();
        } catch (IOException e) {
            logger.error("Erro ao processar as imagens: {}", e.getMessage(), e);
            throw new IOException("Erro ao processar as imagens", e);
        }

        prepareResponse(response, byteArrayOutputStream, requestData.getTitle());
    }

    private void validateFiles(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("Nenhum arquivo foi enviado.");
        }

        for (int i = 0; i < files.length; i++) {
            if (files[i] == null || files[i].isEmpty()) {
                throw new IllegalArgumentException("O arquivo na posição " + (i + 1) + " está vazio ou nulo.");
            }
        }
    }

    private void processEachFile(MultipartFile[] files, ImageProcessingDataRequest requestData,
                                 ZipArchiveOutputStream zipOutputStream) throws IOException {

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            String imageTitle = generateImageTitle(requestData.getTitle(), i + 1, requestData.getFormat());

            BufferedImage resizedImage = imageResizerService.resizeImage(file.getInputStream(),
                    requestData.getWidth(), requestData.getHeight(),
                    requestData.getCompression(), requestData.getFormat(),
                    requestData.getConvertTo());

            File tempFile = tempFileService.createTempFile(requestData.getFormat(), resizedImage, requestData.getConvertTo());
            zipService.addToZip(imageTitle, tempFile, zipOutputStream);

            boolean isDeleted = tempFile.delete();
            if (!isDeleted) {
                logger.warn("Não foi possível deletar o arquivo temporário: {}", tempFile.getName());
            }
        }
    }

    private String generateImageTitle(String baseTitle, int index, String format) {
        return baseTitle + " - " + index + "." + format;
    }

    private void prepareResponse(HttpServletResponse response, ByteArrayOutputStream byteArrayOutputStream, String baseTitle) throws IOException {
        String zipFileName = baseTitle + ".zip";
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + zipFileName + "\"");
        response.getOutputStream().write(byteArrayOutputStream.toByteArray());
        response.getOutputStream().flush();
    }
}
