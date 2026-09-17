package com.railflow.dto;

import java.util.Map;

/**
 * Aggregate analytics response for GET /api/feedback/summary.
 *
 * Demonstrates: Java Streams (for computing averages & distribution),
 * DTOs, and clean API surface design.
 */
public class FeedbackSummaryResponse {

    private long totalFeedback;
    private double averageRating;
    private Map<Integer, Long> ratingDistribution;

    public FeedbackSummaryResponse() {}

    public FeedbackSummaryResponse(long totalFeedback, double averageRating,
                                    Map<Integer, Long> ratingDistribution) {
        this.totalFeedback = totalFeedback;
        this.averageRating = averageRating;
        this.ratingDistribution = ratingDistribution;
    }

    public long getTotalFeedback() { return totalFeedback; }
    public void setTotalFeedback(long totalFeedback) { this.totalFeedback = totalFeedback; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public Map<Integer, Long> getRatingDistribution() { return ratingDistribution; }
    public void setRatingDistribution(Map<Integer, Long> ratingDistribution) {
        this.ratingDistribution = ratingDistribution;
    }
}
