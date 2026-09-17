package com.railflow.algorithm;

import com.railflow.model.*;
import com.railflow.repository.PlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Deterministic Heuristic & Rule-Based Platform Optimization Engine.
 * Analyzes real-time platform overcrowding, gate states, and suggests actionable mitigation recommendations.
 */
@Component
public class PlatformOptimizer {

    private final PlatformRepository platformRepository;
    private final PlatformOptimizationStrategy optimizationStrategy;
    private final AtomicInteger recommendationSeq = new AtomicInteger(100);

    @Autowired
    public PlatformOptimizer(PlatformRepository platformRepository,
                             @Qualifier("leastCrowdedStrategy") PlatformOptimizationStrategy optimizationStrategy) {
        this.platformRepository = platformRepository;
        this.optimizationStrategy = optimizationStrategy;
    }

    /**
     * Generates a priority-ranked list of optimization recommendations based on defined heuristics.
     */
    public List<PlatformRecommendation> generateRecommendations() {
        List<Platform> allPlatforms = platformRepository.findAll();
        List<PlatformRecommendation> recommendations = new ArrayList<>();

        List<Platform> overloaded = allPlatforms.stream()
                .filter(Platform::isOvercrowded)
                .sorted((a, b) -> Double.compare(b.getOccupancyRate(), a.getOccupancyRate()))
                .collect(Collectors.toList());

        List<Platform> underutilized = allPlatforms.stream()
                .filter(Platform::isUnderutilized)
                .sorted(Comparator.comparingDouble(Platform::getOccupancyRate))
                .collect(Collectors.toList());

        for (Platform over : overloaded) {
            // 1. Rule: Passenger Foot-traffic Redistribution
            if (!underutilized.isEmpty()) {
                Platform under = underutilized.get(0);
                int excessCrowd = Math.max(25, (int) (over.getCurrentCrowd() - (over.getCapacity() * 0.70)));
                int priority = Math.min(100, (int) (over.getOccupancyRate() * 100));

                RedistributeCrowdRecommendation rec = new RedistributeCrowdRecommendation(
                        nextRecId(),
                        over.getId(), over.getName(),
                        under.getId(), under.getName(),
                        excessCrowd,
                        String.format("Platform %s is at %.1f%% capacity while %s is at %.1f%%.",
                                over.getName(), over.getOccupancyRate() * 100, under.getName(), under.getOccupancyRate() * 100),
                        String.format("Divert incoming passengers towards %s via Foot Overbridge Connector.",
                                under.getName()),
                        String.format("Estimated %.0f%% reduction in %s crowding within 10 minutes.",
                                (over.getOccupancyRate() - under.getOccupancyRate()) * 25, over.getName()),
                        priority
                );
                rec.setEstimatedPassengersBenefited(excessCrowd);
                recommendations.add(rec);
            }

            // 2. Rule: Gate Expansion for High Inflow
            int activeGates = over.getActiveGateCount();
            int totalGates = over.getTotalGateCount();
            if (activeGates < totalGates) {
                int gatesToOpen = totalGates - activeGates;
                OpenGateRecommendation gateRec = new OpenGateRecommendation(
                        nextRecId(),
                        over.getId(), over.getName(),
                        gatesToOpen,
                        String.format("%s has %d of %d gates open during elevated congestion (%.1f%%).",
                                over.getName(), activeGates, totalGates, over.getOccupancyRate() * 100),
                        String.format("Open all %d remaining gates on %s immediately.", gatesToOpen, over.getName()),
                        String.format("Increases exit flow throughput by +%d%%.", gatesToOpen * 25),
                        (int) (over.getOccupancyRate() * 100) - 5
                );
                gateRec.setEstimatedPassengersBenefited(gatesToOpen * 50);
                recommendations.add(gateRec);
            }
        }

        // 3. Rule: Gate Consolidation for Underutilized Platforms
        for (Platform under : underutilized) {
            if (under.getOccupancyRate() < 0.15 && under.getActiveGateCount() > 2) {
                int gatesToClose = under.getActiveGateCount() - 2;
                CloseGateRecommendation closeRec = new CloseGateRecommendation(
                        nextRecId(),
                        under.getId(), under.getName(),
                        gatesToClose,
                        String.format("%s is at low occupancy (%.1f%%) with %d gates open.",
                                under.getName(), under.getOccupancyRate() * 100, under.getActiveGateCount()),
                        String.format("Close %d non-essential gates on %s to redeploy security staff.",
                                gatesToClose, under.getName()),
                        "Reduces power consumption and optimizes staff deployment.",
                        30
                );
                recommendations.add(closeRec);
            }
        }

        // Sort by Priority (Highest First)
        Collections.sort(recommendations);
        return recommendations;
    }

    /**
     * Recommends optimal platform for a train using the configured strategy.
     */
    public Optional<Platform> recommendPlatformForTrain(Train train) {
        return optimizationStrategy.selectOptimalPlatform(train, platformRepository.findAll());
    }

    private String nextRecId() {
        return "REC-" + recommendationSeq.getAndIncrement();
    }
}
