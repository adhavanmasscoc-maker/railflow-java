package com.railflow.algorithm;

import com.railflow.model.Platform;
import com.railflow.model.Train;

import java.util.List;
import java.util.Optional;

/**
 * Strategy pattern interface for selecting optimal railway platforms for incoming trains.
 */
public interface PlatformOptimizationStrategy {

    /**
     * Identifies the best platform for a train given available platform options.
     *
     * @param train The incoming train requesting a platform assignment
     * @param candidatePlatforms The list of candidate platforms
     * @return Optional containing the best platform match, or empty if none suitable
     */
    Optional<Platform> selectOptimalPlatform(Train train, List<Platform> candidatePlatforms);

    String getStrategyName();
}
