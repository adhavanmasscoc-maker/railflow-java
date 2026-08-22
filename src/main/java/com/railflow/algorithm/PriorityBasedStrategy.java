package com.railflow.algorithm;

import com.railflow.enums.PlatformStatus;
import com.railflow.model.Platform;
import com.railflow.model.Train;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * Strategy selecting platforms based on train priority and safety headroom.
 * Gives Superfast/Rajdhani express trains preference for higher capacity platforms.
 */
@Component("priorityBasedStrategy")
public class PriorityBasedStrategy implements PlatformOptimizationStrategy {

    @Override
    public Optional<Platform> selectOptimalPlatform(Train train, List<Platform> availablePlatforms) {
        if (availablePlatforms == null || availablePlatforms.isEmpty()) {
            return Optional.empty();
        }

        boolean isHighPriority = train != null && (
                "SUPERFAST".equalsIgnoreCase(train.getTrainType()) ||
                train.getName().toUpperCase().contains("RAJDHANI") ||
                train.getName().toUpperCase().contains("SHATABDI") ||
                train.getName().toUpperCase().contains("VANDE BHARAT")
        );

        return availablePlatforms.stream()
                .filter(p -> p.getStatus() != PlatformStatus.CRITICAL && p.getOccupancyRate() < 0.85)
                .min(Comparator.comparingDouble((Platform p) -> {
                    double score = p.getOccupancyRate();
                    if (isHighPriority && p.getCapacity() >= 550) {
                        score -= 0.15; // Prefer large platforms for premium express trains
                    }
                    return score;
                }));
    }

    @Override
    public String getStrategyName() {
        return "Priority-Based Headroom Matching";
    }

    @Override
    public String getStrategyDescription() {
        return "Allocates high-capacity platforms to premium superfast trains while maintaining safety margins below 85% occupancy.";
    }
}
