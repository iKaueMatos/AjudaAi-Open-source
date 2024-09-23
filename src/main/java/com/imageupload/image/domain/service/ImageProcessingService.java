package com.imageupload.image.domain.service;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletResponse;

import java.io.*;

@Service
public class ImageProcessingService {

  public void processAndZipImages(MultipartFile[] files, String title, int width, int height,
      HttpServletResponse response
  ) throws IOException {
    response.setContentType("application/zip");
    response.setHeader("Content-Disposition", "attachment; filename=\"processed-images.zip\"");

    try (ZipArchiveOutputStream zipOutputStream = new ZipArchiveOutputStream(response.getOutputStream())) {
      for (int i = 0; i < files.length; i++) {
        MultipartFile file = files[i];
        String newFileName = title + "-" + (i + 1) + ".jpg";
        File tempFile = File.createTempFile("image", ".jpg");
        try (FileOutputStream tempFileOutputStream = new FileOutputStream(tempFile)) {
          Thumbnails.of(file.getInputStream())
              .size(width, height)
              .outputFormat("jpg")
              .toOutputStream(tempFileOutputStream);
        }

        ZipArchiveEntry zipEntry = new ZipArchiveEntry(newFileName);
        zipOutputStream.putArchiveEntry(zipEntry);

        try (FileInputStream tempFileInputStream = new FileInputStream(tempFile)) {
          byte[] buffer = new byte[1024];
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