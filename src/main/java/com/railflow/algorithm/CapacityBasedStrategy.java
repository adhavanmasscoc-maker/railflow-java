package com.railflow.algorithm;

import com.railflow.model.Platform;
import com.railflow.model.Train;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * Strategy selecting a platform whose available headroom can accommodate expected train passenger disembarkation.
 */
@Component("capacityBasedStrategy")
public class CapacityBasedStrategy implements PlatformOptimizationStrategy {

    @Override
    public Optional<Platform> selectOptimalPlatform(Train train, List<Platform> candidatePlatforms) {
        if (candidatePlatforms == null || candidatePlatforms.isEmpty()) {
            return Optional.empty();
        }

        int expectedPassengers = train != null ? Math.max(100, (int) (train.getCurrentPassengers() * 0.6)) : 200;

        return candidatePlatforms.stream()
                .filter(p -> p.getCurrentTrainId() == null)
                .filter(p -> p.getAvailableCapacity() >= expectedPassengers)
                .min(Comparator.comparingDouble(Platform::getOccupancyRate));
    }

    @Override
    public String getStrategyName() {
        return "Capacity-Headroom-Matching";
    }
}
