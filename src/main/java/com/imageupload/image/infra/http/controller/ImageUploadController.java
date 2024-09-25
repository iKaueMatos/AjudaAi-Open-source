package com.imageupload.image.infra.http.controller;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.imageupload.image.domain.service.ImageProcessingService;

import jakarta.servlet.http.HttpServletResponse;

@Controller
public class ImageUploadController {

    private static final Logger logger = LoggerFactory.getLogger(ImageUploadController.class);

    @Autowired
    private ImageProcessingService imageProcessingService;

    @PostMapping("/upload")
    public void handleFileUpload(
        @RequestParam("files") MultipartFile[] files,
        @RequestParam("title") String title,
        @RequestParam("width") int width,
        @RequestParam("height") int height,
        @RequestParam("format") String format,
        @RequestParam("compression") Double compression,
        @RequestParam(value = "convertTo", required = false) String convertTo, // Novo parâmetro para conversão
        HttpServletResponse response,
        RedirectAttributes redirectAttributes
    ) throws IOException {
        
        if (files.length == 0) {
            logger.warn("Nenhum arquivo selecionado para upload.");
            redirectAttributes.addFlashAttribute("message", "Nenhum arquivo selecionado!");
            response.sendRedirect("/uploadStatus");
            return;
        }

        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
                logger.error("Formato de arquivo inválido: {}", contentType);
                redirectAttributes.addFlashAttribute("message", "Formato de arquivo não suportado: " + contentType);
                response.sendRedirect("/uploadStatus");
                return;
            }
        }

        if (width <= 0 || height <= 0) {
            logger.error("Dimensões de imagem inválidas: largura={} altura={}", width, height);
            redirectAttributes.addFlashAttribute("message", "Dimensões de imagem inválidas.");
            response.sendRedirect("/uploadStatus");
            return;
        }

        try {
            logger.info("Iniciando o processamento de {} arquivo(s).", files.length);
            imageProcessingService.processAndZipImages(files, title, width, height, format, compression, convertTo, response);
            logger.info("Processamento concluído com sucesso.");
        } catch (Exception e) {
            logger.error("Erro ao processar as imagens: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("message", "Erro ao processar as imagens. Tente novamente.");
            response.sendRedirect("/uploadStatus");
        }
    }
}
