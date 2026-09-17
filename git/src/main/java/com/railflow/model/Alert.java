package com.railflow.model;

import com.railflow.enums.AlertSeverity;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Domain model representing an automated congestion, safety, or delay alert.
 */
public class Alert implements Comparable<Alert> {

    private final String id;
    private String platformId;
    private String platformName;
    private String trainId;
    private String trainName;
    private String alertType; // HIGH_CROWD, CRITICAL_OVERCROWDING, TRAIN_DELAY, GATE_CONGESTION
    private AlertSeverity severity;
    private String title;
    private String message;
    private String recommendedAction;
    private boolean active;
    private boolean acknowledged;
    private final LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public Alert(String id, String alertType, AlertSeverity severity, String title, String message) {
        this.id = Objects.requireNonNull(id, "Alert ID cannot be null");
        this.alertType = alertType != null ? alertType : "SYSTEM_ALERT";
        this.severity = severity != null ? severity : AlertSeverity.MEDIUM;
        this.title = title != null ? title : "Station Alert";
        this.message = message != null ? message : "";
        this.active = true;
        this.acknowledged = false;
        this.createdAt = LocalDateTime.now();
    }

    public void acknowledge() {
        this.acknowledged = true;
    }

    public void resolve() {
        this.active = false;
        this.resolvedAt = LocalDateTime.now();
    }

    @Override
    public int compareTo(Alert other) {
        if (other == null) return 1;
        // Primary sort: severity level (highest first), Secondary sort: newest first
        int sevComp = Integer.compare(other.severity.getLevel(), this.severity.getLevel());
        if (sevComp != 0) return sevComp;
        return other.createdAt.compareTo(this.createdAt);
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getPlatformId() { return platformId; }
    public void setPlatformId(String platformId) { this.platformId = platformId; }
    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }
    public String getTrainId() { return trainId; }
    public void setTrainId(String trainId) { this.trainId = trainId; }
    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }
    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }
    public AlertSeverity getSeverity() { return severity; }
    public void setSeverity(AlertSeverity severity) { this.severity = severity; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Alert alert = (Alert) o;
        return Objects.equals(id, alert.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return String.format("Alert[%s | %s | %s: %s | Active: %b]",
                id, severity, alertType, title, active);
    }
}
