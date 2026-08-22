# 02 — Object-Oriented Programming (OOP) in RailFlow

## Concept Overview
Object-Oriented Programming principles—**Encapsulation**, **Inheritance**, **Polymorphism**, and **Abstraction**—structure all railway physical and logical entities.

## Where it is used in RailFlow
1. **Encapsulation**: Domain models have private state with defensive mutations (`Platform`, `Train`, `Gate`, `Station`).
2. **Inheritance & Polymorphism**: Recommendation hierarchy (`PlatformRecommendation` abstract base class extended by `OpenGateRecommendation`, `RedistributeCrowdRecommendation`, `CloseGateRecommendation`, `ChangePlatformRecommendation`).
3. **Abstraction**: Strategy interfaces (`PlatformOptimizationStrategy`, `CrowdAnalyzer`) decoupling behavior from implementation.

## Relevant Java Classes
- [`com.railflow.model.PlatformRecommendation`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/model/PlatformRecommendation.java)
- [`com.railflow.model.RedistributeCrowdRecommendation`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/model/RedistributeCrowdRecommendation.java)
- [`com.railflow.model.OpenGateRecommendation`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/model/OpenGateRecommendation.java)

## Code Example
```java
public abstract class PlatformRecommendation implements Comparable<PlatformRecommendation> {
    // Abstract execution method implemented polymorphically
    public abstract boolean apply(Platform targetPlatform);
}

public class RedistributeCrowdRecommendation extends PlatformRecommendation {
    @Override
    public boolean apply(Platform targetPlatform) {
        if (targetPlatform == null) return false;
        targetPlatform.adjustCrowd(-crowdToTransfer);
        this.applied = true;
        return true;
    }
}
```

## Why it was chosen
Polymorphism allows new types of station mitigation actions to be introduced without modifying calling services.

## Alternative Approach
Procedural `if-else` / `switch` statements checking string recommendation types, which violates Open/Closed Principle.
