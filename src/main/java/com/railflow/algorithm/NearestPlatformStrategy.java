package com.railflow.algorithm;

import com.railflow.model.Platform;
import com.railflow.model.Train;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Strategy preferring adjacent platforms to minimize passenger foot-traffic traversal distance.
 */
@Component("nearestPlatformStrategy")
public class NearestPlatformStrategy implements PlatformOptimizationStrategy {

    @Override
    public Optional<Platform> selectOptimalPlatform(Train train, List<Platform> candidatePlatforms) {
        if (candidatePlatforms == null || candidatePlatforms.isEmpty()) {
            return Optional.empty();
        }

        // Filter free platforms with occupancy < 75%
        return candidatePlatforms.stream()
                .filter(p -> p.getCurrentTrainId() == null && p.getOccupancyRate() < 0.75)
                .findFirst();
    }

    @Override
    public String getStrategyName() {
        return "Nearest-Adjacent-Platform";
    }
}
