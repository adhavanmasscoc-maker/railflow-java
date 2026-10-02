# 14 — Multithreading, Thread Pools & Scheduled Executors

## Overview
Asynchronous background tasks (footfall simulations, timetable ticks, alert cleanups) run on dedicated daemon thread pools managed via `ThreadPoolManager`.

## Concurrency Components
1. **`ScheduledExecutorService`**:
   - `CrowdUpdateTask`: Ticks every 4 seconds, simulating commuter arrivals/departures through turnstile gates.
   - `TrainSyncTask`: Ticks every 30 seconds, updating train ETA and platform arrival assignments.
2. **`ThreadPoolManager`**:
   - Encapsulates lifecycle, thread factory with descriptive names (`railflow-sim-%d`), and graceful JVM shutdown hooks.

## Code Example
```java
public class ThreadPoolManager {
    private final ScheduledExecutorService scheduler;

    public ThreadPoolManager() {
        this.scheduler = Executors.newScheduledThreadPool(2, new ThreadFactory() {
            private final AtomicInteger count = new AtomicInteger(1);
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r, "railflow-worker-" + count.getAndIncrement());
                t.setDaemon(true);
                return t;
            }
        });
    }

    public void startSimulation(Runnable task, long initialDelaySec, long intervalSec) {
        scheduler.scheduleAtFixedRate(task, initialDelaySec, intervalSec, TimeUnit.SECONDS);
    }
}
```
