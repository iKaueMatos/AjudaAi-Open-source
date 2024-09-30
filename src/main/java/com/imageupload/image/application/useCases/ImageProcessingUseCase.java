package com.imageupload.image.application.useCases;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.imageupload.image.application.dto.ImageProcessingDataRequest;
import com.imageupload.image.infra.service.ImageProcessingService;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class ImageProcessingUseCase {
    private final ImageProcessingService imageProcessingService;

    public ImageProcessingUseCase(ImageProcessingService imageProcessingService) {
        this.imageProcessingService = imageProcessingService;
    }

    public void execute(
        MultipartFile[] files,
        ImageProcessingDataRequest imageProcessData,
        HttpServletResponse response
    ) throws IOException {
        imageProcessingService.processImages(files, imageProcessData, response);
    }
}
