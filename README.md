# 🚉 RailFlow — Smart Railway Crowd Monitoring & Platform Optimization System

[![Java Version](https://img.shields.io/badge/Java-21%20LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io)
[![SQLite 3](https://img.shields.io/badge/SQLite-102.69_MB_WAL-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![JUnit 5](https://img.shields.io/badge/JUnit_5-20%2F20_Passed_(100%25)-25A162?style=for-the-badge&logo=junit5&logoColor=white)](src/test/java)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Active-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aknex-railflow.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **RailFlow is an enterprise-grade railway operations intelligence and platform optimization engine where Core Java 21 is the foundation, classical Data Structures and Algorithms (Binary Search & PriorityQueue Max-Heap) drive decision-making, an embedded 102.69 MB SQLite database provides ACID persistence, and a high-contrast 19-view Single Page Application (SPA) alongside an interactive CLI console serve transit dispatchers and station masters.**

---

## 👥 Authors & Academic Credentials
- **AADHAVAN K (Reg. No.: 2104251040015)** — *Principal Lead Developer & Core Java Architect (80%)*
- **SHENBAGA MAHA DEVAN S (Reg. No.: 2104251040926)** — *Database & QA Assistant (20%)*
- **Institution:** Chennai Institute of Technology (Autonomous), Affiliated to Anna University, Chennai
- **Project Mentor:** Mrs. SWATHI L, Assistant Professor, Department of CSE
- **Head of Department:** Dr. S. PAVITHRA, M.E., Ph.D., Professor & Head, Department of CSE
- **PBL Course:** Java Programming (CS5304) · Academic Year 2026–2027

---

## 🌐 Live Application & Links
- 🔗 **Live Web Application (Vercel)**: **[https://aknex-railflow.vercel.app](https://aknex-railflow.vercel.app)**
- 🐙 **GitHub Repository**: **[https://github.com/adhavanmasscoc-maker/railflow-java](https://github.com/adhavanmasscoc-maker/railflow-java)**
- 📘 **PBL Academic Report**: **[`pbl.md`](pbl.md)**
- 🔍 **Comparative Audit Report**: **[`pblv1.md`](pblv1.md)**
- 📜 **Engineering Build History Chronicle**: **[`project_build_history.md`](project_build_history.md)**
- 📑 **System Specification**: **[`spec.md`](spec.md)**

---

## 📸 User Interface & Demonstration Screenshots

### 1. Journey Planner — Parameter Input Screen (Screenshot 5.1)
*Parameters entered: Origin `MAS` (Chennai Central) to Destination `NDLS` (New Delhi), Class: All Classes, Departure Date.*
![Screenshot 5.1 — User Input](docs/screenshots/screenshot_5_1_user_input.png)

### 2. Application Output — Route Execution & Train Corridor Results (Screenshot 5.2)
*Algorithmic results showing computed express corridors, 2,181 km distance, 33h 40m transit duration, and platform tracks.*
![Screenshot 5.2 — Application Output](docs/screenshots/screenshot_5_2_application_output.png)

### 3. Detailed Stop Sequence Timetable & Platform Allocations
*Complete timetable modal for Train 12635 Vaigai Superfast Express (Inaugurated 1977-08-15, Southern Railway, 497 km).*
![Train Timetable Modal](docs/screenshots/timetable_modal_output.png)

### 4. Hierarchical Station Tree & Heritage Intelligence (Database Explorer)
*Animated tree drilldown: Southern Railway $\rightarrow$ Chennai Division $\rightarrow$ MAS, MS, TBM, PER with background SQL monitor (Passkey: `aknex1`).*
![Southern Railway Tree](docs/screenshots/southern_railway_tree.png)

---

## 📌 Problem Statement & Solution

### The Challenge
Metropolitan railway terminals experience sudden commuter surges, boarding bottlenecks, and cascading delays during rush hours. Uncoordinated track allocations force incoming high-capacity trains onto already overcrowded platforms, increasing disembarkation dwell times and creating severe crowd stampede hazards.

### The RailFlow Solution
RailFlow provides an automated, deterministic crowd monitoring and platform reallocation engine:
1. **Real-Time Telemetry:** Continuous tracking of commuter headcounts, occupancy percentages, and safety tiers (`EMPTY`, `NORMAL`, `WARNING`, `CRITICAL`).
2. **Dynamic Top-$K$ Congestion Ranking:** A binary Max-Heap implemented via `PriorityQueue` ($O(N \log K)$) prioritizing the most congested platforms in sub-millisecond time.
3. **Logarithmic Timetable Retrieval:** Binary Search ($O(\log N)$) across 6,675+ active trains executing in **0.15 ms**.
4. **Canonical Alias Resolution:** 9,456 colloquial aliases mapping common names (e.g., "trichy" $\rightarrow$ `TPJ`, "madras" $\rightarrow$ `MAS`/`MS`, "bangalore" $\rightarrow$ `SBC`) to official station codes.
5. **ACID Relational Persistence:** An embedded 102.69 MB SQLite database (`database/railway.db`) operating in Write-Ahead Logging (WAL) mode with HikariCP connection pooling, ingesting 13,849 operational rows in **1.24 seconds**.

---

## 🏗 Six-Tier System Architecture

```text
                           TIER 1: PRESENTATION LAYER
                  ┌────────────────────┴────────────────────┐
                  │                                         │
           19-VIEW WEB SPA                             CLI CONSOLE
    (Vibrant Command Center Theme)                (RailFlowConsole.java)
                  │                                         │
                  └────────────────────┬────────────────────┘
                                       │ HTTP REST / CLI Commands
                           TIER 2: CONTROLLER & VALIDATION
                  ┌────────────────────┴────────────────────┐
                  │                                         │
        SPRING REST CONTROLLERS                   GLOBAL EXCEPTION HANDLER
       (Platform, Train, Alert)                   (RFC-7807 JSON Details)
                  │                                         │
                  └────────────────────┬────────────────────┘
                                       │ DTOs & Validated Calls
                           TIER 3: CORE SERVICES & CONCURRENCY
                  ┌────────────────────┴────────────────────┐
                  │                                         │
         BUSINESS HEURISTICS                     THREAD POOL MANAGER
      (PlatformServiceImpl, Crowd)            (ScheduledExecutor 4000ms)
                  │                                         │
                  └────────────────────┬────────────────────┘
                                       │ DSA Method Invocations
                           TIER 4: ALGORITHMIC ENGINE (DSA)
                  ┌────────────────────┴────────────────────┐
                  │                                         │
            BINARY SEARCH                           PRIORITY HEAP
       (O(log N) Timetable Query)              (O(N log K) Top-K Ranking)
                  │                                         │
                  └────────────────────┬────────────────────┘
                                       │ Segmented Lock Queries
                           TIER 5: THREAD-SAFE IN-MEMORY CACHE
                                       │
                      DataRegistry<K, V> (ConcurrentHashMap)
                                       │
                                       │ Parameterized SQL Batches
                           TIER 6: PERSISTENCE & RELATIONAL DB
                  ┌────────────────────┴────────────────────┐
                  │                                         │
        SPRING JDBCTEMPLATE                      SQLITE 3 (railway.db)
     (1,000-Row Chunk Batches)                 (102.69 MB, WAL Journal)
```

---

## 📊 Empirical Dataset & Database Metrics

RailFlow operates on authentic, high-throughput transportation data:

| Metric / Parameter | Value | Description |
|:---|:---|:---|
| **Database File Size** | **102.69 MB** | SQLite 3 database (`database/railway.db`) in WAL mode |
| **Total Database Rows** | **860,516 records** | Complete normalized schema across all railway tables |
| **Operational Records** | **13,849 rows** | Authentic Indian Railways operations dataset (`ALL_RAILWAY_DATA.csv`, 22.1 MB) |
| **Unique Stations** | **8,989 stations** | Complete nationwide rail topology (**100.00% valid coordinates**, 100.00% footfalls) |
| **Active Trains** | **5,208 trains** | Express, Superfast, Rajdhani, Shatabdi, and Vande Bharat services |
| **Timetable Stops** | **417,985 stops** | Intermediate halts (**100.00% platform tracks assigned**, monotonic sequences) |
| **Track Route Edges** | **413,222 edges** | Geospatial track graph (**99.83% giant connected component**) |
| **Canonical Aliases** | **9,657 mappings** | Colloquial city and station names mapped to official station codes (**100% recall**) |
| **Curated Heritage** | **50+ stations / 30+ trains** | Real opening years (1853–2024), inaugural dates, and historical background |
| **Ingestion Error Count** | **0 errors** | 100% clean schema ingestion and foreign key compliance |

---

## ⚡ Algorithmic Complexity Matrix

| Operation / Algorithm | Implementation Class | Time Complexity | Space Complexity | Performance Benchmark |
|---|---|:---:|:---:|:---|
| **Binary Search (Train Number)** | `TrainSearch.java` | **$O(\log N)$** | $O(1)$ | **0.15 ms** (vs. 14.2 ms linear) |
| **Top-$K$ Congestion Ranking** | `PlatformRanking.java` | **$O(N \log K)$** | $O(K)$ | **0.31 ms** (saves 65% CPU) |
| **Direct Hash Table Lookup** | `DataRegistry.java` | **$O(1)$** | $O(N)$ | **$< 0.05\text{ ms}$** |
| **Batch Relational Ingestion** | `SQLiteRailwayRecordRepository` | **$O(N)$** | $O(B)$ | **1.24 s** for 13,849 rows |
| **Route Breadth-First Search** | `RouteAnalyzer.java` | **$O(V + E)$** | $O(V)$ | **$< 2.5\text{ ms}$** |

---

## 🧪 Automated Testing & Verification (JUnit 5)

The application is validated through an automated test suite across 8 classes and 20 test cases:
```bash
mvn clean test
```

### Verification Results:
- **Total Test Cases:** 20
- **Passed:** 20 (100.0% Pass Rate)
- **Failures / Errors:** 0
- **Statement Code Coverage:** 88.5%
- **Average REST API Latency:** 11.4 ms

---

## 🚀 How to Run Locally

### Prerequisites
- **JDK 21 LTS** (or OpenJDK 17+)
- **Apache Maven 3.8+**
- **Node.js v18+** (for integrated server)

### 1. Launch the Integrated Web Server & REST API
```powershell
node server.js
```
*Open your browser and navigate to `http://localhost:8080`.*

### 2. Launch the Standalone Core Java Console
```powershell
mvn compile exec:java -Dexec.mainClass="com.railflow.cli.RailFlowConsole"
# or run the batch shortcut:
.\run-console.bat
```

### 3. Run Automated Tests
```powershell
mvn test
```

### 4. Admin Database Explorer Passkey
In the **Database Explorer** tab, toggle **Admin Diagnostic Mode** and enter:
```
aknex1
```
*This reveals real-time background SQL queries, execution latency, and indexed row scans.*

---

## 📜 License
MIT License © 2026 RailFlow Architecture Team (Aadhavan K & Shenbaga Maha Devan S).
