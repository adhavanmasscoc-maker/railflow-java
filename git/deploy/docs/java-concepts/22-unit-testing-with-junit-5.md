# 22 — Unit Testing with JUnit 5 & AssertJ

## Overview
Automated regression tests validate algorithmic correctness, exception boundaries, data parsing integrity, and concurrency guarantees.

## Test Categories in RailFlow
1. **DSA & Algorithm Tests**:
   - `TrainSearchTest`: Validates binary search on sorted train arrays and edge cases (empty list, element not found).
   - `PlatformRankingTest`: Validates that `PriorityQueue` returns platforms in strict descending occupancy order.
2. **Strategy & Optimization Tests**:
   - `PlatformOptimizationStrategyTest`: Asserts that `LeastCrowdedStrategy` and `CapacityBasedStrategy` pick valid non-critical platforms.
3. **Data Pipeline Tests**:
   - `CsvParserTest`: Asserts handling of quoted strings with embedded commas and escaped double quotes.
   - `RailwayDataValidatorTest`: Validates null handling and invalid format detection.
4. **Domain Exception Tests**:
   - Asserts `InvalidCrowdCountException` on negative values.

## Code Example
```java
@Test
void testBinarySearchFound() {
    List<Train> trains = createSortedTrains();
    Optional<Train> found = TrainSearch.binarySearchByNumber(trains, "12301");
    assertTrue(found.isPresent());
    assertEquals("Rajdhani Express", found.get().getName());
}
```
