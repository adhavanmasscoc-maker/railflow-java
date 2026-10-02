# 03 — Abstract Classes & Interfaces in RailFlow

## Overview
Interfaces define contracts for decoupled architectural layers, while abstract classes provide shared template state and logic.

## Key Interfaces in RailFlow
1. `PlatformRepository`, `TrainRepository`, `StationRepository`, `AlertRepository`:
   - Data access abstraction allowing in-memory and database implementations interchangeably.
2. `PlatformOptimizationStrategy`:
   - Algorithm strategy interface with methods `selectOptimalPlatform(Train, List<Platform>)` and `getStrategyName()`.
3. `CrowdAnalyzer`:
   - Analytical interface evaluating platform crowd density snapshots.

## Key Abstract Classes
- `PlatformRecommendation`:
  - Enforces common properties (`id`, `targetPlatformId`, `priority`, `createdAt`) while leaving `getActionDescription()` and `getExpectedImpact()` abstract for concrete subclasses.

## Design Advantages
- Loose coupling between service layers and concrete repository or strategy classes.
- Enables dependency injection and mockability during unit testing.
