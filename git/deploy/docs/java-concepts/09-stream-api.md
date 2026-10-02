# 09 — Java Stream API & Lambdas in RailFlow

## Concept Overview
The Stream API allows declarative, functional-style data pipeline processing across railway collections using operations like `filter()`, `map()`, `sorted()`, `collect()`, `groupingBy()`, and `mapToInt().sum()`.

## Where it is used in RailFlow
- Aggregating station-wide capacity and crowd: `platforms.stream().mapToInt(Platform::getCapacity).sum()`.
- Finding critical overcrowded platforms: `platforms.stream().filter(Platform::isCritical).collect(Collectors.toList())`.
- Grouping trains by corridor: `trains.stream().collect(Collectors.groupingBy(Train::getRoute))`.
- Custom multi-attribute sorting: `Comparator.comparingDouble(Platform::getOccupancyRate).reversed()`.

## Code Example
```java
public List<Platform> getOverloadedPlatforms(List<Platform> platforms) {
    return platforms.stream()
            .filter(Platform::isOvercrowded)
            .sorted((a, b) -> Double.compare(b.getOccupancyRate(), a.getOccupancyRate()))
            .collect(Collectors.toList());
}
```

## Why it was chosen
Provides concise, expressive, and bug-free collection transformation while keeping intent crystal clear.
