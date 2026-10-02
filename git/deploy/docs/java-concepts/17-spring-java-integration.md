# 17 — Spring Boot & Core Java Integration

## Architecture Principle
> **Java is the Core of RailFlow. Spring Boot is solely the delivery and communication layer.**

```text
              FRONTEND (SPA) / CLI
                       ↓
         REST CONTROLLER / CONSOLE UI
                       ↓
                   DTO LAYER
                       ↓
                 SERVICE LAYER
                       ↓
           JAVA DOMAIN & ALGORITHMS
                       ↓
            COLLECTIONS & REPOSITORIES
                       ↓
               FILE I/O & DATASETS
```

## Independence Demonstration
[`RailFlowConsole.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/cli/RailFlowConsole.java) instantiates pure Java objects using standard `new` constructors without starting Spring Boot, executing the identical domain algorithms, sorting, and recommendation logic as the REST controllers.
