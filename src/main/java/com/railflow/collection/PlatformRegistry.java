package com.railflow.collection;

import com.railflow.enums.PlatformStatus;
import com.railflow.model.Platform;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.stream.Collectors;

/**
 * Dedicated registry for Platform entities with domain-specific collection queries.
 */
@Component
public class PlatformRegistry extends DataRegistry<String, Platform> {

    /**
     * Uses PriorityQueue to retrieve platforms ordered by highest occupancy.
     * Demonstrates Heap DSA structure for dynamic prioritization.
     */
    public List<Platform> getPlatformsRankedByCrowd() {
        PriorityQueue<Platform> maxHeap = new PriorityQueue<>(
                (p1, p2) -> Double.compare(p2.getOccupancyRate(), p1.getOccupancyRate())
        );
        maxHeap.addAll(storage.values());

        List<Platform> sortedList = new java.util.ArrayList<>();
        while (!maxHeap.isEmpty()) {
            sortedList.add(maxHeap.poll());
        }
        return sortedList;
    }

    public List<Platform> findCriticalPlatforms() {
        return filter(Platform::isCritical);
    }

    public List<Platform> findUnderutilizedPlatforms() {
        return filter(Platform::isUnderutilized);
    }

    public List<Platform> findByStatus(PlatformStatus status) {
        return filter(p -> p.getStatus() == status);
    }
}
