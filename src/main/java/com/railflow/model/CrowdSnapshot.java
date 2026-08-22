package com.railflow.model;

import java.time.LocalDateTime;

/**
 * Immutable time-series record representing station-wide crowd metrics at a specific timestamp.
 */
public record CrowdSnapshot(
        LocalDateTime timestamp,
        int totalCrowd,
        int totalCapacity,
        double averageOccupancyRate,
        int criticalPlatformCount,
        int activeAlertCount
) {
    public static CrowdSnapshot of(int totalCrowd, int totalCapacity, int criticalCount, int alertCount) {
        double occupancy = totalCapacity > 0 ? (double) totalCrowd / totalCapacity : 0.0;
        return new CrowdSnapshot(LocalDateTime.now(), totalCrowd, totalCapacity, occupancy, criticalCount, alertCount);
    }
}
