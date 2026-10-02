# RailFlow — System Architecture & Component Interactions

## High-Level Architectural Layers

```text
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│     • Modern Dark Glassmorphism SPA (HTML5/CSS3/JS)         │
│     • Interactive Core Java CLI (RailFlowConsole)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / CLI Dispatch
┌──────────────────────────────▼──────────────────────────────┐
│                    Controller & DTO Layer                   │
│     • DashboardController  • PlatformController             │
│     • TrainController      • AlertController                │
│     • PlatformResponse     • TrainResponse                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Domain Operations
┌──────────────────────────────▼──────────────────────────────┐
│                    Service & Algorithm Layer                │
│     • PlatformService      • PlatformOptimizer              │
│     • TrainService         • Strategy Implementations       │
│     • AlertService         • PriorityQueue Heap Ranking     │
│     • CrowdService         • Binary & Linear TrainSearch    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Data Persistence & Lookup
┌──────────────────────────────▼──────────────────────────────┐
│                    Collection & Repository Layer            │
│     • Generic DataRegistry<K, V>                            │
│     • PlatformRepository   • TrainRepository                │
│     • AlertRepository      • StationRepository              │
│     • Thread-Safe ConcurrentHashMap Collections             │
└──────────────────────────────┬──────────────────────────────┘
                               │ Ingestion & Integration
┌──────────────────────────────▼──────────────────────────────┐
│                    I/O & External Feeds                     │
│     • CsvReader (ALL_RAILWAY_DATA.csv)                      │
│     • PdfReader (Apache PDFBox)                             │
│     • IrctcApiService (AsyncHttpClient & CompletableFuture) │
└─────────────────────────────────────────────────────────────┘
```

## Concurrency Lifecycle
- **CrowdUpdateTask**: Periodic 4-second thread pool tick that calculates passenger ingress/egress.
- **TrainSyncTask**: 30-second interval timer advancing train arrival counters.
- **AlertProcessor**: Real-time evaluation of platform density rules and alert management.
