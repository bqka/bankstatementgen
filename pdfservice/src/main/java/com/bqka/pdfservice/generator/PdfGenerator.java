package com.bqka.pdfservice.generator;

import com.bqka.pdfservice.model.Statement;
import com.bqka.pdfservice.template.BankPdfTemplate;
import com.bqka.pdfservice.template.TemplateRegistry;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.io.ByteArrayOutputStream;

public class PdfGenerator {

  public static byte[] generate(Statement stmt) throws Exception {

    ByteArrayOutputStream out = new ByteArrayOutputStream();

    Document doc = new Document(PageSize.A4, 36, 36, 36, 36);
    PdfWriter.getInstance(doc, out);

    doc.open();

    Fonts fonts = new Fonts();

    BankPdfTemplate template =
        TemplateRegistry.get(stmt.meta.template);

    if (template == null) {
      throw new IllegalArgumentException(
        "No PDF template registered for bank: " + stmt.meta.template
      );
    }

    template.render(doc, fonts, stmt);

    doc.close();
    return out.toByteArray();
  }
}