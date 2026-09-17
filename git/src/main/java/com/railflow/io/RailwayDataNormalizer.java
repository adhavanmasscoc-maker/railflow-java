package com.railflow.io;

import java.util.Locale;

/**
 * Normalizes railway domain attributes (station codes, train numbers, station names)
 * into standardized enterprise format.
 */
public class RailwayDataNormalizer {

    /**
     * Normalizes 5-digit Indian Railways train number (e.g. "12301" or "2301" -> "02301").
     */
    public static String normalizeTrainNumber(String trainNo) {
        if (trainNo == null) return "00000";
        String clean = trainNo.replaceAll("[^0-9]", "");
        if (clean.length() < 5 && !clean.isEmpty()) {
            return String.format("%05d", Integer.parseInt(clean));
        }
        return clean.isEmpty() ? "00000" : clean;
    }

    /**
     * Normalizes station code into uppercase standard format (e.g. "ndls" -> "NDLS").
     */
    public static String normalizeStationCode(String code) {
        if (code == null) return "UNK";
        return code.trim().toUpperCase(Locale.ENGLISH);
    }

    /**
     * Normalizes station name with title casing and standardized junction tags.
     */
    public static String normalizeStationName(String name) {
        if (name == null || name.trim().isEmpty()) return "Unknown Station";
        String trimmed = name.trim().replaceAll("\\s+", " ");
        
        // Standardize common Indian Railways abbreviations
        trimmed = trimmed.replaceAll("(?i)\\bjn\\b", "Junction")
                         .replaceAll("(?i)\\bterm\\b", "Terminal")
                         .replaceAll("(?i)\\bcnt\\b", "Central")
                         .replaceAll("(?i)\\bcantt\\b", "Cantonment");

        return toTitleCase(trimmed);
    }

    private static String toTitleCase(String input) {
        if (input == null || input.isEmpty()) return input;
        String[] words = input.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0)));
                if (w.length() > 1) {
                    sb.append(w.substring(1).toLowerCase(Locale.ENGLISH));
                }
                sb.append(" ");
            }
        }
        return sb.toString().trim();
    }
}
