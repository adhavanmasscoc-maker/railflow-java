package com.railflow.io;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Reads and extracts raw textual streams from Indian Railways PDF documents using Apache PDFBox.
 */
@Component
public class PdfReader {

    private static final Logger logger = Logger.getLogger(PdfReader.class.getName());

    public String extractText(Path pdfPath) {
        if (pdfPath == null || !Files.exists(pdfPath)) {
            logger.warning("PDF document does not exist: " + pdfPath);
            return "";
        }

        try (PDDocument document = PDDocument.load(pdfPath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Error extracting text from PDF: " + pdfPath, e);
            return "";
        }
    }

    public List<String> extractLines(Path pdfPath) {
        String text = extractText(pdfPath);
        if (text.isEmpty()) return Collections.emptyList();
        String[] rawLines = text.split("\\r?\\n");
        List<String> cleaned = new java.util.ArrayList<>();
        for (String line : rawLines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty()) {
                cleaned.add(trimmed);
            }
        }
        return cleaned;
    }
}
