package com.railflow.model;

import java.util.Objects;

/**
 * Represents an empirical raw record parsed directly from the Indian Railways master CSV dataset.
 */
public class RailwayRecord {

    private final String sourcePdf;
    private final String sourcePage;
    private final String year;
    private final String category;
    private final double broadGaugeMetric;
    private final double metreGaugeMetric;
    private final double narrowGaugeMetric;
    private final double totalMetric;
    private final boolean valid;

    public RailwayRecord(String sourcePdf, String sourcePage, String year, String category,
                         double broadGaugeMetric, double metreGaugeMetric, double narrowGaugeMetric,
                         double totalMetric, boolean valid) {
        this.sourcePdf = sourcePdf != null ? sourcePdf : "N/A";
        this.sourcePage = sourcePage != null ? sourcePage : "N/A";
        this.year = year != null ? year : "Unknown";
        this.category = category != null ? category : "General";
        this.broadGaugeMetric = broadGaugeMetric;
        this.metreGaugeMetric = metreGaugeMetric;
        this.narrowGaugeMetric = narrowGaugeMetric;
        this.totalMetric = totalMetric;
        this.valid = valid;
    }

    public String getSourcePdf() {
        return sourcePdf;
    }

    public String getSourcePage() {
        return sourcePage;
    }

    public String getYear() {
        return year;
    }

    public String getCategory() {
        return category;
    }

    public double getBroadGaugeMetric() {
        return broadGaugeMetric;
    }

    public double getMetreGaugeMetric() {
        return metreGaugeMetric;
    }

    public double getNarrowGaugeMetric() {
        return narrowGaugeMetric;
    }

    public double getTotalMetric() {
        return totalMetric;
    }

    public boolean isValid() {
        return valid;
    }

    @Override
    public String toString() {
        return "RailwayRecord{" +
                "year='" + year + '\'' +
                ", category='" + category + '\'' +
                ", totalMetric=" + totalMetric +
                ", valid=" + valid +
                '}';
    }
}
