# 02 — OOP: Encapsulation, Inheritance & Polymorphism

## Overview
RailFlow leverages core Object-Oriented Programming (OOP) principles to construct resilient domain models (`Train`, `Station`, `Platform`, `Gate`, `Alert`) and an extensible recommendation hierarchy.

## Key Principles in Action

### 1. Encapsulation
State mutation is strictly regulated via defensive setters and domain invariants:
```java
public void updateCrowd(int newCrowd) {
    if (newCrowd < 0) {
        throw new InvalidCrowdCountException("Crowd count cannot be negative: " + newCrowd);
    }
    this.currentCrowd = newCrowd;
    this.occupancyRate = (double) newCrowd / this.capacity;
    this.status = calculateStatus();
}
```

### 2. Inheritance & Polymorphism
The recommendation engine uses an abstract base class `PlatformRecommendation` with specialized subclasses:
- `OpenGateRecommendation`: Triggers turnstile gate expansion.
- `RedistributeCrowdRecommendation`: Suggests passenger concourse diversion.
- `ChangePlatformRecommendation`: Reassigns scheduled trains to less crowded platforms.
- `CloseGateRecommendation`: Regulates runaway platform entry.

```java
public abstract class PlatformRecommendation {
    private final String id;
    private final RecommendationType type;
    private final int priority;

    public abstract String getActionDescription();
    public abstract String getExpectedImpact();
}
```

## Benefits
- Polymorphic dispatch allows `RecommendationService` to process diverse optimization actions uniformly via `List<PlatformRecommendation>`.
- Open for extension: new optimization actions can be introduced without modifying existing controller logic.
