package com.railflow.service;

import com.railflow.dto.FeedbackRequest;
import com.railflow.dto.FeedbackResponse;
import com.railflow.dto.FeedbackSummaryResponse;
import com.railflow.enums.FeedbackCategory;
import com.railflow.exception.InvalidFeedbackException;
import com.railflow.model.Feedback;
import com.railflow.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Business-logic layer for Feedback operations.
 *
 * Demonstrates:
 * - Service Layer Pattern
 * - Java Streams (average, groupingBy, counting)
 * - Collections (Map, List)
 * - Enum parsing & validation
 * - Exception handling
 * - SOLID (Single Responsibility, Dependency Inversion)
 * - Optional
 *
 * Rate-limiting: simple last-submission time tracked per service instance.
 */
@Service
public class FeedbackService {

    /** Minimum milliseconds between submissions from the same JVM session. */
    private static final long SUBMISSION_COOLDOWN_MS = 5_000;

    private final FeedbackRepository feedbackRepository;
    private LocalDateTime lastSubmissionTime = null;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    // ─── Submit Feedback ─────────────────────────────────────────────────────

    /**
     * Validate, map, and persist a new feedback record.
     *
     * @param request inbound DTO (already Bean-Validated at controller layer)
     * @return persisted FeedbackResponse with generated id
     */
    public FeedbackResponse submitFeedback(FeedbackRequest request) {
        // Extra business validation (Belt & Suspenders beyond Bean Validation)
        validateCooldown();
        validateRating(request.getRating());

        FeedbackCategory category = parseCategory(request.getCategory());
        String sanitizedMessage = sanitize(request.getMessage());
        String sanitizedPage    = sanitize(request.getPage());

        Feedback feedback = new Feedback(
                request.getRating(),
                category,
                sanitizedMessage,
                sanitizedPage
        );

        Feedback saved = feedbackRepository.save(feedback);
        lastSubmissionTime = LocalDateTime.now();

        return toResponse(saved);
    }

    // ─── Read Feedback ───────────────────────────────────────────────────────

    public List<FeedbackResponse> getAllFeedback() {
        return feedbackRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> getRecentFeedback() {
        return feedbackRepository.findRecent(10)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Summary Analytics (Java Streams) ────────────────────────────────────

    /**
     * Compute summary statistics using Java Streams.
     * Demonstrates: Collectors.averagingInt, Collectors.groupingBy, Collectors.counting.
     */
    public FeedbackSummaryResponse getSummary() {
        List<Feedback> all = feedbackRepository.findAll();

        long total = all.size();
        double avg = all.stream()
                .collect(Collectors.averagingInt(Feedback::getRating));

        // Distribution: 1→5 star counts, ordered by star value
        Map<Integer, Long> rawDistribution = all.stream()
                .collect(Collectors.groupingBy(Feedback::getRating, Collectors.counting()));

        // Ensure all ratings 1–5 present in output even if zero
        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int i = 5; i >= 1; i--) {
            distribution.put(i, rawDistribution.getOrDefault(i, 0L));
        }

        // Round average to 1 decimal
        double roundedAvg = Math.round(avg * 10.0) / 10.0;

        return new FeedbackSummaryResponse(total, roundedAvg, distribution);
    }

    // ─── Analytics by page ───────────────────────────────────────────────────

    /**
     * Return feedback count grouped by page name using Java Streams.
     */
    public Map<String, Long> getFeedbackByPage() {
        return feedbackRepository.findAll()
                .stream()
                .filter(f -> f.getPage() != null && !f.getPage().isBlank())
                .collect(Collectors.groupingBy(Feedback::getPage, Collectors.counting()))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    private void validateCooldown() {
        if (lastSubmissionTime != null) {
            long msSince = java.time.Duration.between(lastSubmissionTime, LocalDateTime.now()).toMillis();
            if (msSince < SUBMISSION_COOLDOWN_MS) {
                throw new InvalidFeedbackException(
                    "Please wait a moment before submitting again."
                );
            }
        }
    }

    private void validateRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new InvalidFeedbackException("Rating must be between 1 and 5.");
        }
    }

    private FeedbackCategory parseCategory(String rawCategory) {
        try {
            return FeedbackCategory.fromString(rawCategory);
        } catch (IllegalArgumentException e) {
            throw new InvalidFeedbackException("Invalid feedback category: " + rawCategory);
        }
    }

    /** Strip HTML/script tags from user input to prevent XSS display. */
    private String sanitize(String input) {
        if (input == null) return "";
        return input.replaceAll("<[^>]*>", "").trim();
    }

    private FeedbackResponse toResponse(Feedback f) {
        return new FeedbackResponse(
                f.getId(),
                f.getRating(),
                f.getCategory() != null ? f.getCategory().getDisplayName() : "",
                f.getMessage(),
                f.getPage(),
                f.getCreatedAt(),
                f.getStatus() != null ? f.getStatus().name() : "NEW"
        );
    }
}
