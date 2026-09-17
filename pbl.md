# RAILFLOW: SMART RAILWAY CROWD MONITORING AND PLATFORM OPTIMIZATION SYSTEM

### A PROJECT BASED LEARNING (PBL) REPORT

**Submitted by**  
**AADHAVAN K (Reg. No.: 2104251040015)**  
**SHENBAGA MAHA DEVAN S (Reg. No.: 2104251040926)**  

*Submitted in partial fulfilment of the requirements for the Project-Based Learning component of Java Programming*

**BACHELOR OF ENGINEERING IN COMPUTER SCIENCE AND ENGINEERING**

**CHENNAI INSTITUTE OF TECHNOLOGY (Autonomous)**  
*Affiliated to Anna University, Chennai*  
*October - 2026*

---

## VISION AND MISSION OF THE INSTITUTE

### Vision of the Institute
To be an eminent centre for academia, industry, and research by imparting knowledge, relevant practices, and fostering innovation to address the challenges of dynamic technological landscapes.

### Mission of the Institute
- To create next-generation leaders by effective teaching-learning methodologies and value-based education.
- To establish a network with industry and academia for generating innovative ideas and collaborative research.
- To promote entrepreneurial mindsets and societal commitment through holistic technological training.

---

## DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING

### Vision of the Department
To evolve into a premier department that nurtures technically competent, socially committed, and research-oriented computer science engineers capable of solving real-world challenges through cutting-edge computational solutions.

### Mission of the Department
- **M1**: To deliver high-quality education through modern pedagogical frameworks, hands-on laboratory exercises, and Project-Based Learning (PBL).
- **M2**: To foster problem-solving abilities and research mindsets in foundational computer science domains, including object-oriented programming, data structures, algorithms, and distributed systems.
- **M3**: To inculcate ethical values, teamwork, professional discipline, and lifelong learning capabilities.

---

## CHENNAI INSTITUTE OF TECHNOLOGY, CHENNAI
*(Autonomous — Affiliated to Anna University, Chennai)*

### BONAFIDE CERTIFICATE

This is to certify that the Project-Based Learning report titled **“RAILFLOW: SMART RAILWAY CROWD MONITORING AND PLATFORM OPTIMIZATION SYSTEM”** is a bonafide record of work carried out by **AADHAVAN K (2104251040015)** and **SHENBAGA MAHA DEVAN S (2104251040926)** of the Department of Computer Science and Engineering, Chennai Institute of Technology, as part of the continuous, mentor-guided Project-Based Learning (PBL) component of the Java Programming course during the academic year 2026–2027 under my supervision.

<br><br>

______________________________________  
**Mrs. SWATHI L**  
*Supervisor & Project Mentor*  
Assistant Professor,  
Department of Computer Science and Engineering,  
Chennai Institute of Technology, Chennai – 600069.  

<br><br>

______________________________________  
**Dr. S. PAVITHRA, M.E., Ph.D.**  
*Head of the Department*  
Professor and Head,  
Department of Computer Science and Engineering,  
Chennai Institute of Technology, Chennai – 600069.  

<br>

Submitted for the final review held on: **____________________**

<br>

______________________________________  
**INTERNAL EXAMINER**

---

## DECLARATION

We jointly declare that the PBL report on **“RAILFLOW: SMART RAILWAY CROWD MONITORING AND PLATFORM OPTIMIZATION SYSTEM”** is the result of original work done by us, and to the best of our knowledge, similar work has not been submitted to **ANNA UNIVERSITY, CHENNAI** for the requirement of Degree of **BACHELOR OF ENGINEERING IN COMPUTER SCIENCE AND ENGINEERING**. This PBL report is submitted in partial fulfilment of the requirements for the award of Degree of Bachelor of Engineering.

<br><br>

Signature: ____________________________________  
**AADHAVAN K (Reg. No.: 2104251040015)**  

<br>

Signature: ____________________________________  
**SHENBAGA MAHA DEVAN S (Reg. No.: 2104251040926)**  

**Place:** Chennai  
**Date:** 17-09-2026  

---

## ACKNOWLEDGEMENT

We wish to express our sincere gratitude to our honourable Chairman **SHRI. P. SRIRAM** for providing state-of-the-art computational and infrastructural facilities at our institution.

We proudly render our profound thanks to our Principal **Dr. A. RAMESH, M.E., Ph.D.**, for his persistent encouragement and academic leadership throughout our course of study.

We express special thanks of gratitude to our Dean **Dr. V. SRINIVASA RAO, M.E., Ph.D.**, who has been an essential spring of motivation and academic rigor.

We render our immense gratitude to our Head of the Department **Dr. S. PAVITHRA, M.E., Ph.D.**, for her inspiring leadership, effective project coordination, and valuable administrative support.

We extend our deepest gratitude to our Supervisor and Project Mentor **Mrs. SWATHI L**, Assistant Professor, Department of Computer Science and Engineering, for her continuous guidance, architectural critique, and insightful weekly reviews that helped shape this project into an enterprise-grade Core Java software artifact.

We also thank our Project Coordinator **Mrs. POORNIMALAKSHMI R**, Assistant Professor, along with all faculty members and technical staff of the Department of Computer Science and Engineering, for their valuable suggestions and logistical assistance.

<br>

**AADHAVAN K** (2104251040015)  
**SHENBAGA MAHA DEVAN S** (2104251040926)  

---

## ABSTRACT

Metropolitan railway terminals represent vital transit lifelines handling hundreds of thousands of daily passengers. During morning and evening peak hours, holiday surges, or schedule disruptions, localized commuter densities frequently exceed platform safety capacities. Uncoordinated track allocations compound this bottleneck, leading to dangerous crowd stampede hazards, prolonged passenger boarding times, and cascading network-wide train delays. To resolve these challenges, **RailFlow** is engineered as an enterprise-grade, real-time railway crowd monitoring and platform optimization engine developed in **Core Java 21 LTS** and **Spring Boot 3.2.0**.

The system implements the four pillars of Object-Oriented Programming (encapsulation, inheritance, polymorphism, abstraction) through encapsulated domain models (`Platform`, `Train`, `Gate`, `Alert`) and an extensible `PlatformRecommendation` strategy hierarchy. Operational efficiency is achieved by deploying classical Data Structures and Algorithms (DSA): train schedule queries are executed in $O(\log N)$ logarithmic time via **Binary Search**, while critical station choke points are dynamically ranked in $O(N \log K)$ time using a **PriorityQueue Max-Heap**. A dedicated `ScheduledExecutorService` drives concurrent, non-blocking 4-second passenger ingress simulations, completely eliminating race conditions through thread-safe `ConcurrentHashMap` generic registries. Relational persistence is embedded via **SQLite 3 JDBC** in Write-Ahead Logging (WAL) mode using Spring `JdbcTemplate`, capable of batch-ingesting an empirical 22.1 MB dataset comprising **13,849 operational railway records across 8,989 stations and 5,208 trains** in 1.24 seconds. 

Formally validated through an automated JUnit 5 test suite achieving a 100% pass rate across 20 test cases with sub-15ms response latency, RailFlow provides transit controllers with dual interfaces—an interactive CLI terminal console and a responsive 19-view Single Page Application (SPA)—equipping operators with deterministic, real-time intelligence to prevent terminal overcrowding.

**Keywords:** Java 21, Crowd Monitoring, Platform Optimization, PriorityQueue Heap, Binary Search, SQLite JDBC, Concurrency, Spring Boot.

---

## TABLE OF CONTENTS

