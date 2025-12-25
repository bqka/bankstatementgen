package com.bqka.pdfservice.template;

import com.bqka.pdfservice.generator.Fonts;
import com.bqka.pdfservice.model.Statement;
import com.lowagie.text.Document;

public interface BankPdfTemplate {
  void render(Document doc, Fonts fonts, Statement stmt) throws Exception;
}