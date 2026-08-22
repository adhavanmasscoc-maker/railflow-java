# 16 — Atomic Primitives & Thread-Safe Collections

## Overview
RailFlow eliminates race conditions through the deliberate use of `java.util.concurrent.atomic` primitives and synchronized collection wrappers.

## Implementations in RailFlow
1. **`AtomicInteger` & `AtomicLong`**:
   - `alertCounter`: Thread-safe sequential ID generation (`ALT-0001`, `ALT-0002`).
   - `totalRecords`, `validRecords`, `invalidRecords` in `RailwayDataValidator`.
2. **`ConcurrentHashMap`**:
   - Backing storage for all in-memory entity registries (`PlatformRegistry`, `TrainRegistry`, `StationRegistry`).
   - Supports atomic `computeIfAbsent`, `putIfAbsent`, and `removeIf`.
3. **`Collections.synchronizedList`**:
   - Thread-safe wrapper around `ArrayList` for storing chronological crowd trends.

## Benefits
- High concurrency under heavy concurrent REST query loads.
- Zero deadlock risk by eliminating nested synchronized lock chains.
