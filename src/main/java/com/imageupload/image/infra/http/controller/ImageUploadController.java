package com.imageupload.image.infra.http.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.imageupload.image.domain.service.ImageProcessingService;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Controller
public class ImageUploadController {
    @Autowired
    private ImageProcessingService imageProcessingService;

    @PostMapping("/upload")
    public void handleFileUpload(
        @RequestParam("files") MultipartFile[] files,
        @RequestParam("title") String title,
        @RequestParam("width") int width,
        @RequestParam("height") int height,
        HttpServletResponse response,
        RedirectAttributes redirectAttributes
        ) throws IOException
    {

        if (files.length == 0) {
            redirectAttributes.addFlashAttribute("message", "Nenhum arquivo selecionado!");
            response.sendRedirect("/uploadStatus");
            return;
        }
        imageProcessingService.processAndZipImages(files, title, width, height, response);
    }
}