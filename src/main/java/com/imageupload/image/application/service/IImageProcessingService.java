package com.imageupload.image.application.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.imageupload.image.application.dto.ImageProcessingDataRequest;


public interface IImageProcessingService {
    byte[] processImages(MultipartFile[] files, ImageProcessingDataRequest requestData) throws IOException;
}
