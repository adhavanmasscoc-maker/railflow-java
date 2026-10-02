# 23 — Spring Boot & Core Java Integration

## Overview
RailFlow treats Spring Boot purely as a web delivery and dependency injection framework, while all business logic, algorithms, concurrency, and data models remain 100% pure Core Java.

## Integration Architecture
```text
┌────────────────────────────────────────────────────────┐
│                   SPRING BOOT LAYER                    │
│   • @RestController (DTOs, HTTP Response Mappings)    │
│   • @Autowired & Dependency Injection Container        │
│   • Static Resource Handler (SPA Web Delivery)        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    CORE JAVA LAYER                     │
│   • Pure Java Models (Train, Station, Platform)        │
│   • Generic ConcurrentHashMap Registries               │
│   • DSA (Binary Search, PriorityQueue Heaps)           │
│   • Concurrency (ScheduledExecutorService)             │
│   • Stream & Functional Pipelines                      │
│   • RFC 4180 CsvParser & File I/O Streams              │
└────────────────────────────────────────────────────────┘
```

## Dual Interface Support
- **Spring Boot Web Application**: Runs `@SpringBootApplication` listening on port 8080.
- **Standalone Core Java Console**: Runs `RailFlowConsole.java` with zero Spring runtime dependencies using pure `javac`.
- **Shared Core Services**: Both interfaces invoke the exact same Java services (`PlatformService`, `TrainService`, `AlertService`, `RecommendationService`).
