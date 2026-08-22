package com.railflow.algorithm;

import com.railflow.model.Platform;

import java.util.*;

/**
 * Demonstrates Heap (PriorityQueue) and Comparator Sorting DSA techniques for platform prioritization.
 */
public class PlatformRanking {

    /**
     * Max-Heap based Top-K Overcrowded Platforms.
     * Time Complexity: O(N log K) using min-heap of size K or O(N log N) using max-heap.
     */
    public static List<Platform> getTopKMostCongested(List<Platform> platforms, int k) {
        if (platforms == null || platforms.isEmpty() || k <= 0) return Collections.emptyList();

        PriorityQueue<Platform> maxHeap = new PriorityQueue<>(
                (p1, p2) -> Double.compare(p2.getOccupancyRate(), p1.getOccupancyRate())
        );
        maxHeap.addAll(platforms);

        List<Platform> result = new ArrayList<>();
        int count = Math.min(k, maxHeap.size());
        for (int i = 0; i < count; i++) {
            result.add(maxHeap.poll());
        }
        return result;
    }

    /**
     * Min-Heap based Top-K Most Available (Least Congested) Platforms.
     */
    public static List<Platform> getTopKLeastCongested(List<Platform> platforms, int k) {
        if (platforms == null || platforms.isEmpty() || k <= 0) return Collections.emptyList();

        PriorityQueue<Platform> minHeap = new PriorityQueue<>(
                Comparator.comparingDouble(Platform::getOccupancyRate)
        );
        minHeap.addAll(platforms);

        List<Platform> result = new ArrayList<>();
        int count = Math.min(k, minHeap.size());
        for (int i = 0; i < count; i++) {
            result.add(minHeap.poll());
        }
        return result;
    }

    /**
     * Multi-level sorting: Primary: Occupancy (Descending), Secondary: Gate count (Ascending).
     */
    public static List<Platform> multiLevelSort(List<Platform> platforms) {
        if (platforms == null) return Collections.emptyList();
        List<Platform> copy = new ArrayList<>(platforms);
        copy.sort(
                Comparator.comparingDouble(Platform::getOccupancyRate).reversed()
                        .thenComparingInt(Platform::getActiveGateCount)
        );
        return copy;
    }
}
