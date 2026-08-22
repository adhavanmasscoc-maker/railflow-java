package com.railflow.io;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Robust CSV Reader utilizing Java NIO Path and BufferedReader.
 * Supports streaming large dataset files like ALL_RAILWAY_DATA.csv.
 */
@Component
public class CsvReader {

    private static final Logger logger = Logger.getLogger(CsvReader.class.getName());

    /**
     * Reads all lines from a CSV file into a List of String arrays.
     *
     * @param filePath Path to the CSV file
     * @param maxRows Maximum rows to parse (0 for unlimited)
     * @return List of parsed token arrays
     */
    public List<String[]> readCsv(Path filePath, int maxRows) {
        if (filePath == null || !Files.exists(filePath)) {
            logger.warning("CSV file does not exist at path: " + filePath);
            return Collections.emptyList();
        }

        List<String[]> records = new ArrayList<>();
        try (BufferedReader reader = Files.newBufferedReader(filePath, StandardCharsets.UTF_8)) {
            String line;
            int count = 0;
            while ((line = reader.readLine()) != null) {
                String[] tokens = parseCsvLine(line);
                records.add(tokens);
                count++;
                if (maxRows > 0 && count >= maxRows) {
                    break;
                }
            }
            logger.info("Successfully read " + records.size() + " rows from " + filePath.getFileName());
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Failed to read CSV file: " + filePath, e);
        }
        return records;
    }

    /**
     * Parses standard CSV line handling basic quotes and comma separation.
     */
    public String[] parseCsvLine(String line) {
        if (line == null) return new String[0];
        List<String> tokens = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '\"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                tokens.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        tokens.add(sb.toString().trim());
        return tokens.toArray(new String[0]);
    }
}
