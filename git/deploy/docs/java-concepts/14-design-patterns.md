# 14 — Design Patterns in RailFlow

## Patterns Implemented in RailFlow

### 1. Strategy Pattern
- **Interface**: [`PlatformOptimizationStrategy`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/algorithm/PlatformOptimizationStrategy.java)
- **Implementations**:
  - `LeastCrowdedStrategy` (Selects platform with minimum occupancy)
  - `CapacityBasedStrategy` (Matches passenger load to available headroom)
  - `NearestPlatformStrategy` (Selects adjacent available platform)
- **Benefit**: Pluggable optimization algorithms interchangeable at runtime.

### 2. Repository Pattern
- **Interfaces**: `PlatformRepository`, `TrainRepository`, `AlertRepository`
- **Implementation**: `InMemoryPlatformRepository`, etc.
- **Benefit**: Completely decouples business services from storage mechanisms.

### 3. Data Transfer Object (DTO) Pattern
- **Classes**: `PlatformResponse`, `TrainResponse`, `AlertResponse`, `DashboardStatsResponse`
- **Benefit**: Prevents domain entity leakage to presentation/REST layers and allows clean serialization.

### 4. Template Method / Polymorphism Pattern
- **Classes**: `PlatformRecommendation` with abstract `apply(Platform target)` method overridden by subclasses.
- **Benefit**: Calling code executes `rec.apply(platform)` uniformly.
