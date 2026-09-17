package com.railflow.model;

import com.railflow.enums.RecommendationType;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Base domain model for platform optimization recommendations.
 * Implements polymorphism for executing specific mitigation actions.
 */
public abstract class PlatformRecommendation implements Comparable<PlatformRecommendation> {

    protected final String id;
    protected final RecommendationType type;
    protected final String targetPlatformId;
    protected final String targetPlatformName;
    protected String sourcePlatformId;
    protected String sourcePlatformName;
    protected String issueDescription;
    protected String actionDescription;
    protected String expectedImpact;
    protected int priority; // 1-100 (100 = highest urgency)
    protected int estimatedPassengersBenefited;
    protected boolean applied;
    protected boolean dismissed;
    protected final LocalDateTime createdAt;

    public PlatformRecommendation(String id, RecommendationType type,
                                  String targetPlatformId, String targetPlatformName,
                                  String issueDescription, String actionDescription,
                                  String expectedImpact, int priority) {
        this.id = Objects.requireNonNull(id, "Recommendation ID cannot be null");
        this.type = Objects.requireNonNull(type, "Recommendation type cannot be null");
        this.targetPlatformId = targetPlatformId;
        this.targetPlatformName = targetPlatformName;
        this.issueDescription = issueDescription;
        this.actionDescription = actionDescription;
        this.expectedImpact = expectedImpact;
        this.priority = Math.min(100, Math.max(1, priority));
        this.applied = false;
        this.dismissed = false;
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Executes the polymorphic recommendation against target domain objects.
     * @param targetPlatform The target platform to apply action on
     * @return boolean indicating execution success
     */
    public abstract boolean apply(Platform targetPlatform);

    public void dismiss() {
        this.dismissed = true;
    }

    @Override
    public int compareTo(PlatformRecommendation other) {
        if (other == null) return 1;
        // Higher priority recommendations come first
        return Integer.compare(other.priority, this.priority);
    }

    // Getters and Setters
    public String getId() { return id; }
    public RecommendationType getType() { return type; }
    public String getTargetPlatformId() { return targetPlatformId; }
    public String getTargetPlatformName() { return targetPlatformName; }
    public String getSourcePlatformId() { return sourcePlatformId; }
    public void setSourcePlatformId(String sourcePlatformId) { this.sourcePlatformId = sourcePlatformId; }
    public String getSourcePlatformName() { return sourcePlatformName; }
    public void setSourcePlatformName(String sourcePlatformName) { this.sourcePlatformName = sourcePlatformName; }
    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }
    public String getActionDescription() { return actionDescription; }
    public void setActionDescription(String actionDescription) { this.actionDescription = actionDescription; }
    public String getExpectedImpact() { return expectedImpact; }
    public void setExpectedImpact(String expectedImpact) { this.expectedImpact = expectedImpact; }
    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }
    public int getEstimatedPassengersBenefited() { return estimatedPassengersBenefited; }
    public void setEstimatedPassengersBenefited(int estimatedPassengersBenefited) { this.estimatedPassengersBenefited = estimatedPassengersBenefited; }
    public boolean isApplied() { return applied; }
    public void setApplied(boolean applied) { this.applied = applied; }
    public boolean isDismissed() { return dismissed; }
    public void setDismissed(boolean dismissed) { this.dismissed = dismissed; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return String.format("Recommendation[%s | %s | Platform: %s | Priority: %d]",
                id, type, targetPlatformName, priority);
    }
}
