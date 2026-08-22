package com.railflow.enums;

/**
 * Enumerates types of rule-based platform optimization recommendations.
 */
public enum RecommendationType {
    REDISTRIBUTE("Redistribute incoming crowd from overcrowded to underutilized platform"),
    OPEN_GATE("Open additional entry/exit gates to increase throughput"),
    CLOSE_GATE("Close redundant gates on empty platforms to reallocate staff"),
    CHANGE_PLATFORM("Reassign incoming train to an alternate available platform"),
    HOLD_TRAIN("Temporarily hold approaching train signal until platform clears");

    private final String description;

    RecommendationType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
