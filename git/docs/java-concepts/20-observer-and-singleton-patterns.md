# 20 — Observer & Singleton Design Patterns

## Overview
State change propagation and centralized resource coordination utilize the Observer and Singleton design patterns.

## Patterns in RailFlow

### 1. Observer Pattern (Alert Triggering)
When platform crowd exceeds critical thresholds ($\ge 90\%$), observer callbacks notify `AlertService` to generate real-time alerts and publish events.

### 2. Singleton Pattern
- In Spring Boot context: Services and repositories are registered as singletons by default (`@Service`, `@Repository`, `@Component`).
- In Pure Core Java CLI: Centralized thread pools and registry singletons are instantiated once during `DataBootstrap` / `RailFlowConsole.init()` and shared across handlers.

## Benefits
- Prevents redundant in-memory dataset cloning (saving RAM on the 22.1 MB CSV data).
- Guarantees a single synchronized source of truth for platform and train states.