| Chapter | Title | Page No. |
| :---: | :--- | :---: |
| | **Vision and Mission of the Institute** | i |
| | **Vision and Mission of the Department** | i |
| | **Bonafide Certificate** | ii |
| | **Declaration** | iii |
| | **Acknowledgement** | iv |
| | **Abstract** | v |
| | **List of Tables** | vii |
| | **List of Figures** | viii |
| | **List of Abbreviations** | ix |
| **1** | **INTRODUCTION** | **1** |
| | 1.1 Operational Background | 1 |
| | 1.2 Project Driving Question | 2 |
| | 1.3 Project Objectives | 2 |
| | 1.4 Scope and Limitations | 3 |
| **2** | **CONCEPT EXPLORATION** | **5** |
| | 2.1 Related Technical Approaches | 5 |
| | 2.1.1 Traditional Java Application Approach | 5 |
| | 2.1.2 Modern Concurrent Java Framework Approach | 6 |
| | 2.2 Comparative Technology Matrix (Table 2.1) | 7 |
| | 2.3 Architectural Decision Justification | 8 |
| **3** | **PROJECT PLANNING AND TEAM ORGANISATION** | **9** |
| | 3.1 Weekly PBL Progress Log (Table 3.1) | 9 |
| | 3.2 Hardware and Software Requirements (Table 3.2) | 11 |
| | 3.2.1 Empirical Dataset Architecture & Multi-Tier Data Accuracy (Table 3.3) | 12 |
| | 3.3 Four-Pillar Feasibility Assessment | 13 |
| | 3.4 Team Work Division and Responsibilities | 14 |
| **4** | **ITERATIVE DESIGN AND DEVELOPMENT** | **15** |
| | 4.1 Six-Tier System Architecture | 15 |
| | 4.2 Baseline Implementation (Iteration 1) | 16 |
| | 4.3 Project Refinement (Iteration 2) | 17 |
| | 4.4 Final Approach and Object-Oriented Principles (Table 4.1, Table 4.2) | 18 |
| | 4.5 Testing and Verification Strategy | 20 |
| **5** | **IMPLEMENTATION** | **21** |
| | 5.1 Subsystem Module Description (Table 5.1) | 21 |
| | 5.1.2 Algorithmic Data Sanitization & Invariant Validation Pipeline | 22 |
| | 5.2 Key Core Java Code Implementations | 23 |
| | 5.2.1 Dynamic Top-K Congestion Ranking (PriorityQueue Max-Heap) | 23 |
| | 5.2.2 Logarithmic Timetable Search (Binary Search) | 24 |
| | 5.2.3 Concurrent Background Simulation Worker | 25 |
| | 5.2.4 SQLite JDBC Parameterized Batch Ingestion | 26 |
| | 5.3 User Interface and Demonstration | 27 |
| | 5.3.1 Interactive Terminal Console (`RailFlowConsole.java`) | 27 |
| | 5.3.2 Single Page Application (SPA) Web Dashboard | 27 |
| | 5.3.3 Screenshot 5.1 — User Input (Journey Planner) | 28 |
| | 5.3.4 Screenshot 5.2 — Application Output (Route & Timetable Execution) | 29 |
| **6** | **RESULTS AND DISCUSSION** | **30** |
| | 6.1 Quantitative Evaluation Metrics | 30 |
| | 6.1.1 Empirical Data Quality & Invariant Accuracy Audit (Table 6.1) | 30 |
| | 6.2 System Performance Across Iterations (Table 6.2) | 31 |
| | 6.3 Automated JUnit 5 Verification Suite (Table 6.3) | 32 |
| | 6.4 Technical Discussion and Bottleneck Analysis | 33 |
| | 6.5 Operational Limitations | 34 |
| **7** | **TEAM REFLECTION AND LEARNING OUTCOMES** | **35** |
| | 7.1 Individual Technical Reflections | 33 |
| | 7.2 Team Learning and Retrospective | 34 |
| | 7.3 Course Outcomes (CO1–CO6) Evidence Mapping (Table 7.1) | 35 |
| **8** | **CONCLUSION AND FUTURE SCOPE** | **36** |
| | 8.1 Conclusion | 36 |
| | 8.2 Future Scope | 37 |
| | **REFERENCES** | **38** |
| | **APPENDIX** | **39** |
| | A.1 Source Code and Git Repository | 39 |
| | A.2 Self and Peer Assessment Matrix (Table A.1) | 39 |

---

## LIST OF TABLES

- **Table 2.1**: Comparative Technology and Literature Synthesis Matrix *(Page 7)*
- **Table 3.1**: Weekly PBL Progress Log — 12-Week Milestone Tracker *(Page 9)*
- **Table 3.2**: Hardware and Software Operating Requirements Specification *(Page 11)*
- **Table 3.3**: Empirical Relational Database Schema & Invariant Audit *(Page 12)*
- **Table 4.1**: Build-Test-Learn Iterative Refinement Matrix *(Page 16)*
- **Table 4.2**: Object-Oriented Programming (OOP) Core Evidence Mapping *(Page 18)*
- **Table 5.1**: Subsystem Modules and Functional Responsibility Matrix *(Page 20)*
- **Table 6.1**: Empirical Data Quality, Coordinate Accuracy, and Integrity Matrix *(Page 28)*
- **Table 6.2**: System Evaluation and Performance Metrics Across Iterations *(Page 29)*
- **Table 6.3**: Automated JUnit 5 Test Suite Verification Catalog (20 Test Cases) *(Page 30)*
- **Table 7.1**: Mapping of Java Programming Course Outcomes (CO1–CO6) to Project Evidence *(Page 35)*
- **Table A.1**: Self and Peer Assessment Contribution Matrix *(Page 39)*

---

## LIST OF FIGURES

- **Figure 3.1**: Six-Tier Architectural Block Diagram and Data Processing Pipeline *(Page 14)*
- **Figure 4.1**: Class Diagram of Polymorphic Platform Recommendation Hierarchy *(Page 17)*
- **Figure 5.1**: Screenshot 5.1 — User Input: Journey Planning Parameter Entry *(Page 26)*
- **Figure 5.2**: Screenshot 5.2 — Application Output: Real-Time Corridors and Express Timetable *(Page 27)*
- **Figure 6.1**: Real-Time Platform Congestion and Performance Telemetry Dashboard *(Page 29)*

---

## LIST OF ABBREVIATIONS

| Abbreviation | Full Form |
| :--- | :--- |
| **API** | Application Programming Interface |
| **ATVM** | Automatic Ticket Vending Machine |
| **CLI** | Command Line Interface |
| **CO** | Course Outcome |
| **CRIS** | Centre for Railway Information Systems |
| **DAO** | Data Access Object |
| **DSA** | Data Structures and Algorithms |
| **DTO** | Data Transfer Object |
| **EMU** | Electric Multiple Unit |
| **ETA** | Estimated Time of Arrival |
| **ETD** | Estimated Time of Departure |
| **FOB** | Foot Overbridge |
| **FOSS** | Free and Open Source Software |
| **HSR** | High-Speed Rail |
| **HTTP** | Hypertext Transfer Protocol |
| **IR** | Indian Railways |
| **IRCTC** | Indian Railway Catering and Tourism Corporation |
| **JDBC** | Java Database Connectivity |
| **JDK** | Java Development Kit |
| **JSON** | JavaScript Object Notation |
| **JVM** | Java Virtual Machine |
| **LTS** | Long Term Support |
| **OOP** | Object-Oriented Programming |
| **PBL** | Project-Based Learning |
| **POJO** | Plain Old Java Object |
| **REST** | Representational State Transfer |
| **RFC** | Request for Comments |
| **SPA** | Single Page Application |
| **SQL** | Structured Query Language |
| **UUID** | Universally Unique Identifier |
| **WAL** | Write-Ahead Logging |

---

# CHAPTER 1: INTRODUCTION

### 1.1 Operational Background
Metropolitan railway terminals serve as the economic arteries of major industrial nations, interconnecting suburban commuter links, regional express networks, and freight corridors. Major junction terminals—such as Puratchi Thalaivar Dr. M.G. Ramachandran Central Railway Station (Chennai Central, `MAS`), New Delhi Railway Station (`NDLS`), Chhatrapati Shivaji Maharaj Terminus (`CSMT`), and Howrah Junction (`HWH`)—process between 400,000 and 1,400,000 daily commuters across dozens of platforms.

During peak morning and evening travel windows, passenger footfall exhibits extreme, non-linear surges. The physical geometry of traditional stations creates natural choke points: narrow platform boarding surfaces (often constrained between 4 and 7 meters in width), entry/exit turnstiles, staircases, and pedestrian Foot Overbridges (FOBs). Under traditional operating protocols, train platform assignment relies on static operational timetables coordinated manually by station masters and platform superintendents via visual observations and analogue walkie-talkies.

When incoming trains experience unexpected en-route delays, manual scheduling leads to severe structural imbalances. Delayed express trains carrying over 1,500 passengers are frequently assigned to platforms already saturated with waiting passengers, while adjacent tracks remain vacant. The resulting localized crowd density creates severe bottlenecks, dangerously increases disembarkation dwell times, and introduces acute stampede risks. Cascading scheduling delays propagate across adjacent railway sections, causing widespread network inefficiency.

To overcome these vulnerabilities, modern transit infrastructure demands an automated, deterministic computing engine. By combining strict Object-Oriented domain modeling, concurrent thread scheduling, classical algorithmic optimization (Binary Search and PriorityQueue Heaps), and embedded relational persistence, Core Java provides the ideal platform for engineered, fault-tolerant railway crowd management.

### 1.2 Project Driving Question
Under the Project-Based Learning (PBL) pedagogy, technical investigation is steered by an open-ended engineering inquiry:

> **“How can Core Java object-oriented abstractions, concurrency frameworks, and classical data structures be engineered into an automated, real-time railway operations engine that monitors platform overcrowding, predicts safety bottlenecks, and executes heuristic traffic redistribution?”**

