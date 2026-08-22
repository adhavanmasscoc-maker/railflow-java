package com.railflow.dto;

import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object aggregating station-wide metrics for the main UI dashboard.
 */
public record DashboardStatsResponse(
        int totalPlatforms,
        int totalCapacity,
        int totalCurrentCrowd,
        double averageOccupancyRate,
        int averageOccupancyPercentage,
        int criticalPlatformsCount,
        int warningPlatformsCount,
        int normalPlatformsCount,
        int activeTrainsCount,
        int delayedTrainsCount,
        int arrivingSoonTrainsCount,
        int activeAlertsCount,
        int totalRecommendationsCount,
        List<Map<String, Object>> hourlyCrowdHistory,
        String stationName,
        String stationCode,
        String timestamp
) {}
