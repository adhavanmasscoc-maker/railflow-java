package com.railflow.repository;

import com.railflow.enums.AlertSeverity;
import com.railflow.model.Alert;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Alert data access.
 */
public interface AlertRepository {
    Optional<Alert> findById(String id);
    List<Alert> findAll();
    List<Alert> findActive();
    List<Alert> findBySeverity(AlertSeverity severity);
    Alert save(Alert alert);
    Optional<Alert> deleteById(String id);
    void purgeResolvedOlderThan(int hours);
    long count();
}
