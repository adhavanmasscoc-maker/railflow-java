package com.railflow.dto;

import com.railflow.model.PlatformRecommendation;

/**
 * Data Transfer Object for optimization recommendations.
 */
public record RecommendationResponse(
        String id,
        String type,
        String targetPlatformId,
        String targetPlatformName,
        String sourcePlatformId,
        String sourcePlatformName,
        String issueDescription,
        String actionDescription,
        String expectedImpact,
        int priority,
        int estimatedPassengersBenefited,
        boolean applied,
        boolean dismissed,
        String createdAt
) {
    public static RecommendationResponse from(PlatformRecommendation rec) {
        if (rec == null) return null;
        return new RecommendationResponse(
                rec.getId(),
                rec.getType() != null ? rec.getType().name() : "GENERAL",
                rec.getTargetPlatformId(),
                rec.getTargetPlatformName(),
                rec.getSourcePlatformId(),
                rec.getSourcePlatformName(),
                rec.getIssueDescription(),
                rec.getActionDescription(),
                rec.getExpectedImpact(),
                rec.getPriority(),
                rec.getEstimatedPassengersBenefited(),
                rec.isApplied(),
                rec.isDismissed(),
                rec.getCreatedAt() != null ? rec.getCreatedAt().toString() : ""
        );
    }
}
