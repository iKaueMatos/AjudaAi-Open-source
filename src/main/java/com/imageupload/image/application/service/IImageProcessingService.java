package com.imageupload.image.application.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.imageupload.image.application.dto.ImageProcessingDataRequest;

import jakarta.servlet.http.HttpServletResponse;

public interface IImageProcessingService {
    void processImages(MultipartFile[] files,
            ImageProcessingDataRequest imageProcessingDataRequest,
            HttpServletResponse response)
            throws IOException;
}
