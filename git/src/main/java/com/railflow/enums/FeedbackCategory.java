package com.railflow.enums;

/**
 * Feedback category enum — demonstrates Java Enum with clean type-safe constants.
 * Used throughout the Feedback feature for category validation and grouping.
 */
public enum FeedbackCategory {
    OVERALL_EXPERIENCE("Overall Experience"),
    TRAIN_INFORMATION("Train Information"),
    STATION_INFORMATION("Station Information"),
    PLATFORM_MONITORING("Platform Monitoring"),
    CROWD_MONITORING("Crowd Monitoring"),
    OPTIMIZATION("Optimization"),
    DATA_ACCURACY("Data Accuracy"),
    UI_UX("UI/UX"),
    PERFORMANCE("Performance"),
    BUG_REPORT("Bug Report"),
    FEATURE_REQUEST("Feature Request"),
    OTHER("Other");

    private final String displayName;

    FeedbackCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Case-insensitive lookup by display name or enum name.
     */
    public static FeedbackCategory fromString(String value) {
        for (FeedbackCategory cat : values()) {
            if (cat.name().equalsIgnoreCase(value) || cat.displayName.equalsIgnoreCase(value)) {
                return cat;
            }
        }
        throw new IllegalArgumentException("Unknown feedback category: " + value);
    }
}
