# 04 — Java Memory Model & Immutability

## Overview
Understanding Java's heap and stack memory allocation, reference transparency, and immutability guarantees thread safety across background simulation threads and HTTP request threads.

## Implementation Details
1. **Value Objects & Immutability**:
   - `CrowdSnapshot`: Immutable snapshot of platform crowd at an instant in time (`final` fields, no setters).
   - `RailwayRoute`: Immutable graph edge representation.
   - `RailwayRecord`: Immutable parsed CSV statistics row.
2. **Defensive Copies**:
   - `PlatformRegistry.getAll()` returns `new ArrayList<>(storage.values())` and `Collections.unmodifiableList(...)` to prevent external modification of internal state.
3. **Volatile & Thread Visibility**:
   - Volatile flags and atomic primitives (`AtomicInteger`, `AtomicLong`) ensure memory visibility across multi-core CPU caches without expensive explicit lock overhead.

## Benefits
- Eliminates side-effects and race conditions when multiple REST queries read platform records concurrently while `ScheduledExecutorService` updates footfall counters.
