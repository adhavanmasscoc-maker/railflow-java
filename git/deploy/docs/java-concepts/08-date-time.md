# 08 — Java Date & Time API in RailFlow

## Concept Overview
The modern `java.time` package (`LocalDateTime`, `Instant`, `Duration`, `DateTimeFormatter`) provides immutable, thread-safe temporal operations, replacing deprecated `java.util.Date` and `Calendar`.

## Where it is used in RailFlow
- Timestamping crowd updates (`Platform.lastUpdated`).
- Tracking alert creation and resolution times (`Alert.createdAt`, `Alert.resolvedAt`).
- Time-series snapshot aggregation in [`CrowdSnapshot.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/model/CrowdSnapshot.java).
- Automatic purge threshold checks: `LocalDateTime.now().minusHours(2)`.

## Code Example
```java
public void removeResolvedOlderThan(int hours) {
    LocalDateTime threshold = LocalDateTime.now().minusHours(hours);
    storage.entrySet().removeIf(e ->
            !e.getValue().isActive() && e.getValue().getCreatedAt().isBefore(threshold));
}
```

## Why it was chosen
Immutability and thread-safety ensure that concurrent worker threads reading and modifying timestamps do not suffer from race conditions or formatting mutation bugs.