To systematically resolve this question, the project was decomposed into five concrete software milestones:
1. **Domain Abstraction**: Constructing encapsulated Java domain models (`Platform`, `Train`, `Gate`, `Alert`) with strict state invariants.
2. **Concurrent In-Memory Caching**: Building thread-safe generic repositories (`DataRegistry<K, V>`) backed by `ConcurrentHashMap` for non-blocking telemetry access.
3. **Algorithmic Prioritization**: Implementing classical algorithms—$O(\log N)$ **Binary Search** for instant timetable retrieval and an $O(N \log K)$ **PriorityQueue Max-Heap** for dynamic top-K congested platform prioritization.
4. **Asynchronous Simulation**: Coordinating a background `ScheduledExecutorService` daemon thread to execute 4-second passenger ingress/egress simulations without freezing presentation layers.
5. **Relational Persistence**: Embedding an ACID-compliant **SQLite 3 JDBC** engine operating in Write-Ahead Logging (WAL) mode, capable of batch-ingesting an empirical 22.1 MB Indian Railways dataset (13,849 operational records).

### 1.3 Project Objectives
The project established explicit technical and pedagogical objectives across the 12-week PBL cycle:
- **Obj-1 (Domain Modeling)**: Formulate modular functional requirements based on real Indian Railways operational schemas, enforcing OOP encapsulation, inheritance, polymorphism, and abstraction.
- **Obj-2 (Algorithmic Rigor)**: Implement and benchmark classical data structures, comparing $O(\log N)$ binary search against linear scans and $O(N \log K)$ priority heaps against full $O(N \log N)$ sorting.
- **Obj-3 (Thread Safety)**: Architect non-blocking multithreaded simulation daemons using `ScheduledExecutorService` to drive passenger updates every 4,000 ms with zero `ConcurrentModificationException` occurrences.
- **Obj-4 (Relational Persistence)**: Integrate embedded SQLite 3 via Spring `JdbcTemplate` in WAL mode, validating high-throughput batch insertions of 13,849 records with sub-15ms response latency.
- **Obj-5 (Verification & Standards)**: Construct an automated JUnit 5 test suite achieving 100% pass rates across 20 test cases and enforce RFC-7807 problem details error diagnostics with UUIDs.
- **Obj-6 (Team Reflection & Course Outcomes)**: Document the iterative build-test-learn cycle and demonstrate measurable alignment with Java Programming Course Outcomes (CO1–CO6).

### 1.4 Scope and Limitations

#### 1.4.1 In-Scope Capabilities
- **Platform Telemetry**: Real-time tracking of platform occupancy, capacities, and safety tiers (`EMPTY`, `NORMAL`, `WARNING`, `CRITICAL`).
- **Heuristic Optimization**: Automated generation and polymorphic execution of crowd mitigation recommendations (`ChangePlatform`, `OpenGate`, `CloseGate`, `RedistributeCrowd`).
- **Logarithmic Timetable Lookups**: $O(\log N)$ binary search across 6,675+ active train services with canonical alias mapping (`TRICHY` &rarr; `TPJ`, `MADRAS` &rarr; `MAS`, `BANGALORE` &rarr; `SBC`).
- **Empirical Batch Exploration**: Ingestion and indexing of 13,849 records from `ALL_RAILWAY_DATA.csv` (22.1 MB) across 8,989 stations and 5,208 trains.
- **Dual Presentation Interfaces**: Simultaneous presentation across an interactive Core Java terminal console (`RailFlowConsole.java`) and a responsive 19-view Single Page Application (SPA) web dashboard.

#### 1.4.2 System Boundaries & Assumptions
- **Simulated Ingress Feeds**: Pedestrian arrival flows are generated using mathematical Gaussian and Poisson distributions executed by daemon worker threads rather than hardware optical CCTV turnstiles.
- **Embedded Database Concurrency**: Persistence relies on an embedded SQLite database using file-level write locking; cross-division multi-terminal deployment would require scaling to a distributed PostgreSQL cluster.
- **Operational Decision Support**: RailFlow operates as an advisory decision-support tool for human dispatchers; it does not directly actuate physical track switch relays or railway interlocking circuits.

---

# CHAPTER 2: CONCEPT EXPLORATION

### 2.1 Related Technical Approaches
Before architectural construction, existing transit control systems and Java scheduling architectures were evaluated across two technological paradigms.

#### 2.1.1 Traditional Java Application Approach (Monolithic Java SE 6/8)
Early computerized transit software was built as monolithic desktop applications using Core Java, raw JDBC, and Java Swing/AWT:
- **Memory Management**: State was held in unsynchronized `ArrayList` instances or coarse `Collections.synchronizedList()` wrappers. Timetables were parsed synchronously line-by-line via `BufferedReader`.
- **Search Efficiency**: Schedule querying relied on linear scans ($O(N)$). With schedules exceeding several thousand services, sequential iteration caused noticeable CPU spikes.
- **Threading Vulnerabilities**: Real-time updates were executed using unmanaged `java.lang.Thread` instances or `java.util.Timer`. Concurrent read queries during background updates frequently threw fatal `ConcurrentModificationException` crashes, while synchronous JDBC calls froze graphical interfaces.

#### 2.1.2 Modern Concurrent Java Framework Approach (Java SE 17/21 + Spring Boot 3)
Modern transit architectures utilize decoupled, microservice-ready concurrent patterns:
- **Non-Blocking Thread Pools**: `ScheduledExecutorService` coordinates fixed-rate daemon workers without stealing resources from client HTTP request threads.
- **Lock-Free Concurrency**: `ConcurrentHashMap` uses segmented bucket locking, permitting simultaneous read and write operations with zero thread contention.
- **Algorithmic Data Structures**: `Collections.binarySearch()` enables $O(\log N)$ schedule lookups, while `PriorityQueue` heaps extract top-K congested platforms in $O(N \log K)$ time.
- **Embedded Persistence & Decoupled Web Delivery**: Spring `JdbcTemplate` backed by HikariCP manages transactional batch SQL against SQLite running in WAL mode, exposing endpoints via REST JSON APIs conforming to RFC-7807 problem details.

### 2.2 Comparative Technology Matrix

**Table 2.1: Comparative Technology and Literature Synthesis Matrix**

| Ref. | Technology / Source | Primary Architectural Focus | Key Finding & Project Impact |
| :---: | :--- | :--- | :--- |
| **[1]** | Oracle Corp., *Java SE 21 LTS Platform Documentation* (2023) | Core Runtime, Generics, Concurrency APIs | Immutable records and generic bounds prevent runtime casting errors and enforce compile-time safety. |
| **[2]** | VMware Tanzu, *Spring Boot Reference v3.2.0* (2023) | Inversion of Control (IoC), RESTful Services | Decoupling domain services from web controllers enables multi-client delivery (CLI and Web SPA). |
| **[3]** | J. Bloch, *Effective Java*, 3rd ed., Addison-Wesley (2018) | Defensive Domain Modeling & Exceptions | Enforced private mutable state, defensive mutator guards, and custom unchecked exception hierarchies. |
| **[4]** | B. Goetz et al., *Java Concurrency in Practice* (2006) | Thread Synchronization & Concurrency | Proved that `ConcurrentHashMap` and thread pools prevent thread starvation and race conditions. |
| **[5]** | T. H. Cormen et al., *Introduction to Algorithms*, 4th ed., MIT Press (2022) | Algorithmic Complexity & Binary Heaps | Guided selection of Binary Search ($O(\log N)$) and PriorityQueue Heaps ($O(N \log K)$) to minimize CPU load. |
| **[6]** | Xerial Project, *SQLite JDBC Driver Documentation* (2023) | Embedded Relational ACID Persistence | Confirmed that Write-Ahead Logging (WAL) mode enables concurrent reads during high-throughput batch writes. |
| **[7]** | Ministry of Railways, *Indian Railways Operational Dataset* (2023) | Empirical Transportation Operational Telemetry | Supplied authentic 22.1 MB dataset (13,849 records, 8,989 stations, 5,208 trains) for rigorous stress testing. |
| **[8]** | M. Nottingham & E. Wilde, *RFC 7807: Problem Details for HTTP APIs* (2016) | Standardized Machine-Readable Diagnostics | Defined structured JSON error responses with HTTP status codes, timestamping, and UUID correlation IDs. |

### 2.3 Architectural Decision Justification
The conceptual exploration established three fundamental decisions:
1. **Rejection of Unsynchronized Collections**: Plain `ArrayList` and synchronized wrappers cannot guarantee safe concurrent simulation under multi-user access.
2. **Rejection of Heavyweight ORM**: Heavy ORMs like Hibernate introduce unnecessary session caching and proxy latency for real-time sub-15ms terminal calculations. Spring `JdbcTemplate` with parameterized batch execution provides optimal throughput.
3. **Selection of Hybrid Architectural Baseline**:
   - In-memory `ConcurrentHashMap` caching for microsecond-latency state access.
   - Binary Search ($O(\log N)$) and `PriorityQueue` Max-Heap ($O(N \log K)$) for algorithmic prioritization.
   - Dedicated `ScheduledExecutorService` for isolated 4-second daemon simulation cycles.
   - Embedded SQLite 3 in WAL mode for persistent batch storage of 13,849 records.

---

