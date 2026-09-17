# 11 — Multithreading in RailFlow

## Concept Overview
Java Multithreading enables concurrent background execution of simulation updates, train ETA synchronizations, and alert evaluations in dedicated worker threads without blocking incoming HTTP request threads.

## Concurrency Layer Architecture
- [`ThreadPoolManager.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/concurrency/ThreadPoolManager.java): Configures `ScheduledExecutorService` with 3 daemon worker threads.
- [`CrowdUpdateTask.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/concurrency/CrowdUpdateTask.java): Runs every 4s to simulate crowd dynamics.
- [`TrainSyncTask.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/concurrency/TrainSyncTask.java): Runs every 30s to update train minute counters.
- [`AlertProcessor.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/concurrency/AlertProcessor.java): Runs every 5s to check safety rules and prune old alerts.

## Code Example
```java
this.scheduler = Executors.newScheduledThreadPool(3, new ThreadFactory() {
    private int threadNum = 1;
    @Override
    public Thread newThread(Runnable r) {
        Thread t = new Thread(r, "RailFlow-Worker-" + (threadNum++));
        t.setDaemon(true);
        return t;
    }
});

scheduler.scheduleWithFixedDelay(new CrowdUpdateTask(platformRepository), 2, 4, TimeUnit.SECONDS);
```
