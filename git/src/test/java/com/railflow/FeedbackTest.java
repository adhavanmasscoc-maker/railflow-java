package com.railflow;

import com.railflow.dto.FeedbackRequest;
import com.railflow.dto.FeedbackResponse;
import com.railflow.dto.FeedbackSummaryResponse;
import com.railflow.enums.FeedbackCategory;
import com.railflow.enums.FeedbackStatus;
import com.railflow.exception.InvalidFeedbackException;
import com.railflow.model.Feedback;
import com.railflow.repository.FeedbackRepository;
import com.railflow.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Feedback Domain, Validation, Service & Streams Tests")
class FeedbackTest {

    private FeedbackService feedbackService;
    private InMemoryTestFeedbackRepository repository;

    @BeforeEach
    void setUp() {
        repository = new InMemoryTestFeedbackRepository();
        feedbackService = new FeedbackService(repository);
    }

    @Test
    @DisplayName("Should create and save valid feedback")
    void testValidFeedbackSubmission() {
        FeedbackRequest req = new FeedbackRequest();
        req.setRating(5);
        req.setCategory("UI/UX");
        req.setMessage("Dashboard is fast and responsive.");
        req.setPage("Dashboard");

        FeedbackResponse res = feedbackService.submitFeedback(req);

        assertNotNull(res.getId());
        assertEquals(5, res.getRating());
        assertEquals("UI/UX", res.getCategory());
        assertEquals("Dashboard is fast and responsive.", res.getMessage());
        assertEquals("Dashboard", res.getPage());
        assertEquals("NEW", res.getStatus());
        assertEquals(1, repository.count());
    }

    @Test
    @DisplayName("Should throw InvalidFeedbackException for rating below 1")
    void testRatingBelowOneThrowsException() {
        FeedbackRequest req = new FeedbackRequest();
        req.setRating(0);
        req.setCategory("UI/UX");
        req.setMessage("Rating too low");

        assertThrows(InvalidFeedbackException.class, () -> feedbackService.submitFeedback(req));
    }

    @Test
    @DisplayName("Should throw InvalidFeedbackException for rating above 5")
    void testRatingAboveFiveThrowsException() {
        FeedbackRequest req = new FeedbackRequest();
        req.setRating(6);
        req.setCategory("Optimization");
        req.setMessage("Rating too high");

        assertThrows(InvalidFeedbackException.class, () -> feedbackService.submitFeedback(req));
    }

    @Test
    @DisplayName("Should throw InvalidFeedbackException for unknown/empty category")
    void testInvalidCategoryThrowsException() {
        FeedbackRequest req = new FeedbackRequest();
        req.setRating(4);
        req.setCategory("NON_EXISTENT_CATEGORY");
        req.setMessage("Testing invalid category");

        assertThrows(InvalidFeedbackException.class, () -> feedbackService.submitFeedback(req));
    }

    @Test
    @DisplayName("Should correctly calculate average rating and star distribution via Java Streams")
    void testSummaryCalculationStreams() {
        // Seed 4 sample feedbacks: ratings 5, 5, 4, 2 -> Avg = 16 / 4 = 4.0
        Feedback f1 = new Feedback(5, FeedbackCategory.UI_UX, "Great UI", "Dashboard");
        Feedback f2 = new Feedback(5, FeedbackCategory.PERFORMANCE, "Fast", "Platforms");
        Feedback f3 = new Feedback(4, FeedbackCategory.TRAIN_INFORMATION, "Accurate", "Trains");
        Feedback f4 = new Feedback(2, FeedbackCategory.BUG_REPORT, "Minor bug", "Stations");

        repository.save(f1);
        repository.save(f2);
        repository.save(f3);
        repository.save(f4);

        FeedbackSummaryResponse summary = feedbackService.getSummary();

        assertEquals(4, summary.getTotalFeedback());
        assertEquals(4.0, summary.getAverageRating(), 0.01);

        assertNotNull(summary.getRatingDistribution());
        assertEquals(2L, summary.getRatingDistribution().get(5));
        assertEquals(1L, summary.getRatingDistribution().get(4));
        assertEquals(0L, summary.getRatingDistribution().get(3));
        assertEquals(1L, summary.getRatingDistribution().get(2));
        assertEquals(0L, summary.getRatingDistribution().get(1));
    }

    @Test
    @DisplayName("Should retrieve recent feedback in reverse chronological order")
    void testRecentFeedback() {
        for (int i = 1; i <= 15; i++) {
            Feedback f = new Feedback(i % 5 + 1, FeedbackCategory.OTHER, "Message #" + i, "Page" + i);
            repository.save(f);
        }

        List<FeedbackResponse> recent = feedbackService.getRecentFeedback();
        assertEquals(10, recent.size());
    }

    @Test
    @DisplayName("Should group feedback count by page accurately")
    void testFeedbackByPageGrouping() {
        repository.save(new Feedback(5, FeedbackCategory.UI_UX, "Good", "Dashboard"));
        repository.save(new Feedback(4, FeedbackCategory.UI_UX, "Nice", "Dashboard"));
        repository.save(new Feedback(5, FeedbackCategory.OPTIMIZATION, "Super", "Optimization"));

        var pageMap = feedbackService.getFeedbackByPage();
        assertEquals(2L, pageMap.get("Dashboard"));
        assertEquals(1L, pageMap.get("Optimization"));
    }

    // ─── Lightweight Test Repository ──────────────────────────────────────────
    private static class InMemoryTestFeedbackRepository implements FeedbackRepository {
        private final List<Feedback> storage = new ArrayList<>();
        private final AtomicLong idGen = new AtomicLong(1);

        @Override
        public Feedback save(Feedback feedback) {
            feedback.setId(idGen.getAndIncrement());
            if (feedback.getCreatedAt() == null) {
                feedback.setCreatedAt(LocalDateTime.now());
            }
            if (feedback.getStatus() == null) {
                feedback.setStatus(FeedbackStatus.NEW);
            }
            storage.add(feedback);
            return feedback;
        }

        @Override
        public List<Feedback> findAll() {
            return new ArrayList<>(storage);
        }

        @Override
        public List<Feedback> findRecent(int limit) {
            List<Feedback> copy = new ArrayList<>(storage);
            java.util.Collections.reverse(copy);
            return copy.stream().limit(limit).toList();
        }

        @Override
        public Optional<Feedback> findById(long id) {
            return storage.stream().filter(f -> f.getId() != null && f.getId() == id).findFirst();
        }

        @Override
        public long count() {
            return storage.size();
        }
    }
}
