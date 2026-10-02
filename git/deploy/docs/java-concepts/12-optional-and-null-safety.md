# 12 — Optional & Defensive Null Safety

## Overview
`java.util.Optional<T>` explicitly represents the presence or absence of a value, preventing unexpected `NullPointerException` errors.

## Application in RailFlow
1. **Repository Lookups**:
   ```java
   public Optional<Platform> findById(String id) {
       return Optional.ofNullable(storage.get(id));
   }
   ```
2. **Strategy Optimal Allocation**:
   ```java
   public Optional<Platform> selectOptimalPlatform(Train train, List<Platform> platforms) {
       return platforms.stream()
               .filter(p -> p.getOccupancyRate() < 0.75)
               .min(Comparator.comparingDouble(Platform::getOccupancyRate));
   }
   ```
3. **Graceful Functional Unwrapping**:
   ```java
   Platform targetPlatform = platformService.getPlatformById(id)
           .orElseThrow(() -> new PlatformNotFoundException("Platform not found: " + id));
   ```

## Rules Followed
- Never use `null` as a return value for search/lookup operations.
- Avoid wrapping Collections in Optional (return empty list `Collections.emptyList()` instead).
