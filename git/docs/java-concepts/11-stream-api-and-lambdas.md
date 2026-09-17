# 11 — Java Stream API & Functional Pipelines

## Overview
Java Streams enable declarative, fluent, and functional processing of collections without manual iteration state management.

## Key Stream Operations in RailFlow
1. **Filtering & Aggregations**:
   ```java
   public List<Platform> getCriticalPlatforms() {
       return platformRepository.findAll().stream()
               .filter(p -> p.getStatus() == PlatformStatus.CRITICAL || p.getOccupancyRate() >= 0.90)
               .sorted(Comparator.comparingDouble(Platform::getOccupancyRate).reversed())
               .collect(Collectors.toList());
   }
   ```
2. **Average Occupancy Reduction**:
   ```java
   double avgOcc = platforms.stream()
           .mapToDouble(Platform::getOccupancyRate)
           .average()
           .orElse(0.0);
   ```
3. **Grouping by Category**:
   ```java
   Map<String, List<RailwayRecord>> recordsByCategory = rawRecords.stream()
           .collect(Collectors.groupingBy(RailwayRecord::getCategory));
   ```

## Performance Note
- Streams are evaluated lazily. Intermediate operations (`filter`, `map`, `sorted`) are only computed upon reaching a terminal operation (`collect`, `count`, `forEach`, `findFirst`).
