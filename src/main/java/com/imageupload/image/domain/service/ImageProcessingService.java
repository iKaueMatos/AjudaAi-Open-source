package com.imageupload.image.domain.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletResponse;
import net.coobird.thumbnailator.Thumbnails;

@Service
public class ImageProcessingService {

    public void processAndZipImages(
        MultipartFile[] files, 
        String title, 
        int width, 
        int height, 
        String format,  
        double compression,
        String convertTo,
        HttpServletResponse response
    ) throws IOException {
        response.setContentType("application/zip");

        String zipFileName = title.replaceAll("\\s+", "_") + "_processed_images.zip";
        response.setHeader("Content-Disposition", "attachment; filename=\"" + zipFileName + "\"");
  
        try (ZipArchiveOutputStream zipOutputStream = new ZipArchiveOutputStream(response.getOutputStream())) {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                String originalFilename = file.getOriginalFilename();
                String imageTitle = title + "-" + (originalFilename != null ? originalFilename.replaceAll("\\s+", "_") : "image" + (i + 1)) + (convertTo != null ? "." + convertTo : "." + format);
  
                File tempFile = File.createTempFile("image", (convertTo != null ? "." + convertTo : "." + format));
                try (FileOutputStream tempFileOutputStream = new FileOutputStream(tempFile)) {
                    BufferedImage image = ImageIO.read(file.getInputStream());
                    
                    BufferedImage resizedImage = Thumbnails.of(image)
                        .size(width, height)
                        .outputQuality(compression)
                        .asBufferedImage();

                    if (convertTo != null) {
                        ImageIO.write(resizedImage, convertTo.toLowerCase(), tempFileOutputStream);
                    } else {
                        ImageIO.write(resizedImage, format.toLowerCase(), tempFileOutputStream);
                    }
                }
  
                ZipArchiveEntry zipEntry = new ZipArchiveEntry(imageTitle);
                zipOutputStream.putArchiveEntry(zipEntry);
  
                try (FileInputStream tempFileInputStream = new FileInputStream(tempFile)) {
                    byte[] buffer = new byte[8192];
                    int len;
                    while ((len = tempFileInputStream.read(buffer)) > 0) {
                        zipOutputStream.write(buffer, 0, len);
                    }
                }
  
                zipOutputStream.closeArchiveEntry();
                tempFile.delete();
            }
  
            zipOutputStream.finish();
        }
    }
}
