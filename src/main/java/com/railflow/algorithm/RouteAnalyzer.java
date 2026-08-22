package com.railflow.algorithm;

import com.railflow.model.Train;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Algorithmic utility for analyzing train routes, delay propagation, and route density.
 */
public class RouteAnalyzer {

    /**
     * Groups trains by origin-destination sector corridors.
     */
    public static Map<String, List<Train>> groupTrainsByCorridor(List<Train> trains) {
        if (trains == null) return Collections.emptyMap();
        return trains.stream()
                .collect(Collectors.groupingBy(Train::getRoute));
    }

    /**
     * Calculates cumulative delay across a specific corridor.
     */
    public static int calculateTotalCorridorDelay(List<Train> trains, String corridor) {
        if (trains == null || corridor == null) return 0;
        return trains.stream()
                .filter(t -> corridor.equalsIgnoreCase(t.getRoute()))
                .mapToInt(Train::getDelayMinutes)
                .sum();
    }

    /**
     * Detects high-risk delay cascading when multiple trains on the same route are delayed.
     */
    public static boolean isCorridorAtRisk(List<Train> trains, String corridor, int thresholdDelayedTrains) {
        if (trains == null || corridor == null) return false;
        long delayedCount = trains.stream()
                .filter(t -> corridor.equalsIgnoreCase(t.getRoute()))
                .filter(Train::isDelayed)
                .count();
        return delayedCount >= thresholdDelayedTrains;
    }
}
