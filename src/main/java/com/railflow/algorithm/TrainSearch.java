package com.railflow.algorithm;

import com.railflow.model.Train;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * Demonstrates DSA Searching Algorithms on railway train datasets.
 */
public class TrainSearch {

    /**
     * Linear Search: O(N) time complexity.
     * Iterates sequentially through list to find train matching train number.
     */
    public static Optional<Train> linearSearchByNumber(List<Train> trains, String trainNumber) {
        if (trains == null || trainNumber == null) return Optional.empty();
        for (Train train : trains) {
            if (train != null && trainNumber.equalsIgnoreCase(train.getTrainNumber())) {
                return Optional.of(train);
            }
        }
        return Optional.empty();
    }

    /**
     * Binary Search: O(log N) time complexity.
     * Pre-requisite: The train list must be sorted by trainNumber in ascending natural order.
     */
    public static Optional<Train> binarySearchByNumber(List<Train> sortedTrains, String targetTrainNumber) {
        if (sortedTrains == null || targetTrainNumber == null || sortedTrains.isEmpty()) {
            return Optional.empty();
        }

        int low = 0;
        int high = sortedTrains.size() - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            Train midTrain = sortedTrains.get(mid);
            int cmp = midTrain.getTrainNumber().compareToIgnoreCase(targetTrainNumber);

            if (cmp == 0) {
                return Optional.of(midTrain);
            } else if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return Optional.empty();
    }

    /**
     * Partial Keyword Search using Linear scan and substring match.
     */
    public static List<Train> searchByNameOrRoute(List<Train> trains, String keyword) {
        if (trains == null || keyword == null || keyword.isBlank()) return List.of();
        String lower = keyword.toLowerCase().trim();
        return trains.stream()
                .filter(t -> t.getName().toLowerCase().contains(lower) ||
                             t.getRoute().toLowerCase().contains(lower) ||
                             t.getSourceStation().toLowerCase().contains(lower) ||
                             t.getDestinationStation().toLowerCase().contains(lower))
                .sorted(Comparator.comparing(Train::getName))
                .toList();
    }
}
