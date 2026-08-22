package com.railflow.enums;

/**
 * Enumerates the operational crowd status of a railway platform.
 */
public enum PlatformStatus {
    EMPTY(0.0, 0.15, "Minimal crowd, plenty of capacity"),
    NORMAL(0.15, 0.70, "Normal passenger volume"),
    WARNING(0.70, 0.90, "Elevated crowd density, approaching capacity"),
    CRITICAL(0.90, Double.MAX_VALUE, "Overcrowded, immediate intervention required"),
    MAINTENANCE(0.0, 0.0, "Platform is undergoing maintenance");

    private final double minOccupancy;
    private final double maxOccupancy;
    private final String description;

    PlatformStatus(double minOccupancy, double maxOccupancy, String description) {
        this.minOccupancy = minOccupancy;
        this.maxOccupancy = maxOccupancy;
        this.description = description;
    }

    public static PlatformStatus fromOccupancy(double occupancyRate) {
        if (occupancyRate < 0.15) return EMPTY;
        if (occupancyRate < 0.70) return NORMAL;
        if (occupancyRate < 0.90) return WARNING;
        return CRITICAL;
    }

    public double getMinOccupancy() {
        return minOccupancy;
    }

    public double getMaxOccupancy() {
        return maxOccupancy;
    }

    public String getDescription() {
        return description;
    }
}