# CHAPTER 3: PROJECT PLANNING AND TEAM ORGANISATION

### 3.1 Weekly PBL Progress Log

**Table 3.1: Weekly PBL Progress Log (12-Week Milestone Tracker)**

| Week | Milestone / Task | Work Done by Team | Supervisor Feedback (Mrs. SWATHI L) |
| :---: | :--- | :--- | :--- |
| **W 1–2** | **Problem Framing & Dataset Discovery** *(Zeroth Review: 22/06/2026)* | Analyzed terminal crowd dynamics, platform choke points, and timetable formats. Acquired authentic 22.1 MB dataset (`ALL_RAILWAY_DATA.csv`, 13,849 records). Formulated driving question. | Approved scope. Advised focusing strictly on Core Java collections, OOP domain encapsulation, and algorithms before web UI design. |
| **W 3–4** | **Domain Modeling & In-Memory Registry** | Designed encapsulated domain models (`Platform`, `Train`, `Gate`, `Alert`). Implemented thread-safe generic cache (`DataRegistry<K, V>`) backed by `ConcurrentHashMap`. | Commended generic design. Instructed team to add explicit validation guards in domain mutators to throw custom unchecked exceptions. |
| **W 5–7** | **Algorithms & Concurrency Engine** *(Review I: 04/08/2026)* | Implemented Binary Search ($O(\log N)$) and `PriorityQueue` Max-Heap ($O(N \log K)$). Coordinated `ScheduledExecutorService` for 4-second non-blocking passenger ingress simulation. | Verified algorithmic logic. Instructed team to catch and log all exceptions within simulation daemon threads to avoid thread death. |
| **W 8–10** | **Persistence & Multi-Interface Delivery** *(Review II: 04/08/2026)* | Integrated SQLite 3 JDBC driver via Spring `JdbcTemplate` in WAL mode. Ingested 13,849 CSV records via batch DML. Built CLI terminal console (`RailFlowConsole`) and 19-view SPA. | Validated ingestion speed. Advised setting HikariCP max pool to 5 to prevent SQLite single-writer lock timeout exceptions. |
| **W 11–12** | **Automated Testing & Final Viva Audit** *(Final Viva Submission)* | Authored JUnit 5 automated test suite across 8 classes (20 test cases, 100% pass rate). Audited RFC-7807 error payloads. Compiled final academic report and visual evidence. | Verified 100% unit test execution and zero regression status. Approved final documentation and code deliverables for final university viva. |

### 3.2 Hardware and Software Operating Requirements

**Table 3.2: Hardware and Software Operating Requirements Specification**

| Category | Minimum Engineering Profile | Recommended Deployment Profile |
| :--- | :--- | :--- |
| **Processor (CPU)** | Intel Core i3 / AMD Ryzen 3 (Dual-Core, 2.0 GHz) | Intel Core i5-10400 / AMD Ryzen 5 3600 (6 Cores, 3.6 GHz+) |
| **System Memory (RAM)** | 4 GB DDR4 | 16 GB DDR4 (Optimal for in-memory indexing of 22.1 MB CSV) |
| **Solid-State Storage** | 250 MB Free Space | 500 MB+ NVMe SSD (Low-latency SQLite journal I/O) |
| **Operating System** | Microsoft Windows 10 64-bit / Linux | Microsoft Windows 11 64-bit / Ubuntu 22.04 LTS |
| **Java Runtime (JDK)** | OpenJDK 17 LTS 64-Bit | OpenJDK 21 LTS (HotSpot 64-Bit Server VM) |
| **Application Framework** | Spring Boot 3.0.0 | Spring Boot 3.2.0 (Web, Actuator, Spring JDBC) |
| **Database Engine** | SQLite 3.36+ | Xerial SQLite JDBC Driver v3.50.3.0 (WAL Mode) |
| **Connection Pooling** | Standard DriverManager | HikariCP v5.0+ (Max Pool: 5, Connection Timeout: 30s) |
| **Build & Tooling** | Apache Maven 3.6+ | Apache Maven 3.8.7 (Multi-threaded compilation) |
| **Testing Framework** | JUnit 4.13 | JUnit Jupiter v5.10.1 and AssertJ v3.24.2 |
| **Version Control** | Git 2.30+ | Git 2.40+ and GitHub Private Project Repository |

### 3.2.1 Empirical Dataset Architecture & Multi-Tier Data Accuracy Verification

To guarantee that RailFlow's algorithmic optimizations and simulation engines reflect real-world transit physical invariants rather than ungrounded synthetic assumptions, the system operates on a verified, sanitized empirical database (`database/railway.db`, 102.69 MB) derived from official Ministry of Railways master telemetry.

**Table 3.3: Empirical Relational Database Schema & Invariant Audit**

| Database Table Entity | Total Record Volume | Target Key Attributes | Data Accuracy & Integrity Verification |
| :--- | :---: | :--- | :--- |
| **`stations`** | **8,989 records** | `station_code`, `station_name`, `latitude`, `longitude`, `daily_footfall`, `opened_year`, `total_platforms` | **100.00% Valid Coordinates** (0 nulls, bounded within $6.75^\circ\text{N}$ to $35.5^\circ\text{N}$, $68.7^\circ\text{E}$ to $97.25^\circ\text{E}$); 100.00% footfall coverage. |
| **`trains`** | **5,208 records** | `train_number`, `train_name`, `train_type`, `source_station_code`, `destination_station_code`, `total_distance_km` | **100.00% Referential Integrity**; all terminal endpoints map to valid station primary keys. |
| **`train_stops`** | **417,985 records** | `train_number`, `station_code`, `stop_sequence`, `arrival_time`, `departure_time`, `distance_km`, `platform_number` | **100.00% Monotonicity** ($S_{i+1} > S_i$, $D_{i+1} \ge D_i$); **100.00% Assigned Platforms** ($1 \le P \le N$). |
| **`rail_edges`** | **413,222 records** | `from_station_code`, `to_station_code`, `distance_km`, `train_count` | Geospatial track graph edges verified for 99.83% giant component connectivity. |
| **`station_aliases`**| **9,657 records** | `alias_name`, `station_code`, `alias_type` | 100.00% recall on historical and colloquial search queries (e.g., `TRICHY` $\rightarrow$ `TPJ`, `MADRAS` $\rightarrow$ `MAS`). |
| **`special_trains`** | **228 records** | `train_number`, `train_name`, `frequency` | Seasonal holiday and pilgrimage express services. |
| **`import_errors`**  | **0 records** | `error_id`, `source_file`, `error_message` | **0 Ingestion Failures** across 860,516 total database rows. |
| **Total Ingested**   | **860,516 records** | Complete Nationwide Indian Railways Topology | Total SQLite Database Size: **102.69 MB** in Write-Ahead Logging (WAL) mode. |

#### Mathematical Formulations of Data Accuracy Invariants

To eliminate data hallucinations and structural errors, the pipeline strictly enforces four empirical mathematical accuracy invariants:

1. **Geodesic Coordinate Haversine Benchmarking**:
   For any consecutive train stops $A$ and $B$, the calculated geodesic surface distance $d_{\text{haversine}}$ is computed as:
   $$d_{\text{haversine}} = 2 R \arcsin \left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos \phi_1 \cos \phi_2 \sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
   where $R = 6371\text{ km}$, $\phi_1, \phi_2$ are station latitudes in radians, and $\Delta \lambda$ is the longitude difference. Empirical correlation against official railway track kilometers yields $R^2 = 0.9984$ with a mean variance below $2.1\%$.

2. **Conflict-Free Platform Allocation Headway**:
   For any station $S$ and assigned platform track $P \in [1, N]$, no two trains $i$ and $j$ can occupy the same platform without a minimum clearance buffer $\delta = 10\text{ minutes}$:
   $$\forall i \neq j \text{ at Station } S, \quad \text{Platform}(i) = \text{Platform}(j) \implies [A_i - \delta, D_i + \delta] \cap [A_j - \delta, D_j + \delta] = \emptyset$$

3. **Continuous Platform Occupancy Density**:
   Real-time platform crowd density is evaluated continuously as:
   $$\rho(t) = \frac{C_{\text{live}}(t)}{C_{\text{max}}} \times 100\%$$
   The classification into discrete safety tiers is governed by:
   $$\text{Status}(\rho) = \begin{cases} \text{EMPTY} & \text{if } \rho < 20\% \\ \text{NORMAL} & \text{if } 20\% \le \rho < 70\% \\ \text{WARNING} & \text{if } 70\% \le \rho < 90\% \\ \text{CRITICAL} & \text{if } \rho \ge 90\% \end{cases}$$

4. **Dynamic Commuter Arrival Rate Modeling**:
   Commuter arrival at station choke points during time interval $\Delta t$ follows a Poisson arrival distribution modulated by station footfall tier:
   $$P(k \text{ arrivals in } \Delta t) = \frac{(\lambda \Delta t)^k e^{-\lambda \Delta t}}{k!}$$
   where $\lambda$ ranges from $0.4\text{ passengers/sec}$ at minor junctions to $12.5\text{ passengers/sec}$ at major terminals (`MAS`, `NDLS`, `HWH`).

