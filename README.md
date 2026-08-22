# 🚉 RailFlow — Smart Railway Crowd Monitoring & Platform Optimization System

> **RailFlow is a Java-Core Web Application where Core Java is the foundation and engineering core, the Web Application is the primary user interface, the empirical 22.1 MB Indian Railways CSV & PDF dataset is the primary data source, and the CLI is an independent secondary console interface.**

---

## 📌 Problem Statement
Modern high-density railway terminals face severe challenges with passenger surges, platform bottlenecks, train delay cascades, and uncoordinated gate throughput. These lead to dangerous overcrowding, delayed disembarkation, and safety hazards during peak hours.

## 💡 Solution
**RailFlow** provides an automated real-time station crowd monitoring and heuristic platform optimization platform. It tracks passenger density across all platforms, computes occupancy metrics, schedules automated alerts, ranks platform congestion using Heap data structures, and generates actionable crowd redistribution and gate expansion recommendations.

---

## 🏗 System Architecture

```text
                           RAILFLOW WEB APPLICATION
                                      │
                 ┌────────────────────┴────────────────────┐
                 │                                         │
          SPA WEB FRONTEND                          CLI CONSOLE
     (Dark Glassmorphism UI)                   (RailFlowConsole.java)
                 │                                         │
          REST CONTROLLERS                                 │
     (Spring Boot Web / API)                               │
                 │                                         │
                 └────────────────────┬────────────────────┘
                                      │
                                JAVA SERVICES
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
       DOMAIN MODELS             ALGORITHMS               CONCURRENCY
     (OOP, Encapsulation)     (DSA, Heap, Search)     (ScheduledExecutor)
             │                        │                        │
             └────────────────────────┼────────────────────────┘
                                      │
                          GENERIC DATA REGISTRIES
                         (ConcurrentHashMap Storage)
                                      │
                          REPOSITORIES (IN-MEMORY)
                                      │
                 ┌────────────────────┴────────────────────┐
                 │                                         │
         REAL CSV PIPELINE                           LIVE API FEED
    (CsvReader, Normalizer,                       (AsyncHttpClient &
       Validator, Indexes)                        CompletableFuture)
```

---

## 🏷️ Data Provenance & Transparency

Every metric in the RailFlow Web UI and CLI is explicitly categorized with its provenance:

| Provenance Tag | Source Description | Examples in RailFlow |
|:---|:---|:---|
| `[REAL DATA]` | Official Indian Railways Master CSV & PDF datasets | 13,849 CSV records, Train Numbers, Station Codes, Route Corridors |
| `[DERIVED]` | Deterministic algorithmic & statistical calculations | Platform Occupancy %, Delay Averages, Safety State classification |
| `[SIMULATED]` | Background concurrency simulation engine | Platform footfall ingress/egress, active turnstile gate queues |
| `[LIVE API]` | Asynchronous RapidAPI IRCTC live gateway feed | Live PNR Status, Live Running Status, Trains Between Stations |

---

## ☕ Java Core Feature Matrix (23 Concepts)

RailFlow contains exhaustive documentation and direct code implementation for all 23 Java core concepts:

