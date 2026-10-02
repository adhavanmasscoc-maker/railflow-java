# 15 — SOLID Principles in RailFlow

| Principle | Meaning | How RailFlow Applies It |
| :--- | :--- | :--- |
| **S** — Single Responsibility | Each class has exactly one job | `PlatformOptimizer` solely handles heuristics; `ThreadPoolManager` manages threads; `CsvReader` handles CSV I/O; `PlatformController` only maps HTTP routes. |
| **O** — Open / Closed | Open for extension, closed for modification | Adding a new platform selection strategy only requires implementing `PlatformOptimizationStrategy` without altering `PlatformOptimizer`. |
| **L** — Liskov Substitution | Subclasses must be substitutable for base types | Any subclass of `PlatformRecommendation` (`OpenGateRecommendation`, `RedistributeCrowdRecommendation`) can be stored in `List<PlatformRecommendation>` and executed safely. |
| **I** — Interface Segregation | Focused, cohesive interfaces | `PlatformRepository`, `TrainRepository`, and `CrowdAnalyzer` have targeted, minimal method contracts. |
| **D** — Dependency Inversion | Depend on abstractions, not concrete classes | Services depend on `PlatformRepository` and `PlatformOptimizationStrategy` interfaces, injected via Spring IoC or pure Java constructors in CLI. |