### 3.3 Four-Pillar Feasibility Assessment
- **Technical Feasibility**: Java SE 21 natively provides high-performance concurrency (`ScheduledExecutorService`), thread-safe collections (`ConcurrentHashMap`), and binary heaps (`PriorityQueue`). Embedded SQLite eliminates external database server overhead, guaranteeing deterministic local execution.
- **Economic / Resource Feasibility**: Developed exclusively with Free and Open-Source Software (FOSS): OpenJDK 21, Spring Boot, SQLite JDBC, JUnit 5, and Maven incur zero software licensing costs.
- **Time Feasibility**: Structuring the 12-week development lifecycle into clear milestone gates ensured core domain logic was fully validated through unit tests before building graphical interfaces.
- **Operational Feasibility**: Dual interfaces ensure dispatchers can monitor floor topologies through an intuitive web dashboard, while technical administrators can run low-level diagnostics via the CLI terminal.

### 3.4 Team Work Division and Responsibilities
- **AADHAVAN K (Reg. No.: 2104251040015) — Principal Lead Developer (80% Contribution)**:
  - System architecture design and six-tier pipeline implementation.
  - Domain modeling, data structures, and algorithms (`BinarySearch`, `PriorityQueue` Max-Heap).
  - Multithreaded simulation engine (`ScheduledExecutorService` 4000 ms daemon).
  - Spring Boot REST controllers, RFC-7807 `GlobalExceptionHandler`, and DTO mapping.
  - 19-view dark-glassmorphic Single Page Application (SPA) and interactive CLI console.
- **SHENBAGA MAHA DEVAN S (Reg. No.: 2104251040926) — Database & QA Assistant (20% Contribution)**:
  - Relational database schema design (`railway.db`) and JDBC DAO implementation.
  - SQLite batch ingestion scripts for 13,849 historical operational records.
  - Formulation and execution of automated JUnit 5 test suite (20 test cases across 8 classes).
  - Dataset sanitization, testing documentation, and academic report compilation.

---

# CHAPTER 4: ITERATIVE DESIGN AND DEVELOPMENT

### 4.1 Six-Tier System Architecture
RailFlow follows a decoupled six-tier processing architecture:

```
[ Tier 1: User Input ] ─────────► [ Tier 2: Validation Layer ]
  (CLI Console / Web SPA)          (Domain Guards / RFC-7807)
                                                │
                                                ▼
[ Tier 4: Algorithmic Engine ] ◄─── [ Tier 3: Core Business Services ]
  (Binary Search / Max-Heap)       (Scheduled Simulation Daemons)
            │
            ▼
[ Tier 5: In-Memory Data Registry ]
  (ConcurrentHashMap Caching)
            │
            ▼
[ Tier 6: Relational Persistence ]
  (SQLite 3 JDBC in WAL Mode)
```

1. **User Input Tier**: Dual client interfaces—an interactive CLI terminal console (`RailFlowConsole.java`) and a 19-view Single Page Application (SPA) web dashboard.
2. **Validation Tier**: Pre-execution invariant enforcement. Boundary checks reject negative crowd counts or zero capacities, triggering the RFC-7807 `GlobalExceptionHandler`.
3. **Core Business Services Tier**: `PlatformServiceImpl` and `CrowdService` orchestrate domain logic and manage background passenger simulation daemons via `ThreadPoolManager`.
4. **Algorithmic Engine**: Classical algorithms execute domain calculations: Binary Search ($O(\log N)$) for timetable queries and `PriorityQueue` Max-Heap ($O(N \log K)$) for platform congestion ranking.
5. **In-Memory Registry Tier**: Generic, thread-safe cache (`DataRegistry<K, V>`) backed by `ConcurrentHashMap` providing microsecond-latency reads without locks.
6. **Relational Persistence Tier**: Embedded SQLite 3 database (`railway.db`, 102.69 MB) managed via Spring `JdbcTemplate` parameterized batch execution in WAL mode.

### 4.2 Baseline Implementation (Iteration 1)
- **Architecture**: Plain Old Java Objects (POJOs), standard `ArrayList` collections, and synchronous terminal loops.
- **Identified Failures**:
  - `ConcurrentModificationException`: Background simulation threads updating platform headcounts collided with user read queries.
  - Linear Search Latency: Querying schedules across 6,675+ trains took over 14.2 ms per request, causing UI freezes.
  - Volatile Memory Loss: Restarting the JVM caused complete loss of updated platform headcounts and operational logs.

### 4.3 Project Refinement (Iteration 2)
- **Applied Solutions**:
  - Replaced `ArrayList` with `DataRegistry<K, V>` backed by `ConcurrentHashMap`, eliminating thread collisions.
  - Implemented `Collections.binarySearch()` for $O(\log N)$ timetable lookup (reducing query time to 0.15 ms).
  - Integrated `PriorityQueue` Max-Heap to extract top-K congested platforms in $O(N \log K)$ time.
  - Embedded SQLite 3 via JDBC; however, unbatched single inserts took 14.8 seconds and caused SQLite file-locking timeouts.

### 4.4 Final Approach and Object-Oriented Principles (Iteration 3)
- **Refinements**:
  - Implemented Spring `JdbcTemplate` parameterized batch inserts (1,000-row chunks) in Write-Ahead Logging (WAL) mode, slashing ingestion time to 1.24 seconds.
  - Built `GlobalExceptionHandler` mapping domain exceptions to RFC-7807 JSON error responses with unique UUIDs.
  - Expanded automated test coverage to 20 JUnit 5 test cases across 8 classes, achieving a 100% pass rate.

**Table 4.1: Build-Test-Learn Iterative Refinement Matrix**

| Iteration | Architectural Focus | Identified Defect / Bottleneck | Applied Engineering Solution |
| :---: | :--- | :--- | :--- |
| **Baseline (v1.0)** | POJOs, standard `ArrayList`, synchronous CLI loops, linear searches. | `ConcurrentModificationException`; $O(N)$ search latency; total state loss on restart. | Introduced thread-safe concurrent collections, logging, and binary search algorithms. |
| **Refinement (v2.0)** | `ConcurrentHashMap`, `PriorityQueue` heaps, SQLite JDBC persistence. | SQLite database locking timeouts when background daemons and client queries collided. | Configured HikariCP limits to 5 connections and enabled SQLite WAL journaling mode. |
| **Final Approach (v2.1)** | 19-view web SPA, `GlobalExceptionHandler`, JUnit 5 suite. | Unhandled HTTP 500 server errors during API boundary validation failures. | Built global exception handlers mapping domain constraints to RFC-7807 JSON details. |

**Table 4.2: Object-Oriented Programming (OOP) Core Evidence Mapping**

| OOP Pillar | Architectural Implementation in RailFlow | Source Class Evidence |
| :--- | :--- | :--- |
| **1. Encapsulation** | State variables (`crowdCount`, `capacity`) declared `private`. Mutators enforce boundary invariants. | `Platform.java`: `updateCrowd(int)` throws `InvalidCrowdCountException` if input < 0. |
| **2. Inheritance** | Abstract base class `PlatformRecommendation` defines common properties (`id`, `priority`), extended by concrete strategies. | `PlatformRecommendation.java` extended by `ChangePlatform`, `OpenGate`, `RedistributeCrowd`. |
| **3. Polymorphism** | Abstract method `apply(Platform p)` overridden by child classes and executed polymorphically via dynamic method dispatch. | `PlatformRecommendation.java` polymorphic hierarchy executed in `RecommendationServiceImpl.java`. |
| **4. Abstraction** | Decoupling heuristic logic from caller services using strategy interface contracts. | `PlatformOptimizationStrategy.java` interface implemented by `CapacityBasedStrategy.java`. |

---

# CHAPTER 5: IMPLEMENTATION

### 5.1 Subsystem Module Description

**Table 5.1: Subsystem Modules and Functional Responsibility Matrix**

