package com.bqka.pdfservice.template.banks;

import com.bqka.pdfservice.generator.Fonts;
import com.bqka.pdfservice.model.Statement;
import com.bqka.pdfservice.model.Transaction;
import com.bqka.pdfservice.template.BankPdfTemplate;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.Color;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class SbiTemplate implements BankPdfTemplate {

    @Override
    public void render(Document doc, Fonts fonts, Statement stmt) throws Exception {

        addLogo(doc);
        addHeaderInfo(doc, fonts, stmt);
        addTitle(doc, fonts, stmt);
        addTransactions(doc, fonts, stmt);
        addFooter(doc, fonts);
    }

    // ================= LOGO =================

    private void addLogo(Document doc) throws Exception {
        Image logo = Image.getInstance("sbi.png"); // PNG, NOT SVG
        logo.scaleToFit(120, 40);
        logo.setAlignment(Image.LEFT);
        doc.add(logo);
    }

    // ================= HEADER INFO =================

    private void addHeaderInfo(Document doc, Fonts fonts, Statement stmt)
            throws Exception {

        PdfPTable info = new PdfPTable(3);
        info.setWidthPercentage(100);
        info.setWidths(new float[] { 32, 3, 65 });
        info.setSpacingBefore(8);
        info.setSpacingAfter(10);

        addInfo(info, "Account Name", stmt.details.name, fonts);
        addInfo(info, "Address",
                stmt.details.address != null
                        ? stmt.details.address
                        : "CUSTOMER ADDRESS\nCITY - 000000",
                fonts);
        addInfo(info, "Date", format(stmt.meta.generatedAt), fonts);
        addInfo(info, "Account Number", stmt.details.accountNumber, fonts);
        addInfo(info, "Account Description",
                "REGULAR SB CHQ-INDIVIDUALS", fonts);
        addInfo(info, "Branch",
                stmt.details.bankBranch != null
                        ? stmt.details.bankBranch
                        : stmt.details.bankName,
                fonts);
        addInfo(info, "Drawing Power", "0.00", fonts);
        addInfo(info, "Interest Rate (% p.a.)", "2.5", fonts);
        addInfo(info, "MOD Balance", "0.00", fonts);
        addInfo(info, "CIF No.", generateCif(), fonts);
        addInfo(info, "IFSC Code", stmt.details.ifsc, fonts);

        doc.add(info);
    }

    private void addInfo(
            PdfPTable table,
            String label,
            String value,
            Fonts fonts) {
        table.addCell(infoCell(label, fonts.header));
        table.addCell(infoCell(":", fonts.body));
        table.addCell(infoCell(value, fonts.body));
    }

    private PdfPCell infoCell(String text, Font font) {
        PdfPCell c = new PdfPCell(new Phrase(text, font));
        c.setBorder(Rectangle.NO_BORDER);
        c.setPadding(2);
        c.setVerticalAlignment(Element.ALIGN_TOP);
        return c;
    }

    // ================= TITLE =================

    private void addTitle(Document doc, Fonts fonts, Statement stmt)
            throws Exception {

        String start = stmt.meta.statementPeriodStart != null
                ? format(stmt.meta.statementPeriodStart)
                : format(stmt.transactions.get(0).date);

        String end = stmt.meta.statementPeriodEnd != null
                ? format(stmt.meta.statementPeriodEnd)
                : format(
                        stmt.transactions.get(stmt.transactions.size() - 1).date);

        Paragraph title = new Paragraph(
                "Account Statement from " + start + " to " + end,
                fonts.title);
        title.setSpacingBefore(12);
        title.setSpacingAfter(6);

        doc.add(title);
    }

    // ================= TRANSACTIONS =================

    private void addTransactions(Document doc, Fonts fonts, Statement stmt)
            throws Exception {

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setHeaderRows(1);
        table.setWidths(new float[] {
                11, // Txn Date
                11, // Value Date
                28, // Description
                18, // Ref No
                13, // Debit
                14, // Credit
                18 // Balance
        });

        addHeader(table, "Txn Date", fonts);
        addHeader(table, "Value Date", fonts);
        addHeader(table, "Description", fonts);
        addHeader(table, "Ref No./Cheque No.", fonts);
        addHeader(table, "Debit", fonts);
        addHeader(table, "Credit", fonts);
        addHeader(table, "Balance", fonts);

        for (Transaction tx : stmt.transactions) {
            table.addCell(bodyCell(format(tx.date), fonts.body, Element.ALIGN_RIGHT));
            table.addCell(bodyCell(format(tx.date), fonts.body, Element.ALIGN_RIGHT));
            table.addCell(bodyCell(tx.description, fonts.body, Element.ALIGN_LEFT));
            table.addCell(bodyCell(tx.reference, fonts.body, Element.ALIGN_LEFT));
            table.addCell(bodyCell(amount(tx.debit), fonts.body, Element.ALIGN_RIGHT));
            table.addCell(bodyCell(amount(tx.credit), fonts.body, Element.ALIGN_RIGHT));
            table.addCell(bodyCell(amount(tx.balance), fonts.body, Element.ALIGN_RIGHT));
        }

        doc.add(table);
    }

    private void addHeader(PdfPTable table, String text, Fonts fonts) {
        PdfPCell c = new PdfPCell(new Phrase(text, fonts.header));
        c.setPadding(4);
        c.setHorizontalAlignment(Element.ALIGN_LEFT);
        c.setBackgroundColor(Color.WHITE);
        table.addCell(c);
    }

    private PdfPCell bodyCell(String text, Font font, int align) {
        PdfPCell c = new PdfPCell(new Phrase(text != null ? text : "", font));
        c.setPadding(3);
        c.setHorizontalAlignment(align);
        c.setVerticalAlignment(Element.ALIGN_TOP);
        return c;
    }

    // ================= FOOTER =================

    private void addFooter(Document doc, Fonts fonts) throws Exception {

        Paragraph disclaimer = new Paragraph(
                "Please do not share your ATM, Debit/Credit card number, PIN and OTP with anyone. "
                        + "Bank never asks for such information.",
                fonts.small);
        disclaimer.setSpacingBefore(12);

        doc.add(disclaimer);

        doc.add(new Paragraph(
                "**This is a computer generated statement and does not require a signature",
                fonts.small));
    }

    // ================= HELPERS =================

    private static final DateTimeFormatter SBI_FORMAT = DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH);

    private String format(String iso) {
        return OffsetDateTime.parse(iso).format(SBI_FORMAT);
    }

    private String amount(double v) {
        return v <= 0 ? "" : String.format("%,.2f", v);
    }

    private String generateCif() {
        String ts = String.valueOf(System.currentTimeMillis());
        return ts.substring(ts.length() - 11);
    }
}