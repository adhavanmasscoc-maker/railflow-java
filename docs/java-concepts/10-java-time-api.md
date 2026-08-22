# 10 — Java Time API (`java.time`)

## Overview
RailFlow replaces legacy mutable date classes (`java.util.Date`, `Calendar`) with modern, thread-safe, immutable date and time constructs introduced in Java 8.

## Usage in RailFlow
- `LocalDateTime`: Tracking exact alert creation timestamps, recommendation generation moments, and hourly simulation log history.
- `LocalTime`: Managing scheduled train arrivals, departures, and halt schedules.
- `Duration` & `ChronoUnit`: Calculating delay minutes, ETA countdowns, and platform dwell intervals.

## Code Example
```java
// Calculating minutes until train arrival
public long calculateMinutesToArrival(LocalTime scheduledArrival) {
    LocalTime now = LocalTime.now();
    if (scheduledArrival.isBefore(now)) {
        return 0;
    }
    return ChronoUnit.MINUTES.between(now, scheduledArrival);
}
```

## Benefits
- Thread-safe by design: All `java.time` objects are immutable.
- Clear ISO-8601 string formatting for seamless JSON serialization in REST APIs.