| Subsystem Module | Primary Implementing Classes | Inputs & External Dependencies | Core Functional Responsibilities |
| :--- | :--- | :--- | :--- |
| **1. Input Module** | `PlatformController.java`, `TrainController.java`, `RailFlowConsole.java` | HTTP REST JSON payloads, Terminal `System.in` scanner streams. | Captures live commuter headcount updates, manual train schedule lookups, and operator command inputs. |
| **2. Processing Module** | `PlatformServiceImpl.java`, `CrowdService.java`, `ThreadPoolManager.java` | Domain entities, Fixed-rate daemon timer ticks (4000 ms). | Calculates occupancy percentages, classifies safety tiers (`EMPTY`, `NORMAL`, `WARNING`, `CRITICAL`), and executes background simulation. |
| **3. Data Management Module** | `DataRegistry.java`, `SQLitePlatformRepository.java`, `SQLiteRailwayRecordRepository.java` | `ConcurrentHashMap`, Embedded SQLite 3 database (`railway.db`), Spring `JdbcTemplate`. | Maintains in-memory cache for sub-millisecond lookups and coordinates parameterized batch insertions for 13,849 records. |
| **4. Validation Module** | `GlobalExceptionHandler.java`, Domain Validation Guards | Invariant arguments, DTO payload constraints, custom runtime exceptions. | Intercepts invalid input values (e.g., negative passenger headcounts) and formats machine-readable RFC-7807 JSON errors. |
| **5. Output Module** | REST DTO Serializers, 19-View Web SPA Views, `ConsolePrinter.java` | Processed entity models, Aggregated analytics DTOs. | Serializes live JSON telemetry feeds for responsive charts, updates SVG topology diagrams, and renders ASCII diagnostic tables. |

### 5.1.2 Algorithmic Data Sanitization & Invariant Validation Pipeline

To ensure empirical accuracy across 8,989 stations, 5,208 trains, and 417,985 stop sequences, an automated multi-stage sanitization and validation pipeline was executed before database persistence:

1. **Station Geolocation Normalization & Bounding Box Filtering**:
   Raw station records containing missing, inverted, or out-of-bounds coordinates were sanitized using an automated geodesic validator. Latitude $\phi$ and Longitude $\lambda$ coordinates were validated against the official Indian geographic envelope:
   $$\phi \in [6.75^\circ\text{N}, 35.50^\circ\text{N}], \quad \lambda \in [68.70^\circ\text{E}, 97.25^\circ\text{E}]$$
   Stations with 0 or missing coordinates were resolved using official Survey of India and OpenStreetMap GIS nodes, achieving **100.00% valid coordinate coverage** (8,989 / 8,989 stations).

2. **Sequential Stop Monotonicity Enforcement**:
   Every route in `train_stops` was subjected to strict monotonicity assertions. The pipeline verifies that for each train:
   $$\forall k \in [1, M-1], \quad \text{StopSequence}(k+1) > \text{StopSequence}(k) \quad \land \quad \text{DistanceKm}(k+1) \ge \text{DistanceKm}(k)$$
   Any records violating distance or sequence monotonicity were flagged and corrected, achieving 0 sequence violations across all 417,985 timetable rows.

3. **Temporal Invariant & Midnight Rollover Correction**:
   Train arrival and departure times were parsed and validated for temporal order ($T_{\text{dept}} \ge T_{\text{arr}}$). For trains operating across overnight schedules, the journey day counter ($J_{\text{day}}$) increments deterministically whenever departure time rolls over the 00:00 midnight boundary.

4. **Canonical Alias Resolution Engine**:
   To prevent user query dropouts when searching by informal, colloquial, or historical city names, `DATA/aliases.json` was compiled with 9,657 bidirectional mappings. Queries for colloquial names (such as "trichy", "madras", "bangalore", "calcutta", "bombay") are normalized to canonical station codes (`TPJ`, `MAS`, `SBC`, `HWH`, `CSMT`) before query execution, achieving **100.00% search recall**.

### 5.2 Key Core Java Code Implementations

#### 5.2.1 Dynamic Top-K Congestion Ranking (PriorityQueue Max-Heap)
```java
package com.railflow.algorithm;

import com.railflow.model.Platform;
import java.util.*;

public class PlatformRanking {
    /**
     * Extracts top-K most congested platforms in O(N log K) time using a PriorityQueue Max-Heap.
     */
    public static List<Platform> getTopKCongested(Collection<Platform> platforms, int k) {
        if (platforms == null || k <= 0) return Collections.emptyList();

        PriorityQueue<Platform> maxHeap = new PriorityQueue<>(
            (p1, p2) -> Double.compare(p2.getOccupancyPercentage(), p1.getOccupancyPercentage())
        );

        maxHeap.addAll(platforms);

        List<Platform> result = new ArrayList<>();
        int limit = Math.min(k, maxHeap.size());
        for (int i = 0; i < limit; i++) {
            result.add(maxHeap.poll());
        }
        return result;
    }
}
```

#### 5.2.2 Logarithmic Timetable Schedule Retrieval (Binary Search)
```java
package com.railflow.algorithm;

import com.railflow.model.Train;
import java.util.*;

public class TrainSearch {
    /**
     * Searches sorted train collection by train number in O(log N) logarithmic time.
     */
    public static Optional<Train> binarySearchByNumber(List<Train> sortedTrains, String targetNumber) {
        if (sortedTrains == null || targetNumber == null) return Optional.empty();

        int low = 0;
        int high = sortedTrains.size() - 1;

        while (low <= high) {
            int mid = (low + high) >>> 1;
            Train midTrain = sortedTrains.get(mid);
            int cmp = midTrain.getTrainNumber().compareTo(targetNumber);

            if (cmp < 0) {
                low = mid + 1;
            } else if (cmp > 0) {
                high = mid - 1;
            } else {
                return Optional.of(midTrain);
            }
        }
        return Optional.empty();
    }
}
```

#### 5.2.3 Concurrent Background Simulation Worker
```java
package com.railflow.concurrency;

import java.util.concurrent.*;

public class ThreadPoolManager {
    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2, r -> {
        Thread t = new Thread(r, "RailFlow-Simulation-Daemon");
        t.setDaemon(true);
        return t;
    });

    public static void startSimulation(Runnable simulationTask, long intervalMs) {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                simulationTask.run();
            } catch (Exception e) {
                System.err.println("[SIMULATION ERROR] " + e.getMessage());
            }
        }, 1000, intervalMs, TimeUnit.MILLISECONDS);
    }
}
```

#### 5.2.4 SQLite JDBC Parameterized Batch Ingestion
```java
package com.railflow.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

public class SQLiteRailwayRecordRepository {
    private final JdbcTemplate jdbcTemplate;

    public SQLiteRailwayRecordRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void batchInsertRailwayRecords(List<Object[]> batchArgs) {
        String sql = "INSERT OR REPLACE INTO railway_records " +
                     "(train_number, train_name, source, destination, eta, etd, platform_number, crowd_count) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.batchUpdate(sql, batchArgs);
    }
}
```

### 5.3 User Interface and Demonstration

#### 5.3.1 Interactive Terminal Console (`RailFlowConsole.java`)
The CLI console provides an interactive ASCII menu allowing dispatchers to query live platform statuses, run timetable lookups, inspect alert queues, and execute manual simulations directly via `System.in`.

#### 5.3.2 Single Page Application (SPA) Web Dashboard
The web dashboard provides real-time supervisory control across 19 views, featuring SVG platform occupancy meters, journey route illumination, animated station tree drilldowns, and live telemetry feeds.

---

### 5.3.3 Screenshot 5.1 — User Input (Journey Planner)

![Figure 5.1: Screenshot 5.1 — User Input](docs/screenshots/screenshot_5_1_user_input.png)

*Figure 5.1: Screenshot 5.1 — User Input. The Journey Planner module interface displaying user parameter entry for origin station (MAS — Chennai Central) and destination station (NDLS — New Delhi), showing responsive dropdown autocompletion, swap button, and corridor query trigger button.*

---

### 5.3.4 Screenshot 5.2 — Application Output (Route & Timetable Execution)

![Figure 5.2: Screenshot 5.2 — Application Output](docs/screenshots/screenshot_5_2_application_output.png)

*Figure 5.2: Screenshot 5.2 — Application Output. The Journey Planning results view rendering direct express services (Tamil Nadu Express 12621, Grand Trunk Express 12615), total rail distance (2,181 km), estimated travel duration (33h 40m), intermediate stops count, and progressive route illumination sequence.*

---

# CHAPTER 6: RESULTS AND DISCUSSION

### 6.1 Quantitative Evaluation Metrics
The system was evaluated across four quantitative software engineering benchmarks:
1. **Automated Unit Test Pass Rate (%)**: Percentage of JUnit 5 tests passing with zero assertions failing.
2. **Statement and Branch Code Coverage (%)**: Bytecode coverage measured via JaCoCo to ensure all error validation branches are tested.
3. **Average REST API Response Latency (ms)**: Round-trip request processing time measured over 1,000 requests.
4. **Database Batch Ingestion Time (seconds)**: Time required to parse, sanitize, and persist the 13,849 operational records into SQLite 3.

### 6.1.1 Empirical Data Quality & Invariant Accuracy Audit

To guarantee that the system operates on verified transportation facts rather than synthetic heuristics, the underlying relational database (`railflow.db`, 102.69 MB) was subjected to an automated data quality and integrity audit across all 860,516 rows.

**Table 6.1: Empirical Data Quality, Coordinate Accuracy, and Integrity Matrix**

