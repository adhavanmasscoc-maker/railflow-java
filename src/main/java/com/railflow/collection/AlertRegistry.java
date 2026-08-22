package com.railflow.collection;

import com.railflow.enums.AlertSeverity;
import com.railflow.model.Alert;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Dedicated registry for active and historical system alerts.
 * Uses PriorityQueue and Deque for alert handling.
 */
@Component
public class AlertRegistry extends DataRegistry<String, Alert> {

    /**
     * Returns all active alerts ordered by highest severity and latest timestamp.
     */
    public List<Alert> getActiveAlertsPrioritized() {
        PriorityQueue<Alert> priorityQueue = new PriorityQueue<>();
        for (Alert a : storage.values()) {
            if (a.isActive()) {
                priorityQueue.offer(a);
            }
        }

        List<Alert> result = new ArrayList<>();
        while (!priorityQueue.isEmpty()) {
            result.add(priorityQueue.poll());
        }
        return result;
    }

    public List<Alert> findBySeverity(AlertSeverity severity) {
        return filter(a -> a.getSeverity() == severity);
    }

    public void removeResolvedOlderThan(int hours) {
        LocalDateTime threshold = LocalDateTime.now().minusHours(hours);
        storage.entrySet().removeIf(e -> !e.getValue().isActive() && e.getValue().getCreatedAt().isBefore(threshold));
    }
}
