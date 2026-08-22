package com.railflow.algorithm;

import com.railflow.model.Platform;
import com.railflow.model.Train;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * Strategy selecting the platform with the absolute lowest occupancy percentage.
 */
@Component("leastCrowdedStrategy")
public class LeastCrowdedStrategy implements PlatformOptimizationStrategy {

    @Override
    public Optional<Platform> selectOptimalPlatform(Train train, List<Platform> candidatePlatforms) {
        if (candidatePlatforms == null || candidatePlatforms.isEmpty()) {
            return Optional.empty();
        }

        return candidatePlatforms.stream()
                .filter(p -> p.getCurrentTrainId() == null) // Must not have an active train
                .min(Comparator.comparingDouble(Platform::getOccupancyRate));
    }

    @Override
    public String getStrategyName() {
        return "Least-Crowded-First";
    }
}
