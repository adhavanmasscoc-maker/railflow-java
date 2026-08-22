# 01 — Java Basics & Primitive Types in RailFlow

## Overview
Core Java syntax, primitive data types, reference types, operators, and control structures form the execution foundation of the RailFlow simulation engine.

## Java Concepts Used
1. **Primitive Data Types**:
   - `int`: Platform capacity, crowd counts, train halt minutes, stop sequences.
   - `double`: Platform occupancy rates (0.0 to 1.0), latitude/longitude coordinates, speed km/h.
   - `boolean`: Gate open/closed status, active alert flags, validation flags.
   - `long`: Millisecond timestamps and record sequence counters via `AtomicLong`.
2. **Control Flow**:
   - Switch expressions and enhanced `switch` with pattern matching for `AlertSeverity` and `TrainStatus`.
   - `do-while` loops in `RailFlowConsole.java` for continuous menu interaction.
   - `if-else` guard clauses enforcing safety thresholds in `CrowdAnalyzer`.

## Code Example
```java
// Calculating platform crowd occupancy percentage safely
public int getOccupancyPercentage() {
    if (capacity <= 0) return 0;
    return (int) Math.round(((double) currentCrowd / capacity) * 100.0);
}
```

## Time & Space Complexity
- Arithmetic operations and boolean evaluations: **$O(1)$ Time**, **$O(1)$ Space**.
- Primitive variable allocation: Stack-allocated for local method scopes.
