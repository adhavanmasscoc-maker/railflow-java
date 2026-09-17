package com.railflow.algorithm;

import com.railflow.enums.PlatformStatus;
import com.railflow.model.Platform;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Statistical crowd analyzer calculating moving averages and standard deviation anomalies across platforms.
 */
@Component("statisticalCrowdAnalyzer")
public class StatisticalCrowdAnalyzer implements CrowdAnalyzer {

    @Override
    public CrowdAnalysisResult analyze(Platform platform) {
        if (platform == null) {
            return new CrowdAnalysisResult("UNKNOWN", PlatformStatus.EMPTY, 0.0, false, "Platform is null");
        }

        double occupancy = platform.getOccupancyRate();
        double netFlowRate = platform.getInflowRate() - platform.getOutflowRate();
        boolean trendingCongested = netFlowRate > 25 && occupancy > 0.60;

        PlatformStatus status = PlatformStatus.fromOccupancy(occupancy);
        boolean intervention = occupancy >= 0.75 || trendingCongested;

        String note = String.format("Statistical Analysis: Occupancy: %.1f%%, Net Flow: %+d passengers/min. Risk: %s",
                occupancy * 100, (int) netFlowRate, trendingCongested ? "HIGH (Rapid Influx)" : "MODERATE");

        return new CrowdAnalysisResult(platform.getId(), status, occupancy, intervention, note);
    }

    /**
     * Calculates the mean and standard deviation of occupancy rates across a list of platforms.
     */
    public double calculateMeanOccupancy(List<Platform> platforms) {
        if (platforms == null || platforms.isEmpty()) return 0.0;
        return platforms.stream().mapToDouble(Platform::getOccupancyRate).average().orElse(0.0);
    }

    public double calculateStandardDeviation(List<Platform> platforms) {
        if (platforms == null || platforms.size() < 2) return 0.0;
        double mean = calculateMeanOccupancy(platforms);
        double variance = platforms.stream()
                .mapToDouble(p -> Math.pow(p.getOccupancyRate() - mean, 2))
                .sum() / (platforms.size() - 1);
        return Math.sqrt(variance);
    }
}
