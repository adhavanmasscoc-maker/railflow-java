package com.railflow;

import com.railflow.algorithm.PlatformRanking;
import com.railflow.model.Platform;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Platform Ranking PriorityQueue Heap DSA Tests")
class PlatformRankingTest {

    @Test
    @DisplayName("Should extract Top-K most congested platforms accurately using Max-Heap")
    void testTopKMostCongestedMaxHeap() {
        Platform p1 = new Platform("P1", "Platform 1", "STN", "Central", 500, "EXPRESS");
        p1.updateCrowd(100); // 20%

        Platform p2 = new Platform("P2", "Platform 2", "STN", "Central", 500, "EXPRESS");
        p2.updateCrowd(480); // 96%

        Platform p3 = new Platform("P3", "Platform 3", "STN", "Central", 500, "EXPRESS");
        p3.updateCrowd(350); // 70%

        Platform p4 = new Platform("P4", "Platform 4", "STN", "Central", 500, "EXPRESS");
        p4.updateCrowd(450); // 90%

        List<Platform> top2 = PlatformRanking.getTopKMostCongested(List.of(p1, p2, p3, p4), 2);

        assertEquals(2, top2.size());
        assertEquals("P2", top2.get(0).getId()); // 96%
        assertEquals("P4", top2.get(1).getId()); // 90%
    }

    @Test
    @DisplayName("Should extract Top-K least congested platforms using Min-Heap")
    void testTopKLeastCongestedMinHeap() {
        Platform p1 = new Platform("P1", "Platform 1", "STN", "Central", 500, "EXPRESS");
        p1.updateCrowd(100); // 20%

        Platform p2 = new Platform("P2", "Platform 2", "STN", "Central", 500, "EXPRESS");
        p2.updateCrowd(480); // 96%

        Platform p3 = new Platform("P3", "Platform 3", "STN", "Central", 500, "EXPRESS");
        p3.updateCrowd(50); // 10%

        List<Platform> least2 = PlatformRanking.getTopKLeastCongested(List.of(p1, p2, p3), 2);

        assertEquals(2, least2.size());
        assertEquals("P3", least2.get(0).getId()); // 10%
        assertEquals("P1", least2.get(1).getId()); // 20%
    }
}
