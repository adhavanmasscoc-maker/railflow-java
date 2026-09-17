package com.railflow.model;

import com.railflow.enums.GateStatus;
import com.railflow.enums.RecommendationType;

/**
 * Recommendation to close redundant gates on empty platforms for staff redeployment.
 */
public class CloseGateRecommendation extends PlatformRecommendation {

    private final int gatesToClose;

    public CloseGateRecommendation(String id, String targetPlatformId, String targetPlatformName,
                                   int gatesToClose, String issue, String action, String impact, int priority) {
        super(id, RecommendationType.CLOSE_GATE, targetPlatformId, targetPlatformName, issue, action, impact, priority);
        this.gatesToClose = gatesToClose;
    }

    @Override
    public boolean apply(Platform targetPlatform) {
        if (targetPlatform == null) return false;
        int closed = 0;
        for (Gate gate : targetPlatform.getGates()) {
            if (gate.isOpen() && closed < gatesToClose) {
                gate.setStatus(GateStatus.CLOSED);
                closed++;
            }
        }
        this.applied = true;
        return true;
    }

    public int getGatesToClose() {
        return gatesToClose;
    }
}
