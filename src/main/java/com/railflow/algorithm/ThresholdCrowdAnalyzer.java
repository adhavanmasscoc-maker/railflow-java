package com.railflow.algorithm;

import com.railflow.enums.PlatformStatus;
import com.railflow.model.Platform;
import org.springframework.stereotype.Component;

/**
 * Deterministic threshold-based crowd analyzer.
 */
@Component("thresholdCrowdAnalyzer")
public class ThresholdCrowdAnalyzer implements CrowdAnalyzer {

    private static final double WARNING_THRESHOLD = 0.70;
    private static final double CRITICAL_THRESHOLD = 0.90;

    @Override
    public CrowdAnalysisResult analyze(Platform platform) {
        if (platform == null) {
            return new CrowdAnalysisResult("UNKNOWN", PlatformStatus.EMPTY, 0.0, false, "Platform is null");
        }

        double occupancy = platform.getOccupancyRate();
        PlatformStatus status = PlatformStatus.fromOccupancy(occupancy);
        boolean intervention = occupancy >= WARNING_THRESHOLD;

        String note;
        if (occupancy >= CRITICAL_THRESHOLD) {
            note = String.format("CRITICAL: Platform %s is at %.1f%% capacity. Immediate gate opening and passenger rerouting required.",
                    platform.getName(), occupancy * 100);
        } else if (occupancy >= WARNING_THRESHOLD) {
            note = String.format("WARNING: Platform %s crowd density elevated (%.1f%%). Prepare gate throughput expansion.",
                    platform.getName(), occupancy * 100);
        } else if (occupancy < 0.20) {
            note = String.format("UNDERUTILIZED: Platform %s has ample capacity (%.1f%%). Ideal for train redirection.",
                    platform.getName(), occupancy * 100);
        } else {
            note = String.format("NOMINAL: Platform %s operating within standard safety limits (%.1f%%).",
                    platform.getName(), occupancy * 100);
        }

        return new CrowdAnalysisResult(platform.getId(), status, occupancy, intervention, note);
    }
}
