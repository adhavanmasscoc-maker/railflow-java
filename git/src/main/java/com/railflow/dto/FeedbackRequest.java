package com.railflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Inbound DTO for POST /api/feedback.
 *
 * Bean Validation annotations enforce constraints before reaching the service layer.
 * Demonstrates: DTOs, validation, encapsulation, SOLID (single responsibility).
 */
public class FeedbackRequest {

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Message cannot be empty")
    @Size(min = 3, max = 2000, message = "Message must be between 3 and 2000 characters")
    private String message;

    private String page;

    // Getters & Setters
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPage() { return page; }
    public void setPage(String page) { this.page = page; }
}
