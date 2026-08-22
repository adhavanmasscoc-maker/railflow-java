# 🚉 RailFlow — Smart Railway Crowd Monitoring & Platform Optimization System

[![Java Version](https://img.shields.io/badge/Java-17%20%7C%2021%20%7C%2025-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io)
[![Vercel](https://img.shields.io/badge/Vercel_Deploy-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aknex-railflow.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Dataset](https://img.shields.io/badge/Indian_Railways_Data-22.1_MB_CSV-10b981?style=for-the-badge)](data/)

> **RailFlow is a Java-Core Railway Operations & Station Intelligence Platform where Core Java is the engineering foundation, the Web Application is the primary user interface, the empirical 22.1 MB Indian Railways CSV & PDF dataset is the primary data source, and the CLI is an independent secondary interface.**

---

## 🌐 Live Web Application & Repository Links

- 🔗 **Live Demo (Vercel)**: **[https://aknex-railflow.vercel.app](https://aknex-railflow.vercel.app)** *(or [https://railflow-java.vercel.app](https://railflow-java.vercel.app))*
- 🐙 **GitHub Repository**: **[https://github.com/adhavanmasscoc-maker/railflow-java](https://github.com/adhavanmasscoc-maker/railflow-java)**

---

## 📌 Problem Statement
Modern high-density railway terminals face severe challenges with sudden passenger surges, platform bottlenecks, train delay cascades, and uncoordinated gate throughput. These lead to dangerous overcrowding, delayed disembarkation, and safety hazards during peak hours.

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
| 01 | **Java Basics** | Primitive types, operators, enhanced control flow | [`01-java-basics.md`](docs/java-concepts/01-java-basics.md) |
| 02 | **OOP & Polymorphism** | Polymorphic `PlatformRecommendation` hierarchy | [`02-oop-encapsulation-inheritance-polymorphism.md`](docs/java-concepts/02-oop-encapsulation-inheritance-polymorphism.md) |
| 03 | **Abstract Classes & Interfaces** | `PlatformOptimizationStrategy`, `PlatformRepository` | [`03-abstract-classes-and-interfaces.md`](docs/java-concepts/03-abstract-classes-and-interfaces.md) |
| 04 | **Memory Model & Immutability** | `CrowdSnapshot`, `RailwayRecord`, defensive copying | [`04-java-memory-model-and-immutability.md`](docs/java-concepts/04-java-memory-model-and-immutability.md) |
| 05 | **Collections Framework** | `ConcurrentHashMap`, `PriorityQueue`, `ArrayList` | [`05-collections-framework-internals.md`](docs/java-concepts/05-collections-framework-internals.md) |
| 06 | **Generics & Type Safety** | `DataRegistry<K, V>`, bounded wildcards | [`06-generics-and-type-safety.md`](docs/java-concepts/06-generics-and-type-safety.md) |
| 07 | **Custom Exceptions** | `InvalidCrowdCountException`, `GlobalExceptionHandler` | [`07-custom-and-checked-exceptions.md`](docs/java-concepts/07-custom-and-checked-exceptions.md) |
| 08 | **File I/O & CSV Streams** | `CsvParser`, `RailwayDataLoader`, `BufferedReader` | [`08-file-io-nio2-and-csv-parsing.md`](docs/java-concepts/08-file-io-nio2-and-csv-parsing.md) |
| 09 | **Regex & String Processing** | Pre-compiled regex patterns, `StringBuilder` | [`09-regex-and-string-processing.md`](docs/java-concepts/09-regex-and-string-processing.md) |
| 10 | **Java Time API** | `LocalDateTime`, `LocalTime`, `Duration`, `ChronoUnit` | [`10-java-time-api.md`](docs/java-concepts/10-java-time-api.md) |
| 11 | **Stream API & Lambdas** | Declarative filtering, grouping, mapping, statistics | [`11-stream-api-and-lambdas.md`](docs/java-concepts/11-stream-api-and-lambdas.md) |
| 12 | **Optional & Null Safety** | Safe repository retrieval without `NullPointerException` | [`12-optional-and-null-safety.md`](docs/java-concepts/12-optional-and-null-safety.md) |
| 13 | **Comparable & Comparator** | Natural and dynamic heuristic platform/train sorting | [`13-comparable-and-comparator.md`](docs/java-concepts/13-comparable-and-comparator.md) |
| 14 | **Multithreading & Executors** | `ThreadPoolManager`, `ScheduledExecutorService` | [`14-concurrency-threads-and-executors.md`](docs/java-concepts/14-concurrency-threads-and-executors.md) |
| 15 | **Locks & Synchronization** | Synchronized history pruning and mutex guarantees | [`15-concurrency-locks-and-synchronization.md`](docs/java-concepts/15-concurrency-locks-and-synchronization.md) |
| 16 | **Atomic Collections** | `AtomicInteger`, `AtomicLong`, `ConcurrentHashMap` | [`16-concurrency-atomic-and-thread-safe-collections.md`](docs/java-concepts/16-concurrency-atomic-and-thread-safe-collections.md) |
| 17 | **CompletableFuture & Async** | Non-blocking external HTTP network client | [`17-completablefuture-and-async-io.md`](docs/java-concepts/17-completablefuture-and-async-io.md) |
| 18 | **Data Structures & Algorithms** | Binary Search, Heap Top-$K$, Station Graph BFS | [`18-data-structures-and-algorithms.md`](docs/java-concepts/18-data-structures-and-algorithms.md) |
| 19 | **Strategy & Factory Patterns** | Pluggable platform allocation algorithms | [`19-strategy-and-factory-patterns.md`](docs/java-concepts/19-strategy-and-factory-patterns.md) |
| 20 | **Observer & Singleton** | Real-time alert dispatching and singleton services | [`20-observer-and-singleton-patterns.md`](docs/java-concepts/20-observer-and-singleton-patterns.md) |
| 21 | **SOLID Principles** | Single Responsibility, Open/Closed, Clean Architecture | [`21-solid-principles-in-railflow.md`](docs/java-concepts/21-solid-principles-in-railflow.md) |
| 22 | **Unit Testing (JUnit 5)** | Automated test suite validating DSA and edge cases | [`22-unit-testing-with-junit-5.md`](docs/java-concepts/22-unit-testing-with-junit-5.md) |
| 23 | **Spring & Core Java** | Clean decoupling of framework and pure Java core | [`23-spring-boot-and-core-java-integration.md`](docs/java-concepts/23-spring-boot-and-core-java-integration.md) |

---

## ⚡ Data Structures & Algorithms Matrix

| Algorithm / Operation | Implementation Class | Time Complexity | Space Complexity |
|---|---|---|---|
| **Binary Search (Exact Train Number)** | `TrainSearch.binarySearchByNumber()` | $O(\log N)$ | $O(1)$ |
| **Linear Search (Partial Train Name)** | `TrainSearch.linearSearchByName()` | $O(N)$ | $O(1)$ |
| **Direct Hash Table Lookup** | `DataRegistry.findById()` | $O(1)$ | $O(N)$ |
| **Top-$K$ Platform Congestion (Min-Heap)** | `PlatformRanking.getTopKCongested()` | $O(N \log K)$ | $O(K)$ |
| **Top-$K$ Safest Platforms (Max-Heap)** | `PlatformRanking.getTopKSafest()` | $O(N \log K)$ | $O(K)$ |
| **Station Route Network Graph (BFS)** | `RouteAnalyzer.findShortestTransferPath()` | $O(V + E)$ | $O(V)$ |
| **Stream CSV Tokenizer** | `CsvParser.parseLine()` | $O(L)$ per line | $O(L)$ |

---

## 🚀 How to Run Locally

### 1. Launching the Web Application & REST API (Primary Interface)

```powershell
cd d:\CS-ML-JAVA\RailFlow
.\start.bat
```

- **Web Dashboard**: `http://localhost:8080` (or open `frontend/index.html`).
- **REST Endpoints**:
  - `GET /api/dashboard/stats`
  - `GET /api/platforms` & `PUT /api/platforms/{id}/crowd`
  - `GET /api/trains` & `GET /api/trains/search?query=12301`
  - `GET /api/stations` & `GET /api/stations/search?query=MAS`
  - `GET /api/alerts` & `POST /api/alerts/{id}/dismiss`
  - `GET /api/platforms/recommendations` & `POST /api/platforms/recommendations/{id}/apply`
  - `GET /api/data/stats` (CSV Dataset Stats)
  - `GET /api/data/records?page=0&size=50` (Master CSV Data Explorer)
  - `GET /api/data/quality` (Data Validation Score & Report)
  - `GET /api/data/architecture` (Interactive Core Java Concept Visualizer)

### 2. Launching the Standalone Core Java Console (Secondary Interface)

```powershell
cd d:\CS-ML-JAVA\RailFlow
.\run-console.bat
```

---

## 📜 License
MIT License © 2026 RailFlow Architecture Team.
