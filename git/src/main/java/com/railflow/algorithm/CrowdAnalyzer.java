package com.railflow.algorithm;

import com.railflow.enums.PlatformStatus;
import com.railflow.model.Platform;

/**
 * Strategy interface for analyzing platform crowd conditions.
 */
public interface CrowdAnalyzer {

    CrowdAnalysisResult analyze(Platform platform);

    record CrowdAnalysisResult(
            String platformId,
            PlatformStatus status,
            double occupancyRate,
            boolean requiresIntervention,
            String advisoryNote
    ) {}
}
