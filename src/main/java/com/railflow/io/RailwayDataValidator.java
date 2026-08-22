package com.railflow.io;

import com.railflow.model.RailwayRecord;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Validates raw railway CSV rows and maintains comprehensive dataset quality metrics.
 */
public class RailwayDataValidator {

    private final AtomicLong totalRecords = new AtomicLong(0);
    private final AtomicLong validRecords = new AtomicLong(0);
    private final AtomicLong invalidRecords = new AtomicLong(0);
    private final AtomicLong duplicateRecords = new AtomicLong(0);
    private final AtomicLong missingValuesCount = new AtomicLong(0);
    private final Set<String> seenHashes = Collections.synchronizedSet(new HashSet<>());

    /**
     * Validates a parsed CSV line and returns a validated RailwayRecord.
     */
    public RailwayRecord validateAndCreate(List<String> columns) {
        totalRecords.incrementAndGet();

        if (columns == null || columns.size() < 4) {
            invalidRecords.incrementAndGet();
            return new RailwayRecord("N/A", "N/A", "Unknown", "Malformed", 0, 0, 0, 0, false);
        }

        String pdf = columns.get(0);
        String page = columns.size() > 1 ? columns.get(1) : "";
        String year = columns.size() > 3 ? columns.get(3) : "";
        String category = columns.size() > 4 ? columns.get(4) : "General";

        // Check for missing values
        for (String col : columns) {
            if (col == null || col.trim().isEmpty() || col.equalsIgnoreCase("null") || col.equals("--")) {
                missingValuesCount.incrementAndGet();
            }
        }

        // Duplicate check
        String rowSignature = String.join("|", columns);
        if (!seenHashes.add(rowSignature)) {
            duplicateRecords.incrementAndGet();
        }

        double bg = parseDoubleSafe(columns.size() > 7 ? columns.get(7) : "0");
        double mg = parseDoubleSafe(columns.size() > 8 ? columns.get(8) : "0");
        double ng = parseDoubleSafe(columns.size() > 9 ? columns.get(9) : "0");
        double total = parseDoubleSafe(columns.size() > 10 ? columns.get(10) : "0");

        validRecords.incrementAndGet();
        return new RailwayRecord(pdf, page, year, category, bg, mg, ng, total, true);
    }

    private double parseDoubleSafe(String val) {
        if (val == null) return 0.0;
        try {
            String clean = val.replaceAll("[^0-9.-]", "");
            return clean.isEmpty() ? 0.0 : Double.parseDouble(clean);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    public Map<String, Object> getDataQualityReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalRecords", totalRecords.get());
        report.put("validRecords", validRecords.get());
        report.put("invalidRecords", invalidRecords.get());
        report.put("duplicateRecords", duplicateRecords.get());
        report.put("missingValuesCount", missingValuesCount.get());
        
        long total = totalRecords.get();
        double qualityScore = total > 0 ? ((double) validRecords.get() / total) * 100.0 : 100.0;
        report.put("dataQualityScorePercentage", Math.round(qualityScore * 10.0) / 10.0);
        return report;
    }

    public void reset() {
        totalRecords.set(0);
        validRecords.set(0);
        invalidRecords.set(0);
        duplicateRecords.set(0);
        missingValuesCount.set(0);
        seenHashes.clear();
    }
}
