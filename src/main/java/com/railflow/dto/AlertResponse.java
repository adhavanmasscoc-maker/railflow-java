package com.railflow.dto;

import com.railflow.model.Alert;

/**
 * Data Transfer Object for System Alerts.
 */
public record AlertResponse(
        String id,
        String platformId,
        String platformName,
        String trainId,
        String trainName,
        String alertType,
        String severity,
        int severityLevel,
        String title,
        String message,
        String recommendedAction,
        boolean active,
        boolean acknowledged,
        String createdAt,
        String resolvedAt
) {
    public static AlertResponse from(Alert a) {
        if (a == null) return null;
        return new AlertResponse(
                a.getId(),
                a.getPlatformId(),
                a.getPlatformName(),
                a.getTrainId(),
                a.getTrainName(),
                a.getAlertType(),
                a.getSeverity() != null ? a.getSeverity().name() : "MEDIUM",
                a.getSeverity() != null ? a.getSeverity().getLevel() : 2,
                a.getTitle(),
                a.getMessage(),
                a.getRecommendedAction(),
                a.isActive(),
                a.isAcknowledged(),
                a.getCreatedAt() != null ? a.getCreatedAt().toString() : "",
                a.getResolvedAt() != null ? a.getResolvedAt().toString() : ""
        );
    }
}