| # | Java Concept | RailFlow Implementation & Key Classes | Docs Guide |
|---|:---|:---|:---|
| 01 | **Java Basics** | Primitive types, operators, enhanced control flow | [`01-java-basics.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/01-java-basics.md) |
| 02 | **OOP & Polymorphism** | Polymorphic `PlatformRecommendation` hierarchy | [`02-oop-encapsulation-inheritance-polymorphism.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/02-oop-encapsulation-inheritance-polymorphism.md) |
| 03 | **Abstract Classes & Interfaces** | `PlatformOptimizationStrategy`, `PlatformRepository` | [`03-abstract-classes-and-interfaces.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/03-abstract-classes-and-interfaces.md) |
| 04 | **Memory Model & Immutability** | `CrowdSnapshot`, `RailwayRecord`, defensive copying | [`04-java-memory-model-and-immutability.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/04-java-memory-model-and-immutability.md) |
| 05 | **Collections Framework** | `ConcurrentHashMap`, `PriorityQueue`, `ArrayList` | [`05-collections-framework-internals.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/05-collections-framework-internals.md) |
| 06 | **Generics & Type Safety** | `DataRegistry<K, V>`, bounded wildcards | [`06-generics-and-type-safety.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/06-generics-and-type-safety.md) |
| 07 | **Custom Exceptions** | `InvalidCrowdCountException`, `GlobalExceptionHandler` | [`07-custom-and-checked-exceptions.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/07-custom-and-checked-exceptions.md) |
| 08 | **File I/O & CSV Streams** | `CsvParser`, `RailwayDataLoader`, `BufferedReader` | [`08-file-io-nio2-and-csv-parsing.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/08-file-io-nio2-and-csv-parsing.md) |
| 09 | **Regex & String Processing** | Pre-compiled regex patterns, `StringBuilder` | [`09-regex-and-string-processing.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/09-regex-and-string-processing.md) |
| 10 | **Java Time API** | `LocalDateTime`, `LocalTime`, `Duration`, `ChronoUnit` | [`10-java-time-api.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/10-java-time-api.md) |
| 11 | **Stream API & Lambdas** | Declarative filtering, grouping, mapping, statistics | [`11-stream-api-and-lambdas.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/11-stream-api-and-lambdas.md) |
| 12 | **Optional & Null Safety** | Safe repository retrieval without `NullPointerException` | [`12-optional-and-null-safety.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/12-optional-and-null-safety.md) |
| 13 | **Comparable & Comparator** | Natural and dynamic heuristic platform/train sorting | [`13-comparable-and-comparator.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/13-comparable-and-comparator.md) |
| 14 | **Multithreading & Executors** | `ThreadPoolManager`, `ScheduledExecutorService` | [`14-concurrency-threads-and-executors.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/14-concurrency-threads-and-executors.md) |
| 15 | **Locks & Synchronization** | Synchronized history pruning and mutex guarantees | [`15-concurrency-locks-and-synchronization.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/15-concurrency-locks-and-synchronization.md) |
| 16 | **Atomic Collections** | `AtomicInteger`, `AtomicLong`, `ConcurrentHashMap` | [`16-concurrency-atomic-and-thread-safe-collections.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/16-concurrency-atomic-and-thread-safe-collections.md) |
| 17 | **CompletableFuture & Async** | Non-blocking external HTTP network client | [`17-completablefuture-and-async-io.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/17-completablefuture-and-async-io.md) |
| 18 | **Data Structures & Algorithms** | Binary Search, Heap Top-$K$, Station Graph BFS | [`18-data-structures-and-algorithms.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/18-data-structures-and-algorithms.md) |
| 19 | **Strategy & Factory Patterns** | Pluggable platform allocation algorithms | [`19-strategy-and-factory-patterns.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/19-strategy-and-factory-patterns.md) |
| 20 | **Observer & Singleton** | Real-time alert dispatching and singleton services | [`20-observer-and-singleton-patterns.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/20-observer-and-singleton-patterns.md) |
| 21 | **SOLID Principles** | Single Responsibility, Open/Closed, Clean Architecture | [`21-solid-principles-in-railflow.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/21-solid-principles-in-railflow.md) |
| 22 | **Unit Testing (JUnit 5)** | Automated test suite validating DSA and edge cases | [`22-unit-testing-with-junit-5.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/22-unit-testing-with-junit-5.md) |
| 23 | **Spring & Core Java** | Clean decoupling of framework and pure Java core | [`23-spring-boot-and-core-java-integration.md`](file:///d:/CS-ML-JAVA/RailFlow/docs/java-concepts/23-spring-boot-and-core-java-integration.md) |

---

## 📊 Data Structures & Algorithm Complexities

| Algorithm / Operation | Target Component | Time Complexity | Space Complexity |
|---|---|---|---|
| **Binary Search** | `TrainSearch.binarySearchByNumber()` | $O(\log N)$ | $O(1)$ |
| **Linear Search** | `TrainSearch.linearSearchByName()` | $O(N)$ | $O(1)$ |
| **Hash Table Lookup** | `DataRegistry.findById()` | $O(1)$ | $O(N)$ |
| **Top-$K$ Platform Congestion** | `PlatformRanking.getTopKCongested()` (Heap) | $O(N \log K)$ | $O(K)$ |
| **Route Network Graph BFS** | `RouteAnalyzer.findShortestTransferPath()` | $O(V + E)$ | $O(V)$ |
| **CSV Stream Tokenizer** | `CsvParser.parseLine()` | $O(L)$ per line | $O(L)$ |

---

## 🚀 How to Run RailFlow

### 1. Launching the Web Application & REST API (Primary Interface)

Double-click `start.bat` or run in PowerShell / Command Prompt:

```powershell
cd d:\CS-ML-JAVA\RailFlow
.\mvnw.cmd spring-boot:run
```

- **Web Dashboard**: `http://localhost:8080` (or open `frontend/index.html`)
- **REST API Endpoints**:
  - `GET /api/dashboard/stats`
  - `GET /api/platforms`
  - `GET /api/trains`
  - `GET /api/stations`
  - `GET /api/alerts`
  - `GET /api/platforms/recommendations`
  - `GET /api/data/stats` (CSV Dataset Stats)
  - `GET /api/data/records` (Paginated CSV records)
  - `GET /api/data/quality` (Data quality verification report)
  - `GET /api/data/architecture` (Java concepts breakdown)

### 2. Launching the Standalone Core Java Console (Secondary Interface)

To run the pure, standalone Core Java CLI without Spring Boot dependencies:

```powershell
cd d:\CS-ML-JAVA\RailFlow
.\run-console.bat
```

### 3. Running Automated Tests

```powershell
cd d:\CS-ML-JAVA\RailFlow
.\mvnw.cmd test
```

---

## 📜 License
MIT License. Built for Indian Railways station intelligence and Core Java architectural excellence.
