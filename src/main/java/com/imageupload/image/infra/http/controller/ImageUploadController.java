package com.imageupload.image.infra.http.controller;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.imageupload.image.application.dto.ImageProcessingDataRequest;
import com.imageupload.image.application.useCases.ImageProcessingUseCase;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Controller
public class ImageUploadController {
    private static final Logger logger = LoggerFactory.getLogger(ImageUploadController.class);

    @Autowired
    private ImageProcessingUseCase imageProcessingUseCase;

    @PostMapping("/upload")
    public void handleFileUpload(
        @RequestParam("files") MultipartFile[] files,
        @Valid @ModelAttribute ImageProcessingDataRequest requestData,
        BindingResult result,
        HttpServletResponse response,
        RedirectAttributes redirectAttributes
    ) throws IOException {
        
        if (result.hasErrors()) {
            result.getFieldErrors().forEach(error -> {
                logger.error("Erro no campo {}: {}", error.getField(), error.getDefaultMessage());
                redirectAttributes.addFlashAttribute("message", "Erro: " + error.getDefaultMessage());
            });
            response.sendRedirect("/uploadStatus");
            return;
        }

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

        try {
            logger.info("Iniciando o processamento de {} arquivo(s).", files.length);
            imageProcessingUseCase.execute(files, requestData, response);
            logger.info("Processamento concluído com sucesso.");
        } catch (Exception e) {
            logger.error("Erro ao processar as imagens: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("message", "Erro ao processar as imagens. Tente novamente.");
            response.sendRedirect("/uploadStatus");
        }
    }
}
