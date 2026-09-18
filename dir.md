# RailFlow Directory Structure (`dir.md`)

> **Root Path**: `D:\CS-ML-JAVA\JAVA\RailwaySystem`  
> **Project**: RailFlow — Modern Railway Management, Crowd Optimization & Simulation Platform  
> **Generated**: September 18, 2026  

---

## Table of Contents
1. [Overview & Summary](#overview--summary)
2. [Hierarchical Directory Tree](#hierarchical-directory-tree)
3. [All Directories by Relative Path](#all-directories-by-relative-path)
4. [Component & Module Breakdown](#component--module-breakdown)
   - [Java Application Source (`src/`)](#1-java-application-source-src)
   - [Node.js & Express Backend (`backend/`)](#2-nodejs--express-backend-backend)
   - [Datasets & Database (`DATA/`, `database/`)](#3-datasets--database-data-database)
   - [Web Frontend & Static UI (`frontend/`, `css/`, `js/`, `images/`)](#4-web-frontend--static-ui)
   - [Documentation (`docs/`)](#5-documentation-docs)
   - [Scripts & Automation (`scripts/`, `python_backend/`, `scratch/`)](#6-scripts--automation)
   - [Serverless Endpoints (`api/`)](#7-serverless-endpoints-api)
   - [Deployment & Version Control (`deploy/`, `git/`, `.vercel/`, `.git/`)](#8-deployment--version-control)
   - [IDE & Build Outputs (`target/`, `bin/`, `.vscode/`, `.gemini/`)](#9-ide--build-outputs)

---

## Overview & Summary

| Metric | Details |
| :--- | :--- |
| **Root Location** | `D:\CS-ML-JAVA\JAVA\RailwaySystem` |
| **Primary Technology** | Java 17+ (Spring Boot / Standalone Architecture) |
| **Secondary Technology** | Node.js (Express), Python (Graph & Optimization), Vanilla JS / CSS |
| **Database Engines** | SQLite (`railway.db`), JSON Master Catalogs, In-Memory Graph Model |
| **Primary Top-Level Folders** | 22 directories |

---

## Hierarchical Directory Tree

```
D:\CS-ML-JAVA\JAVA\RailwaySystem
├── .gemini/
├── .git/
├── .vercel/
├── .vscode/
├── DATA/
│   └── trains/
├── api/
├── backend/
│   ├── database/
│   ├── node_modules/
│   └── src/
│       ├── providers/
│       │   └── pnr/
│       ├── repositories/
│       ├── routes/
│       └── services/
├── bin/
│   ├── com/
│   │   └── railflow/
│   │       ├── algorithm/
│   │       ├── cli/
│   │       ├── collection/
│   │       ├── dto/
│   │       ├── enums/
│   │       ├── exception/
│   │       ├── io/
│   │       ├── model/
│   │       ├── repository/
│   │       └── service/
│   ├── jakarta/
│   │   └── validation/
│   │       └── constraints/
│   └── org/
│       └── springframework/
│           ├── beans/
│           │   └── factory/
│           │       └── annotation/
│           └── stereotype/
├── css/
├── database/
├── deploy/
│   ├── .vercel/
│   ├── DATA/
│   │   └── trains/
│   ├── api/
│   ├── backend/
│   │   ├── database/
│   │   └── src/
│   │       ├── providers/
│   │       │   └── pnr/
│   │       ├── repositories/
│   │       ├── routes/
│   │       └── services/
│   ├── css/
│   ├── docs/
│   │   ├── algorithms/
│   │   ├── api/
│   │   ├── architecture/
│   │   ├── java-concepts/
│   │   └── screenshots/
│   ├── frontend/
│   │   ├── css/
│   │   └── js/
│   │       └── data/
│   └── js/
│       └── data/
├── docs/
│   ├── algorithms/
│   ├── api/
│   ├── architecture/
│   ├── java-concepts/
│   └── screenshots/
├── frontend/
│   ├── css/
│   └── js/
│       └── data/
├── git/
│   ├── DATA/
│   │   └── trains/
│   ├── api/
│   ├── backend/
│   │   ├── database/
│   │   └── src/
│   │       ├── providers/
│   │       │   └── pnr/
│   │       ├── repositories/
│   │       ├── routes/
│   │       └── services/
│   ├── css/
│   ├── docs/
│   │   ├── algorithms/
│   │   ├── api/
│   │   ├── architecture/
│   │   ├── java-concepts/
│   │   └── screenshots/
│   ├── frontend/
│   │   ├── css/
│   │   └── js/
│   │       └── data/
│   ├── js/
│   │   └── data/
│   ├── scripts/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   │       └── java/
│   └── tests/
├── images/
├── js/
│   └── data/
├── python_backend/
├── scratch/
├── scripts/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── com/
│   │   │   │   └── railflow/
│   │   │   │       ├── algorithm/
│   │   │   │       ├── cli/
│   │   │   │       ├── collection/
│   │   │   │       ├── concurrency/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dao/
│   │   │   │       ├── database/
│   │   │   │       ├── dto/
│   │   │   │       ├── enums/
│   │   │   │       ├── exception/
│   │   │   │       ├── ingestion/
│   │   │   │       ├── io/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       │   └── jdbc/
│   │   │   │       ├── service/
│   │   │   │       └── util/
│   │   │   ├── jakarta/
│   │   │   │   └── validation/
│   │   │   │       └── constraints/
│   │   │   └── org/
│   │   │       └── springframework/
│   │   │           ├── beans/
│   │   │           │   └── factory/
│   │   │           │       └── annotation/
│   │   │           └── stereotype/
│   │   └── resources/
│   │       └── static/
│   │           ├── css/
│   │           └── js/
│   │               └── data/
│   └── test/
│       └── java/
│           └── com/
│               └── railflow/
├── target/
│   ├── classes/
│   │   ├── com/
│   │   │   └── railflow/
│   │   ├── jakarta/
│   │   │   └── validation/
│   │   ├── org/
│   │   │   └── springframework/
│   │   └── static/
│   │       ├── css/
│   │       └── js/
│   ├── generated-sources/
│   │   └── annotations/
│   ├── generated-test-sources/
│   ├── maven-status/
│   ├── surefire-reports/
│   └── test-classes/
│       └── com/
│           └── railflow/
└── tests/
```

---

## All Directories by Relative Path

| # | Relative Directory Path | Category / Purpose |
| :---: | :--- | :--- |
| 1 | `.gemini` | Gemini / Antigravity IDE configuration |
| 2 | `.git` | Git repository version tracking metadata |
| 3 | `.vercel` | Vercel serverless deployment runtime metadata |
| 4 | `.vscode` | Visual Studio Code workspace settings |
| 5 | `DATA` | Core dataset files (JSON catalogs, DB, geo data) |
| 6 | `DATA/trains` | Granular train route JSON files |
| 7 | `api` | Serverless API handlers (`ask-railflow-ai.js`, `atlas-proxy.js`) |
| 8 | `backend` | Node.js Express backend service |
| 9 | `backend/database` | Backend SQLite database files & schema |
| 10 | `backend/node_modules` | Node.js runtime package dependencies |
| 11 | `backend/src` | Backend application source directory |
| 12 | `backend/src/providers` | Provider interface layer |
| 13 | `backend/src/providers/pnr` | PNR providers (Mock, Official, Normalizer) |
| 14 | `backend/src/repositories` | Data access layer repositories |
| 15 | `backend/src/routes` | Express REST API endpoints |
| 16 | `backend/src/services` | Backend business services (PNR, etc.) |
| 17 | `bin` | IDE / javac compiled bytecode binaries |
| 18 | `bin/com/railflow` | Compiled classes for `com.railflow` |
| 19 | `bin/com/railflow/algorithm` | Compiled algorithm strategies & optimizers |
| 20 | `bin/com/railflow/cli` | Compiled CLI console classes |
| 21 | `bin/com/railflow/collection` | Compiled registry & cache collections |
| 22 | `bin/com/railflow/dto` | Compiled Data Transfer Objects |
| 23 | `bin/com/railflow/enums` | Compiled status & category enumerations |
| 24 | `bin/com/railflow/exception` | Compiled domain exception handlers |
| 25 | `bin/com/railflow/io` | Compiled loaders, parsers, and exporters |
| 26 | `bin/com/railflow/model` | Compiled domain entity models |
| 27 | `bin/com/railflow/repository` | Compiled persistence repositories |
| 28 | `bin/com/railflow/service` | Compiled core service layer implementations |
| 29 | `bin/jakarta/validation/constraints` | Compiled Jakarta constraint annotations |
| 30 | `bin/org/springframework/beans/factory/annotation` | Compiled Spring annotation stubs |
| 31 | `bin/org/springframework/stereotype` | Compiled Spring stereotype stubs |
| 32 | `css` | Standalone frontend stylesheets |
| 33 | `database` | Root SQLite database directory |
| 34 | `deploy` | Staged pre-packaged deployment bundle |
| 35 | `deploy/.vercel` | Staged deployment Vercel config |
| 36 | `deploy/DATA` | Staged datasets & train databases |
| 37 | `deploy/DATA/trains` | Staged individual train route JSONs |
| 38 | `deploy/api` | Staged serverless API handlers |
| 39 | `deploy/backend` | Staged Node.js server and schema |
| 40 | `deploy/backend/database` | Staged backend database schema and DB |
| 41 | `deploy/backend/src` | Staged backend source files |
| 42 | `deploy/backend/src/providers/pnr` | Staged PNR service providers |
| 43 | `deploy/backend/src/repositories` | Staged backend repositories |
| 44 | `deploy/backend/src/routes` | Staged Express routes |
| 45 | `deploy/backend/src/services` | Staged backend services |
| 46 | `deploy/css` | Staged stylesheets |
| 47 | `deploy/docs` | Staged documentation root |
| 48 | `deploy/docs/algorithms` | Staged algorithm documentation |
| 49 | `deploy/docs/api` | Staged API specifications |
| 50 | `deploy/docs/architecture` | Staged architecture documentation |
| 51 | `deploy/docs/java-concepts` | Staged Java conceptual documentation |
| 52 | `deploy/docs/screenshots` | Staged UI screenshots & diagrams |
| 53 | `deploy/frontend` | Staged web client root |
| 54 | `deploy/frontend/css` | Staged frontend stylesheets |
| 55 | `deploy/frontend/js` | Staged frontend client scripts |
| 56 | `deploy/frontend/js/data` | Staged static client datasets |
| 57 | `deploy/js` | Staged root JavaScript files |
| 58 | `deploy/js/data` | Staged root static dataset scripts |
| 59 | `docs` | Project documentation directory |
| 60 | `docs/algorithms` | Optimization & scheduling algorithm guides |
| 61 | `docs/api` | REST API specifications and OpenAPI contracts |
| 62 | `docs/architecture` | System architecture, ER diagrams & schemas |
| 63 | `docs/java-concepts` | Comprehensive Java concepts reference (01–23) |
| 64 | `docs/screenshots` | UI screenshots, modal views & application captures |
| 65 | `frontend` | Dedicated client application directory |
| 66 | `frontend/css` | Frontend styling (`styles.css`, `style.css`) |
| 67 | `frontend/js` | Client-side application logic & tracker |
| 68 | `frontend/js/data` | Client master railway data bundle |
| 69 | `git` | Secondary git archive / synced working copy |
| 70 | `git/DATA` | Git archive datasets |
| 71 | `git/DATA/trains` | Git archive individual train files |
| 72 | `git/api` | Git archive serverless API functions |
| 73 | `git/backend` | Git archive backend module |
| 74 | `git/backend/database` | Git archive backend SQLite DB |
| 75 | `git/backend/src` | Git archive backend source code |
| 76 | `git/backend/src/providers/pnr` | Git archive PNR providers |
| 77 | `git/backend/src/repositories` | Git archive backend repositories |
| 78 | `git/backend/src/routes` | Git archive Express routes |
| 79 | `git/backend/src/services` | Git archive backend services |
| 80 | `git/css` | Git archive stylesheets |
| 81 | `git/docs` | Git archive documentation |
| 82 | `git/docs/algorithms` | Git archive algorithm documentation |
| 83 | `git/docs/api` | Git archive API specifications |
| 84 | `git/docs/architecture` | Git archive architecture guides |
| 85 | `git/docs/java-concepts` | Git archive Java educational guides |
| 86 | `git/docs/screenshots` | Git archive UI screenshots |
| 87 | `git/frontend` | Git archive frontend module |
| 88 | `git/frontend/css` | Git archive frontend styles |
| 89 | `git/frontend/js` | Git archive frontend scripts |
| 90 | `git/frontend/js/data` | Git archive frontend static datasets |
| 91 | `git/js` | Git archive client JavaScript |
| 92 | `git/js/data` | Git archive static dataset scripts |
| 93 | `git/scripts` | Git archive utility & automation scripts |
| 94 | `git/src` | Git archive Java sources |
| 95 | `git/src/main` | Git archive main Java application |
| 96 | `git/src/test` | Git archive test suite |
| 97 | `git/tests` | Git archive Jest / integration test suites |
| 98 | `images` | UI assets, templates, and dashboard graphics |
| 99 | `js` | Root client-side application scripts |
| 100 | `js/data` | Static master railway dataset exports |
| 101 | `python_backend` | Python optimization backend (`optimizer.py`) |
| 102 | `scratch` | Scratch scripts, data audits, inspection files |
| 103 | `scripts` | Automation, CLI runners, ingestion, DB builders |
| 104 | `src` | Primary application source tree (Maven standard) |
| 105 | `src/main` | Production source code and resources |
| 106 | `src/main/java` | Production Java source root |
| 107 | `src/main/java/com/railflow` | Main RailFlow application package |
| 108 | `src/main/java/com/railflow/algorithm` | Platform allocation, delay & crowd strategies |
| 109 | `src/main/java/com/railflow/cli` | Interactive console & terminal runner |
| 110 | `src/main/java/com/railflow/collection` | In-memory thread-safe registries |
| 111 | `src/main/java/com/railflow/concurrency` | Thread pools, async tasks, telemetry runners |
| 112 | `src/main/java/com/railflow/config` | Application & database configuration |
| 113 | `src/main/java/com/railflow/controller` | REST API controllers (AI, Alert, Route, etc.) |
| 114 | `src/main/java/com/railflow/dao` | Direct database access objects |
| 115 | `src/main/java/com/railflow/database` | Database connection pool & schema management |
| 116 | `src/main/java/com/railflow/dto` | API request and response DTO records |
| 117 | `src/main/java/com/railflow/enums` | System enumerations (Status, Severity, Type) |
| 118 | `src/main/java/com/railflow/exception` | Exception handlers and custom exceptions |
| 119 | `src/main/java/com/railflow/ingestion` | Data ingestion engines, PDF & CSV scanners |
| 120 | `src/main/java/com/railflow/io` | File readers, parsers, normalizers, exporters |
| 121 | `src/main/java/com/railflow/model` | Domain entities (Train, Station, Platform, etc.) |
| 122 | `src/main/java/com/railflow/repository` | Repository interfaces & in-memory stores |
| 123 | `src/main/java/com/railflow/repository/jdbc` | SQLite JDBC repository implementations |
| 124 | `src/main/java/com/railflow/service` | Business logic services (Route, AI, PNR, etc.) |
| 125 | `src/main/java/com/railflow/util` | Utility classes & database bootstrap logic |
| 126 | `src/main/java/jakarta/validation/constraints` | Validation constraint annotations |
| 127 | `src/main/java/org/springframework/beans/factory/annotation` | Lightweight Spring DI annotations |
| 128 | `src/main/java/org/springframework/stereotype` | Stereotype annotations (@Service, @Repository) |
| 129 | `src/main/resources` | Production resource files |
| 130 | `src/main/resources/static` | Static web server root |
| 131 | `src/main/resources/static/css` | Static stylesheets for embedded server |
| 132 | `src/main/resources/static/js` | Static JavaScript for embedded server |
| 133 | `src/main/resources/static/js/data` | Static master railway data for embedded server |
| 134 | `src/test` | Test source tree |
| 135 | `src/test/java` | Test Java source root |
| 136 | `src/test/java/com/railflow` | RailFlow JUnit 5 tests & live SQL verification |
| 137 | `target` | Maven build and compilation target directory |
| 138 | `target/classes` | Compiled production classes and copied resources |
| 139 | `target/classes/com/railflow` | Compiled RailFlow production class files |
| 140 | `target/classes/jakarta/validation` | Compiled validation classes |
| 141 | `target/classes/org/springframework` | Compiled Spring helper classes |
| 142 | `target/classes/static` | Compiled static web assets |
| 143 | `target/classes/static/css` | Compiled CSS assets |
| 144 | `target/classes/static/js` | Compiled JS assets |
| 145 | `target/generated-sources` | Maven generated source output |
| 146 | `target/generated-sources/annotations` | Compiler annotation processing output |
| 147 | `target/generated-test-sources` | Maven generated test source output |
| 148 | `target/maven-status` | Maven build status tracking metadata |
| 149 | `target/surefire-reports` | JUnit test execution XML/txt reports |
| 150 | `target/test-classes` | Compiled test class files |
| 151 | `target/test-classes/com/railflow` | Compiled RailFlow unit test classes |
| 152 | `tests` | Node.js integration & endpoint tests (Jest) |

---

## Component & Module Breakdown

### 1. Java Application Source (`src/`)
The primary backend engine built with Java 17+, organizing business logic into clean modular layers:
- **`src/main/java/com/railflow/algorithm`**: Contains crowd analysis (`StatisticalCrowdAnalyzer`, `ThresholdCrowdAnalyzer`), route analyzers, delay analyzers, and platform allocation strategies (`NearestPlatformStrategy`, `LeastCrowdedStrategy`, `CapacityBasedStrategy`, `PriorityBasedStrategy`).
- **`src/main/java/com/railflow/cli`**: Contains `RailFlowConsole` and `RailwayDataCliRunner` for interactive command-line operation.
- **`src/main/java/com/railflow/collection`**: Thread-safe registry stores for stations, trains, platforms, alerts, and system telemetry.
- **`src/main/java/com/railflow/concurrency`**: High-performance thread pool managers, train synchronization tasks, and asynchronous crowd update workers.
- **`src/main/java/com/railflow/config`**: Core application properties, database initialization, and web configuration.
- **`src/main/java/com/railflow/controller`**: REST controllers exposing 17+ domain APIs (Route search, Platform management, PNR validation, AI assistance, Feedback).
- **`src/main/java/com/railflow/dao`**: Direct SQL database operations for Stations, Trains, Platforms, Network graphs, and Quality metrics.
- **`src/main/java/com/railflow/database`**: SQLite connection pooling, SQLite schema migrations, and SQLite table creation.
- **`src/main/java/com/railflow/dto`**: Immutable request/response structures for external API contracts.
- **`src/main/java/com/railflow/enums`**: Strong typings for platform statuses, gate positions, train delays, and feedback categories.
- **`src/main/java/com/railflow/exception`**: Centralized domain error definitions and `@ControllerAdvice` global exception handling.
- **`src/main/java/com/railflow/ingestion`**: Automated parsing engines for raw Indian Railways CSVs and PDF data banks.
- **`src/main/java/com/railflow/io`**: CSV/PDF readers, station normalizers, and JSON serialization exporters.
- **`src/main/java/com/railflow/model`**: Comprehensive object graph representing Stations, Trains, Schedules, Platforms, Corridors, Gates, and Passengers.
- **`src/main/java/com/railflow/repository`**: In-memory and SQLite-backed repository patterns (`com/railflow/repository/jdbc`).
- **`src/main/java/com/railflow/service`**: Core business services including graph shortest-path routing, crowd simulation, AI recommendations, and IRCTC API integrations.
- **`src/test/java/com/railflow`**: Comprehensive JUnit 5 test suite verifying graph integrity, platform scheduling, algorithm accuracy, and database connectivity.

### 2. Node.js & Express Backend (`backend/`)
A lightweight, modern JavaScript backend providing real-time railway APIs:
- **`backend/src/routes`**: Modular endpoint routers for stations, trains, PNR, platform optimization, feedback, and health checks.
- **`backend/src/repositories`**: SQL query builders and repository classes accessing `railway.db`.
- **`backend/src/providers/pnr`**: PNR lookup abstraction layer supporting mock fallback and real IRCTC provider normalization.
- **`backend/database`**: Dedicated backend SQLite schema (`schema.sql`) and database instance.

### 3. Datasets & Database (`DATA/`, `database/`)
The persistence foundation supporting offline and live operational modes:
- **`DATA/`**: Contains raw railway data, station heritage catalogs, station aliases, database dumps, and official Indian Railways PDFs.
- **`DATA/trains/`**: Directory containing thousands of per-train route JSON manifests.
- **`database/`**: Primary SQLite database file (`railway.db`) containing complete normalized tables for routes, trains, schedules, and stations.

### 4. Web Frontend & Static UI
Interactive dashboard and tracking visualization:
- **`frontend/`**: Complete modular frontend bundle with modern responsive CSS and live JavaScript.
- **`css/` & `src/main/resources/static/css/`**: High-contrast, dark-mode glassmorphic stylesheets (`styles.css`, `templatemo-622-clearwave.css`).
- **`js/` & `src/main/resources/static/js/`**: Client application controllers (`app.js`), real-time train tracker (`tracker.js`), and static data packages (`js/data/masterRailwayData.js`).
- **`images/`**: High-definition UI backgrounds, station diagrams, and responsive layout graphics.

### 5. Documentation (`docs/`)
Comprehensive project documentation and educational resources:
- **`docs/algorithms/`**: Technical explanation of graph routing, bottleneck detection, and platform priority scoring.
- **`docs/api/`**: Complete REST API specifications and parameter contracts.
- **`docs/architecture/`**: System architecture documentation and component interaction models.
- **`docs/java-concepts/`**: 23 standalone educational modules detailing Core Java, OOP, Collections, Concurrency, NIO.2, Lambdas, and Design Patterns.
- **`docs/screenshots/`**: Visual evidence and UI captures of the working platform.

### 6. Scripts & Automation
Operational scripts, data pipelines, and machine learning utilities:
- **`scripts/`**: Graph construction (`build_bias_free_graph.py`), railway data enrichment (`enrich_historical_railway_data.py`), CSV importers (`import-csv.js`), and batch runners (`run-console.bat`, `start-api.bat`).
- **`python_backend/`**: Python microservices for routing and mathematical optimization.
- **`scratch/`**: Data validation experiments, GeoJSON station audits, and sync scripts.

### 7. Serverless Endpoints (`api/`)
Edge-ready serverless function handlers:
- **`api/ask-railflow-ai.js`**: AI railway assistant serverless proxy.
- **`api/atlas-proxy.js`**: Geospatial and remote database proxy.

### 8. Deployment & Version Control
- **`deploy/`**: Clean production-ready mirror optimized for single-command Vercel / serverless deployments.
- **`git/`**: Synced repository directory with isolated module mirrors.
- `.vercel/` & `.git/`: Platform deployment state and revision control stores.

### 9. IDE & Build Outputs
- **`target/`**: Maven compilation output directory containing compiled `.class` files, generated sources, and surefire test reports.
- **`bin/`**: Local Eclipse / IDE output folder holding compiled Java bytecodes.
- **`.vscode/` & `.gemini/`**: Project settings and IDE runtime environment definitions.

---
*File created automatically for **RailFlow System**.*
