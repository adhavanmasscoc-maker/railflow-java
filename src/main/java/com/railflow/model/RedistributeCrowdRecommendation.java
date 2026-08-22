package com.railflow.model;

import com.railflow.enums.RecommendationType;

/**
 * Recommendation to dynamically redirect passenger foot-traffic from an overcrowded platform to an underutilized one.
 */
public class RedistributeCrowdRecommendation extends PlatformRecommendation {

    private final int crowdToTransfer;

    public RedistributeCrowdRecommendation(String id, String targetPlatformId, String targetPlatformName,
                                           String sourcePlatformId, String sourcePlatformName,
                                           int crowdToTransfer, String issue, String action, String impact, int priority) {
        super(id, RecommendationType.REDISTRIBUTE, targetPlatformId, targetPlatformName, issue, action, impact, priority);
        this.sourcePlatformId = sourcePlatformId;
        this.sourcePlatformName = sourcePlatformName;
        this.crowdToTransfer = Math.max(10, crowdToTransfer);
    }

    @Override
    public boolean apply(Platform targetPlatform) {
        if (targetPlatform == null) return false;
        // Decrease crowd from overloaded platform
        targetPlatform.adjustCrowd(-crowdToTransfer);
        this.applied = true;
        return true;
    }

    public int getCrowdToTransfer() {
        return crowdToTransfer;
    }
}
