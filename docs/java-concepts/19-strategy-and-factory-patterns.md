# 19 — Strategy & Factory Design Patterns

## Overview
Design patterns promote modularity, testability, and adherence to the Open/Closed Principle.

## Strategy Pattern (`com.railflow.strategy` & `com.railflow.algorithm`)
Pluggable platform allocation algorithms share a common interface `PlatformOptimizationStrategy`:
1. `LeastCrowdedStrategy`: Selects platform with minimum absolute passenger crowd.
2. `CapacityBasedStrategy`: Selects platform with lowest occupancy percentage ($\le 70\%$).
3. `NearestPlatformStrategy`: Selects platform closest to station main concourse entry.
4. `PriorityBasedStrategy`: Matches premium superfast trains (Rajdhani/Shatabdi) to high-capacity platforms ($550+$ passengers).

```java
public class PlatformOptimizer {
    private PlatformOptimizationStrategy currentStrategy;

    public void setStrategy(PlatformOptimizationStrategy strategy) {
        this.currentStrategy = strategy;
    }

    public Optional<Platform> optimize(Train train, List<Platform> platforms) {
        return currentStrategy.selectOptimalPlatform(train, platforms);
    }
}
```

## Factory Pattern
`RecommendationFactory` constructs concrete polymorphic recommendation instances (`OpenGateRecommendation`, `ChangePlatformRecommendation`) based on analyzed platform bottlenecks.
