package com.railflow.model;

import com.railflow.enums.GateStatus;
import com.railflow.enums.RecommendationType;

/**
 * Recommendation to open additional station gates on an overcrowded platform.
 */
public class OpenGateRecommendation extends PlatformRecommendation {

    private final int gatesToOpen;

    public OpenGateRecommendation(String id, String targetPlatformId, String targetPlatformName,
                                  int gatesToOpen, String issue, String action, String impact, int priority) {
        super(id, RecommendationType.OPEN_GATE, targetPlatformId, targetPlatformName, issue, action, impact, priority);
        this.gatesToOpen = gatesToOpen;
    }

    @Override
    public boolean apply(Platform targetPlatform) {
        if (targetPlatform == null) return false;
        int opened = 0;
        for (Gate gate : targetPlatform.getGates()) {
            if (!gate.isOpen() && opened < gatesToOpen) {
                gate.setStatus(GateStatus.OPEN);
                opened++;
            }
        }
        this.applied = true;
        return true;
    }

    public int getGatesToOpen() {
        return gatesToOpen;
    }
}
