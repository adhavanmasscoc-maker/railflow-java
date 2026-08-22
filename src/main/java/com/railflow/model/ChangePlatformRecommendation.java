package com.railflow.model;

import com.railflow.enums.RecommendationType;

/**
 * Recommendation to reassign an incoming train to an alternate platform with low crowd density.
 */
public class ChangePlatformRecommendation extends PlatformRecommendation {

    private final String trainNumber;
    private final String alternatePlatformId;
    private final String alternatePlatformName;

    public ChangePlatformRecommendation(String id, String targetPlatformId, String targetPlatformName,
                                        String trainNumber, String alternatePlatformId, String alternatePlatformName,
                                        String issue, String action, String impact, int priority) {
        super(id, RecommendationType.CHANGE_PLATFORM, targetPlatformId, targetPlatformName, issue, action, impact, priority);
        this.trainNumber = trainNumber;
        this.alternatePlatformId = alternatePlatformId;
        this.alternatePlatformName = alternatePlatformName;
    }

    @Override
    public boolean apply(Platform targetPlatform) {
        if (targetPlatform == null) return false;
        // Unbind train from overloaded target platform
        targetPlatform.setCurrentTrainId(null);
        targetPlatform.setCurrentTrainName(null);
        this.applied = true;
        return true;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public String getAlternatePlatformId() {
        return alternatePlatformId;
    }

    public String getAlternatePlatformName() {
        return alternatePlatformName;
    }
}
