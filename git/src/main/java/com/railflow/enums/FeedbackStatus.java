package com.railflow.enums;

/**
 * Lifecycle status of a feedback submission.
 * Demonstrates Java Enum — stored as TEXT in SQLite.
 */
public enum FeedbackStatus {
    NEW,
    REVIEWED,
    RESOLVED;

    public static FeedbackStatus fromString(String val) {
        if (val == null) return NEW;
        try {
            return FeedbackStatus.valueOf(val.toUpperCase().trim());
        } catch (Exception e) {
            return NEW;
        }
    }
}
