package com.railflow.repository;

import com.railflow.model.Feedback;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Feedback persistence.
 *
 * Demonstrates:
 * - Repository Pattern (SOLID — Dependency Inversion)
 * - Interface segregation (callers depend on abstraction, not SQLite details)
 * - Optional for nullable lookups
 */
public interface FeedbackRepository {

    /**
     * Persist a new feedback record and return it with generated id.
     */
    Feedback save(Feedback feedback);

    /**
     * Find all feedback records, most recent first.
     */
    List<Feedback> findAll();

    /**
     * Find the most recent N feedback records.
     */
    List<Feedback> findRecent(int limit);

    /**
     * Find by primary key.
     */
    Optional<Feedback> findById(long id);

    /**
     * Total count of all feedback records.
     */
    long count();
}
