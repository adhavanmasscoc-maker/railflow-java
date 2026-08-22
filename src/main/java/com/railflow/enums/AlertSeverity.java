package com.railflow.enums;

/**
 * Enumerates the severity levels for system alerts.
 */
public enum AlertSeverity {
    LOW(1, "Informational or low-risk threshold reached"),
    MEDIUM(2, "Moderate congestion or minor train delay"),
    HIGH(3, "Platform occupancy > 85% or significant delay"),
    CRITICAL(4, "Platform capacity exceeded (> 100%) or safety risk");

    private final int level;
    private final String description;

    AlertSeverity(int level, String description) {
        this.level = level;
        this.description = description;
    }

    public int getLevel() {
        return level;
    }

    public String getDescription() {
        return description;
    }
}
