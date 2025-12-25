package com.bqka.pdfservice.controller;

import com.bqka.pdfservice.generator.PdfGenerator;
import com.bqka.pdfservice.model.Statement;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(
  origins = {
    "http://192.168.1.5:8081",
  }
)
public class PdfController {

  @PostMapping("/pdf")
  public ResponseEntity<byte[]> createPdf(@RequestBody Statement statement)
      throws Exception {

    byte[] pdf = PdfGenerator.generate(statement);

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=statement.pdf"
        )
        .body(pdf);
  }
}