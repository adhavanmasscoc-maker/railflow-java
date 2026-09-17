package com.railflow.io;

import java.util.ArrayList;
import java.util.List;

/**
 * High-performance pure Java RFC 4180 compliant CSV line tokenizer.
 * Handles embedded quotes, commas inside strings, and empty columns.
 */
public class CsvParser {

    /**
     * Parses a single CSV line into a list of column strings.
     * Time Complexity: O(L) where L is the line length.
     * Space Complexity: O(L).
     */
    public static List<String> parseLine(String line) {
        List<String> tokens = new ArrayList<>();
        if (line == null) {
            return tokens;
        }

        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    // Escaped double quote ("")
                    sb.append('"');
                    i++;
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                tokens.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        tokens.add(sb.toString().trim());
        return tokens;
    }
}