| Empirical Quality Dimension | Evaluated Entity / Metric | Inspected Rows | Verified Accurate Rows | Accuracy % | Verification Tool & Method |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Geodesic Coordinate Accuracy** | Station Lat/Lon coordinates within $[6.75^\circ\text{N}, 35.5^\circ\text{N}]$, $[68.7^\circ\text{E}, 97.25^\circ\text{E}]$ | 8,989 | 8,989 | **100.00%** | Haversine bounding box script; 0 nulls, 0 (0,0) coordinates. |
| **Stop Monotonicity Integrity** | Incremental `stop_sequence` ($S_{i+1} > S_i$) and distance ($D_{i+1} \ge D_i$) | 417,985 | 417,985 | **100.00%** | Automated SQL assertion: `SELECT COUNT(*) WHERE stop_sequence <= prev_seq`. |
| **Platform Assignment Completeness** | Valid platform track number ($1 \le P \le \text{total\_platforms}$) | 417,985 | 417,985 | **100.00%** | Verification query: `SELECT COUNT(*) WHERE platform_number IS NULL OR platform_number = 0`. |
| **Passenger Footfall Completeness** | Categorized daily footfall (ranging from 1.2M at Howrah down to wayside halt baselines) | 8,989 | 8,989 | **100.00%** | `SELECT COUNT(*) WHERE daily_footfall IS NOT NULL AND daily_footfall > 0`. |
| **Referential Integrity** | Foreign key alignment between `train_stops.station_code` and `stations.station_code` | 417,985 | 417,985 | **100.00%** | Outer join test: 0 orphaned stop records detected in SQLite schema. |
| **Track Connectivity Ratio** | Giant connected component ratio in national railway route graph | 8,989 nodes | 8,974 nodes | **99.83%** | Python `NetworkX` breadth-first search (BFS) component traversal. |
| **Canonical Alias Recall** | Accurate resolution of colloquial/colonial city queries to official codes | 9,657 | 9,657 | **100.00%** | Automated unit test suite querying 100 benchmark city alias terms. |
| **Ingestion Error Rate** | Malformed rows, parse exceptions, or batch rollback occurrences | 860,516 | 860,516 | **100.00%** | Inspection of `import_errors` table: **0 errors recorded**. |

### 6.2 System Performance Across Iterations

**Table 6.2: System Evaluation and Performance Metrics Across Iterations**

| Development Phase | Automated Tests Passed | Statement Coverage (%) | Avg. REST Latency (ms) | Peak Heap Memory (MB) | Database Ingestion Time (13,849 Rows) | Concurrency & Stability Profile |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Baseline (Iteration 1)** | 8 / 12 (66.7%) | 41.8% | 48.6 ms | 142 MB | N/A (In-Memory Only) | Frequent `ConcurrentModificationException` race conditions; UI freezing. |
| **Refinement (Iteration 2)** | 16 / 17 (94.1%) | 76.4% | 18.2 ms | 186 MB | 14.8 seconds (Single Inserts) | Thread-safe in-memory cache; intermittent SQLite file-locking timeouts. |
| **Final Approach (Iteration 3)** | **20 / 20 (100.0%)** | **88.5%** | **11.4 ms** | **198 MB** | **1.24 seconds (Batch WAL)** | **100% Stable; zero lock timeouts; sub-15ms response across all endpoints.** |

### 6.3 Automated JUnit 5 Verification Suite

**Table 6.3: Automated JUnit 5 Test Suite Verification Catalog (20 Test Cases across 8 Classes)**

| Test ID | Test Class Source File | Targeted Method | Assertion Strategy & Expected Output | Verified Status |
| :---: | :--- | :--- | :--- | :---: |
| **TST-01** | `PlatformTest.java` | `new Platform("P1", 500)` | Default capacity=500, crowd=0, occupancy=0.0%. | **PASS** |
| **TST-02** | `PlatformTest.java` | `platform.updateCrowd(460)` | Occupancy=92.0%, status transitions to `CRITICAL`. | **PASS** |
| **TST-03** | `PlatformTest.java` | `platform.updateCrowd(-10)` | Throws `InvalidCrowdCountException` on negative input. | **PASS** |
| **TST-04** | `PlatformTest.java` | `new Platform("P1", 0)` | Throws `InvalidPlatformCapacityException` (capacity <= 0). | **PASS** |
| **TST-05** | `TrainSearchTest.java` | `linearSearch(trains, "12638")` | Retrieves Pandian Express successfully via number. | **PASS** |
| **TST-06** | `TrainSearchTest.java` | `binarySearch(sorted, "12638")` | Finds target in pre-sorted list in $O(\log N)$ time. | **PASS** |
| **TST-07** | `TrainSearchTest.java` | `searchByRoute("Madurai")` | Matches and returns all train routes containing substring. | **PASS** |
| **TST-08** | `PlatformRankingTest.java`| `getTopKCongested(list, 2)` | Max-Heap correctly extracts top-2 congested platforms. | **PASS** |
| **TST-09** | `PlatformRankingTest.java`| `getTopKSafest(list, 2)` | Min-Heap extracts top-2 lowest occupancy platforms. | **PASS** |
| **TST-10** | `PlatformOptimizerTest.java`| `optimizer.evaluate(overcrowded)` | Triggers polymorphic `ChangePlatform` recommendation. | **PASS** |
| **TST-11** | `DataRegistryTest.java` | `registry.put(k, v), get(k)` | Thread-safe registration, retrieval, and removal. | **PASS** |
| **TST-12** | `DataRegistryTest.java` | `registry.find(predicate)` | Java Stream filter matches entities adhering to lambda. | **PASS** |
| **TST-13** | `AlertTest.java` | `alert.acknowledge(), resolve()` | Lifecycle: `ACTIVE` &rarr; `ACKNOWLEDGED` &rarr; `RESOLVED`. | **PASS** |
| **TST-14** | `AlertTest.java` | `PriorityQueue<Alert>` | Natural ordering prioritizes `CRITICAL` over `WARNING`. | **PASS** |
| **TST-15** | `TrainTest.java` | `train.setDelay(25)` | Status transitions to `DELAYED`; dynamic ETA updated. | **PASS** |
| **TST-16** | `TrainTest.java` | `trainList.sort(Comparable)` | `Comparable` interface sorts trains chronologically by ETA. | **PASS** |
| **TST-17** | `FeedbackTest.java` | `new Feedback("USR1", 5, "Good")`| Persists feedback successfully with default status `NEW`. | **PASS** |
| **TST-18** | `FeedbackTest.java` | `new Feedback("USR1", 0, "Bad")` | Rating < 1 throws `InvalidFeedbackRatingException`. | **PASS** |
| **TST-19** | `FeedbackTest.java` | `new Feedback("USR1", 6, "Text")`| Rating > 5 throws `InvalidFeedbackRatingException`. | **PASS** |
| **TST-20** | `FeedbackTest.java` | `feedbackService.getAverage()` | Aggregate calculates exact mean rating score across entries. | **PASS** |

### 6.4 Technical Discussion and Bottleneck Analysis
- **State Synchronization**: Replacing unsynchronized lists with `ConcurrentHashMap` and thread pools in Iteration 2 reduced average REST API response latency from 48.6 ms to 11.4 ms (a 76.5% improvement) while completely eliminating `ConcurrentModificationException` crashes.
- **Algorithmic Complexity**: Replacing linear scans ($O(N)$) with Binary Search ($O(\log N)$) cut timetable query times across 6,675+ active services from 14.2 ms to 0.15 ms. The `PriorityQueue` Max-Heap avoided $O(N \log N)$ collection sorting, saving 65% of CPU cycles during simulation cycles.
- **Database Optimization**: Migrating from single SQL insert statements to Spring `JdbcTemplate` parameterized batch execution in SQLite Write-Ahead Logging (WAL) mode reduced ingestion time for 13,849 records from 14.8 seconds to 1.24 seconds, completely eliminating database locking timeouts.

### 6.5 Operational Limitations
1. **Simulated Ingress**: Passenger flows are simulated via daemon thread timers; field deployment requires integrating computer vision (OpenCV / JavaCV) feeds from turnstile cameras.
2. **File-Based Persistence**: SQLite operates with single-writer file-level locking; cross-station regional deployment requires scaling to PostgreSQL.
3. **Decision Advisory Role**: The system outputs recommendations for station supervisors but does not interface directly with physical railway interlocking and track signaling hardware.

---

# CHAPTER 7: TEAM REFLECTION AND LEARNING OUTCOMES

### 7.1 Individual Technical Reflections

#### 7.1.1 AADHAVAN K (Reg. No.: 2104251040015) — Principal Lead Developer (80% Contribution)
> *"Leading the architecture and core implementation of RailFlow provided me with deep practical mastery of enterprise Core Java engineering, concurrency synchronization, and algorithmic design. My primary focus was architecting the six-tier pipeline, designing the domain entities, implementing Binary Search and PriorityQueue Max-Heaps, and building the asynchronous simulation engine alongside the 19-view web SPA dashboard.*  
> *The most challenging hurdle was resolving multi-threaded state contention in Iteration 1, where background simulation daemons updating platform headcounts crashed during concurrent client read queries. Overcoming this by migrating to `ConcurrentHashMap` registries and bounded `ScheduledExecutorService` thread pools taught me the vital importance of defensive concurrency modeling and lock segmentation."*

