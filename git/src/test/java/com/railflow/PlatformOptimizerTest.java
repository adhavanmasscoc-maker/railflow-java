package com.railflow;

import com.railflow.algorithm.LeastCrowdedStrategy;
import com.railflow.algorithm.PlatformOptimizer;
import com.railflow.collection.PlatformRegistry;
import com.railflow.enums.GateStatus;
import com.railflow.model.OpenGateRecommendation;
import com.railflow.model.Platform;
import com.railflow.model.PlatformRecommendation;
import com.railflow.model.RedistributeCrowdRecommendation;
import com.railflow.repository.InMemoryPlatformRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Platform Optimizer Algorithmic Rule Tests")
class PlatformOptimizerTest {

    private PlatformRegistry registry;
    private InMemoryPlatformRepository repository;
    private PlatformOptimizer optimizer;

    @BeforeEach
    void setUp() {
        registry = new PlatformRegistry();
        repository = new InMemoryPlatformRepository(registry);
        registry.clear(); // clear seed data for isolated test

        optimizer = new PlatformOptimizer(repository, new LeastCrowdedStrategy());
    }

    @Test
    @DisplayName("Should generate crowd redistribution and gate opening recommendations when platform is overcrowded")
    void testOvercrowdedPlatformRecommendations() {
        // Platform 1: Overloaded (90% occupancy)
        Platform p1 = new Platform("P1", "Platform 1", "STN", "Central", 500, "EXPRESS");
        p1.updateCrowd(450); // 90%
        // Close 2 gates on P1 to trigger gate expansion rule
        p1.getGates().get(2).setStatus(GateStatus.CLOSED);
        p1.getGates().get(3).setStatus(GateStatus.CLOSED);
        repository.save(p1);

        // Platform 2: Underutilized (20% occupancy)
        Platform p2 = new Platform("P2", "Platform 2", "STN", "Central", 500, "EXPRESS");
        p2.updateCrowd(100); // 20%
        repository.save(p2);

        List<PlatformRecommendation> recs = optimizer.generateRecommendations();
        assertFalse(recs.isEmpty(), "Should produce optimization recommendations");

        // Verify redistribution recommendation
        boolean hasRedistribute = recs.stream().anyMatch(r -> r instanceof RedistributeCrowdRecommendation);
        assertTrue(hasRedistribute, "Should generate a RedistributeCrowdRecommendation");

        // Verify open gate recommendation
        boolean hasOpenGate = recs.stream().anyMatch(r -> r instanceof OpenGateRecommendation);
        assertTrue(hasOpenGate, "Should generate an OpenGateRecommendation");
    }

    @Test
    @DisplayName("Should execute recommendation apply() polymorphism accurately")
    void testApplyPolymorphism() {
        Platform p1 = new Platform("P1", "Platform 1", "STN", "Central", 500, "EXPRESS");
        p1.updateCrowd(450);
        repository.save(p1);

        RedistributeCrowdRecommendation rec = new RedistributeCrowdRecommendation(
                "REC-001", "P1", "Platform 1", "P2", "Platform 2",
                100, "Issue", "Action", "Impact", 90
        );

        assertFalse(rec.isApplied());
        boolean success = rec.apply(p1);

        assertTrue(success);
        assertTrue(rec.isApplied());
        assertEquals(350, p1.getCurrentCrowd()); // 450 - 100
    }
}
