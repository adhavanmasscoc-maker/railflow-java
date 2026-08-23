package com.railflow.dto;

import java.time.LocalDateTime;

/**
 * Outbound DTO for a single feedback record.
 * Keeps internal domain model decoupled from API surface (SOLID — Interface Segregation).
 */
public class FeedbackResponse {

    private Long id;
    private int rating;
    private String category;
    private String message;
    private String page;
    private LocalDateTime createdAt;
    private String status;

    public FeedbackResponse() {}

    public FeedbackResponse(Long id, int rating, String category, String message,
                             String page, LocalDateTime createdAt, String status) {
        this.id = id;
        this.rating = rating;
        this.category = category;
        this.message = message;
        this.page = page;
        this.createdAt = createdAt;
        this.status = status;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPage() { return page; }
    public void setPage(String page) { this.page = page; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
