package com.railflow.controller;

import com.railflow.dto.FeedbackRequest;
import com.railflow.dto.FeedbackResponse;
import com.railflow.dto.FeedbackSummaryResponse;
import com.railflow.exception.InvalidFeedbackException;
import com.railflow.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for User Feedback & SQLite Storage.
 *
 * Demonstrates:
 * - REST API conventions
 * - DTO inbound/outbound mapping
 * - Bean Validation handling
 * - Clean Exception Handling & HTTP Status codes
 * - Separation of Concerns (Controller -> Service -> Repository -> SQLite)
 */
@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * POST /api/feedback - Submit new feedback.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitFeedback(
            @Valid @RequestBody FeedbackRequest request,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getAllErrors().get(0).getDefaultMessage();
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("success", false);
            errorBody.put("message", errorMessage);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }

        try {
            FeedbackResponse response = feedbackService.submitFeedback(request);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "Thank you for your feedback! Your review helps improve RailFlow.");
            responseBody.put("data", response);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        } catch (InvalidFeedbackException e) {
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("success", false);
            errorBody.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        } catch (Exception e) {
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("success", false);
            errorBody.put("message", "Unable to submit feedback. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
        }
    }

    /**
     * GET /api/feedback - Retrieve all submitted feedback records.
     */
    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    /**
     * GET /api/feedback/recent - Retrieve top recent feedback entries.
     */
    @GetMapping("/recent")
    public ResponseEntity<List<FeedbackResponse>> getRecentFeedback() {
        return ResponseEntity.ok(feedbackService.getRecentFeedback());
    }

    /**
     * GET /api/feedback/summary - Retrieve aggregate rating stats and star distribution.
     */
    @GetMapping("/summary")
    public ResponseEntity<FeedbackSummaryResponse> getFeedbackSummary() {
        return ResponseEntity.ok(feedbackService.getSummary());
    }

    /**
     * GET /api/feedback/by-page - Retrieve feedback breakdown per application feature/page.
     */
    @GetMapping("/by-page")
    public ResponseEntity<Map<String, Long>> getFeedbackByPage() {
        return ResponseEntity.ok(feedbackService.getFeedbackByPage());
    }
}
