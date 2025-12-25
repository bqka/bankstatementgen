package com.bqka.pdfservice.template;

import com.bqka.pdfservice.model.BankTemplate;
import com.bqka.pdfservice.template.banks.SbiTemplate;

import java.util.EnumMap;
import java.util.Map;

public class TemplateRegistry {

  private static final Map<BankTemplate, BankPdfTemplate> MAP =
      new EnumMap<>(BankTemplate.class);

  static {
    MAP.put(BankTemplate.SBI, new SbiTemplate());

    // Add more banks here
    // MAP.put(BankTemplate.SBI, new SbiTemplate());
    // MAP.put(BankTemplate.HDFC, new HdfcTemplate());
  }

  public static BankPdfTemplate get(BankTemplate template) {
    return MAP.get(template);
  }
}