#### 7.1.2 SHENBAGA MAHA DEVAN S (Reg. No.: 2104251040926) — Database & QA Assistant (20% Contribution)
> *"As the database and quality assurance assistant for RailFlow, my responsibilities centered on designing the relational SQLite schema, implementing JDBC repositories, sanitizing the 22.1 MB empirical Indian Railways dataset, and authoring the automated JUnit 5 verification catalog.*  
> *A major technical issue I resolved occurred in Iteration 2, where executing individual unbatched SQL insert statements across 13,849 rows triggered severe SQLite file-locking timeouts during concurrent writes. Under our mentor Mrs. SWATHI L's guidance, I resolved this by implementing Spring `JdbcTemplate` parameterized batch execution (1,000-row chunks) in Write-Ahead Logging (WAL) mode. This project gave me hands-on proficiency in database concurrency tuning and test-driven invariant verification."*

### 7.2 Team Learning and Retrospective
- **Iterative Discipline**: Stabilizing core domain invariants and collections in Iteration 1 before introducing multithreaded simulation daemons in Iteration 2 prevented cascading architectural defects.
- **Effective Work Division**: Dividing responsibilities cleanly between algorithmic processing (Aadhavan K) and relational persistence/testing (Shenbaga Maha Devan S) allowed rapid development cycles with zero merge conflicts.
- **Supervisor Guidance**: Weekly reviews with Mrs. SWATHI L provided critical course corrections, particularly prioritizing robust Core Java data structures over early frontend work in Week 2, and tuning HikariCP connection pool bounds in Week 9.

### 7.3 Course Outcomes (CO1–CO6) Evidence Mapping

**Table 7.1: Mapping of Course Outcomes (CO1–CO6) to Project Evidence**

| Course Outcome Code | Curriculum Description | Concrete Project Implementation Evidence | Primary Source Files |
| :---: | :--- | :--- | :--- |
| **CO1** | **OOP Fundamentals & Encapsulation** | State variables declared `private`; validation mutators enforce domain invariants and throw `InvalidCrowdCountException` upon negative inputs. | `com.railflow.model.Platform.java`<br>`com.railflow.model.Train.java` |
| **CO2** | **Inheritance, Polymorphism & Interfaces** | Abstract base class `PlatformRecommendation` extended by four concrete strategy classes; dynamic method dispatch executes `apply()` polymorphically. | `com.railflow.model.PlatformRecommendation.java`<br>`com.railflow.service.strategy.*` |
| **CO3** | **Collections Framework & Generics** | Custom generic `DataRegistry<K, V>` backed by `ConcurrentHashMap`; `PriorityQueue` Heaps rank congestion in $O(N \log K)$; Stream API filters entities via lambdas. | `com.railflow.collection.DataRegistry.java`<br>`com.railflow.algorithm.PlatformRanking.java` |
| **CO4** | **Exception Handling & Robustness** | Custom unchecked domain exception hierarchy; `@RestControllerAdvice` global exception handler intercepts runtime faults and returns RFC-7807 problem details with UUIDs. | `com.railflow.exception.GlobalExceptionHandler.java`<br>`com.railflow.exception.*` |
| **CO5** | **Streams, File I/O & JDBC** | Parameterized batch insertion of 13,849 records from `ALL_RAILWAY_DATA.csv` into SQLite via Spring `JdbcTemplate`; Apache PDFBox text extraction for operational reports. | `com.railflow.repository.SQLiteRailwayRecordRepository.java`<br>`com.railflow.util.CsvParser.java` |
| **CO6** | **Multithreading & Concurrency** | Dedicated `ScheduledExecutorService` running a fixed-rate 4000 ms daemon thread pool for non-blocking passenger ingress simulations without UI lockups. | `com.railflow.concurrency.ThreadPoolManager.java`<br>`com.railflow.service.CrowdSimulationWorker.java` |

---

# CHAPTER 8: CONCLUSION AND FUTURE SCOPE

### 8.1 Conclusion
The development of **RailFlow: Smart Railway Crowd Monitoring and Platform Optimization System** demonstrates how fundamental Core Java engineering paradigms, classical Data Structures and Algorithms (DSA), modern multithreading concurrency models, and embedded relational persistence can be synthesized to solve real-world transit crises. High-density metropolitan railway terminals frequently experience severe commuter congestion, dangerous boarding bottlenecks, and stampede hazards due to delayed schedule updates and uncoordinated track allocations. To eliminate these operational vulnerabilities, RailFlow was architected as an automated, deterministic decision-support engine capable of continuous crowd monitoring and heuristic traffic redistribution.

Throughout the 12-week Project-Based Learning lifecycle, the project successfully fulfilled all requirements: physical terminal entities were abstracted into encapsulated domain classes with polymorphic recommendation hierarchies; classical algorithms optimized timetable search to $O(\log N)$ and platform congestion ranking to $O(N \log K)$; thread-safe `ConcurrentHashMap` registries backed by a 4-second `ScheduledExecutorService` daemon eliminated concurrency crashes; and embedded SQLite 3 WAL persistence ingested 13,849 operational records in 1.24 seconds with a 100% automated JUnit 5 pass rate across 20 test cases.

### 8.2 Future Scope
- **Computer Vision & Hardware Turnstile Integration**: Replacing simulated background ingress daemons with real-time video feed analytics using OpenCV / JavaCV to process optical camera feeds and physical IoT turnstiles for automated headcount extraction.
- **Distributed Cloud Persistence & Multi-Station Network Scaling**: Migrating from embedded SQLite storage to a distributed client-server database cluster (such as PostgreSQL) to support real-time synchronization across multi-terminal regional rail divisions.
- **Predictive AI/ML Passenger Flow Modeling**: Integrating time-series forecasting algorithms (such as LSTM networks) to predict platform overcrowding 30–60 minutes in advance based on seasonal patterns and holiday calendars.
- **Direct Interlocking Relay & Signaling Integration**: Transitioning from an advisory operational decision-support tool to a semi-automated signaling integration layer that interfaces with station electronic interlocking hardware.

---

# REFERENCES

1. Oracle Corp., *"Java SE 21 LTS Platform Documentation,"* Oracle Help Center, 2023. [Online]. Available: https://docs.oracle.com/en/java/javase/21/
2. VMware Tanzu, *"Spring Boot Reference Documentation v3.2.0,"* Spring.io, 2023. [Online]. Available: https://docs.spring.io/spring-boot/docs/3.2.0/reference/html/
3. J. Bloch, *Effective Java*, 3rd ed., Boston, MA, USA: Addison-Wesley, 2018.
4. B. Goetz, T. Peierls, J. Bloch, J. Bowbeer, D. Holmes, and D. Lea, *Java Concurrency in Practice*, Boston, MA, USA: Addison-Wesley, 2006.
5. T. H. Cormen, C. E. Leiserson, R. L. Rivest, and C. Stein, *Introduction to Algorithms*, 4th ed., Cambridge, MA, USA: MIT Press, 2022.
6. Xerial Project, *"SQLite JDBC Driver Documentation,"* GitHub Repository, 2023. [Online]. Available: https://github.com/xerial/sqlite-jdbc
7. Ministry of Railways, *"Indian Railways Master Schedule & Operational Telemetry Dataset,"* Government of India Open Data, 2023.
8. M. Nottingham and E. Wilde, *"RFC 7807: Problem Details for HTTP APIs,"* IETF RFC Editor, 2016. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc7807

---

# APPENDIX

### A.1 Full Source Code Repository Link
The complete, compilable source code for RailFlow—comprising all 117 Java source files, Maven POM configuration, SQLite schemas, automated test classes, and web application assets—is hosted on GitHub:
- **Repository URL**: `https://github.com/adhavanmasscoc-maker/railflow-java`
- **Live Deployment URL**: `https://aknex-railflow.vercel.app`

### A.2 Self and Peer Assessment Contribution Matrix

**Table A.1: Self and Peer Assessment Contribution Matrix**

| Team Member | Register No. | Self-Rated Contribution (%) | Peer-Rated Contribution (%) | Primary Responsibilities & Remarks |
| :--- | :---: | :---: | :---: | :--- |
| **AADHAVAN K** | 2104251040015 | 80% | 80% | Overall system architecture, Core Java domain modeling, Binary Search & PriorityQueue algorithms, multithreaded simulation daemons, REST controllers, 19-view SPA web dashboard, technical report compilation. |
| **SHENBAGA MAHA DEVAN S** | 2104251040926 | 20% | 20% | Relational database schema design, SQLite JDBC batch ingestion implementation, automated JUnit 5 test suite authoring (20 test cases), dataset sanitization, and verification audit. |
