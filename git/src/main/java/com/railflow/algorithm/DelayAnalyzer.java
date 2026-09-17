package com.railflow.algorithm;

import com.railflow.model.Train;

import java.util.*;
import java.util.stream.Collectors;

/**
 * DSA Algorithm for analyzing train punctuality, delay distribution, and route bottleneck statistics.
 */
public class DelayAnalyzer {

    /**
     * Calculates statistical summary of train delays across the active schedule.
     * Time Complexity: O(N).
     * Space Complexity: O(1).
     */
    public static Map<String, Object> analyzeDelays(List<Train> trains) {
        Map<String, Object> metrics = new LinkedHashMap<>();

        if (trains == null || trains.isEmpty()) {
            metrics.put("totalTrains", 0);
            metrics.put("delayedTrainsCount", 0);
            metrics.put("onTimePercentage", 100.0);
            metrics.put("averageDelayMinutes", 0.0);
            metrics.put("maxDelayMinutes", 0);
            return metrics;
        }

        int total = trains.size();
        List<Train> delayed = trains.stream()
                .filter(t -> t.getDelayMinutes() > 0)
                .collect(Collectors.toList());

        int delayedCount = delayed.size();
        double onTimePct = ((double) (total - delayedCount) / total) * 100.0;
        double avgDelay = delayed.stream().mapToInt(Train::getDelayMinutes).average().orElse(0.0);
        int maxDelay = delayed.stream().mapToInt(Train::getDelayMinutes).max().orElse(0);

        metrics.put("totalTrains", total);
        metrics.put("delayedTrainsCount", delayedCount);
        metrics.put("onTimePercentage", Math.round(onTimePct * 10.0) / 10.0);
        metrics.put("averageDelayMinutes", Math.round(avgDelay * 10.0) / 10.0);
        metrics.put("maxDelayMinutes", maxDelay);

        return metrics;
    }
}
