package com.railflow.model;

import com.railflow.enums.FeedbackCategory;
import com.railflow.enums.FeedbackStatus;

import java.time.LocalDateTime;

/**
 * Domain model representing a single user feedback submission.
 *
 * Demonstrates:
 * - Encapsulation (private fields, public accessors)
 * - OOP (clean domain object separate from DTO/DB concerns)
 * - java.time (LocalDateTime for created_at)
 */
public class Feedback {

    private Long id;
    private String name = "Operations Controller";
    private int rating;
    private FeedbackCategory category;
    private String message;
    private String page;
    private LocalDateTime createdAt;
    private FeedbackStatus status;

    public Feedback() {}

    public Feedback(String name, int rating, FeedbackCategory category, String message, String page) {
        this.name = (name != null && !name.isBlank()) ? name.trim() : "Operations Controller";
        this.rating = rating;
        this.category = category;
        this.message = message;
        this.page = page;
        this.createdAt = LocalDateTime.now();
        this.status = FeedbackStatus.NEW;
    }

    public Feedback(int rating, FeedbackCategory category, String message, String page) {
        this("Operations Controller", rating, category, message, page);
    }

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public FeedbackCategory getCategory() { return category; }
    public void setCategory(FeedbackCategory category) { this.category = category; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPage() { return page; }
    public void setPage(String page) { this.page = page; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public FeedbackStatus getStatus() { return status; }
    public void setStatus(FeedbackStatus status) { this.status = status; }

    @Override
    public String toString() {
        return "Feedback{id=" + id + ", rating=" + rating +
               ", category=" + category + ", page=" + page +
               ", status=" + status + ", createdAt=" + createdAt + "}";
    }
}
