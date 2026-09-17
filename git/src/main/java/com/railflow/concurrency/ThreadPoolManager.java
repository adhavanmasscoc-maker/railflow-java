package com.railflow.concurrency;

import com.railflow.algorithm.CrowdAnalyzer;
import com.railflow.repository.AlertRepository;
import com.railflow.repository.PlatformRepository;
import com.railflow.repository.TrainRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.concurrent.*;
import java.util.logging.Logger;

/**
 * Manages explicit Java Multithreading and Scheduled Executor Services.
 * Demonstrates clean Thread pool configuration, scheduled tasks, and shutdown hooks.
 */
@Component
public class ThreadPoolManager {

    private static final Logger logger = Logger.getLogger(ThreadPoolManager.class.getName());

    private final PlatformRepository platformRepository;
    private final TrainRepository trainRepository;
    private final AlertRepository alertRepository;
    private final CrowdAnalyzer crowdAnalyzer;

    private ScheduledExecutorService scheduler;
    private ExecutorService asyncWorkerPool;

    @Autowired
    public ThreadPoolManager(PlatformRepository platformRepository,
                             TrainRepository trainRepository,
                             AlertRepository alertRepository,
                             @Qualifier("thresholdCrowdAnalyzer") CrowdAnalyzer crowdAnalyzer) {
        this.platformRepository = platformRepository;
        this.trainRepository = trainRepository;
        this.alertRepository = alertRepository;
        this.crowdAnalyzer = crowdAnalyzer;
    }

    @PostConstruct
    public void startBackgroundWorkers() {
        logger.info("Initializing ThreadPoolManager and background concurrency tasks...");

        // Dedicated scheduled pool with custom named thread factory
        this.scheduler = Executors.newScheduledThreadPool(3, new ThreadFactory() {
            private int threadNum = 1;
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r, "RailFlow-Worker-" + (threadNum++));
                t.setDaemon(true);
                return t;
            }
        });

        // Fixed worker pool for asynchronous ad-hoc tasks
        this.asyncWorkerPool = Executors.newFixedThreadPool(4, new ThreadFactory() {
            private int threadNum = 1;
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r, "RailFlow-AsyncPool-" + (threadNum++));
                t.setDaemon(true);
                return t;
            }
        });

        // 1. Schedule Crowd Simulation tick every 4 seconds
        scheduler.scheduleWithFixedDelay(
                new CrowdUpdateTask(platformRepository),
                2, 4, TimeUnit.SECONDS
        );

        // 2. Schedule Train ETA sync tick every 30 seconds
        scheduler.scheduleWithFixedDelay(
                new TrainSyncTask(trainRepository),
                5, 30, TimeUnit.SECONDS
        );

        // 3. Schedule Alert Processing & Threshold evaluation tick every 5 seconds
        scheduler.scheduleWithFixedDelay(
                new AlertProcessor(platformRepository, alertRepository, crowdAnalyzer),
                3, 5, TimeUnit.SECONDS
        );

        logger.info("Background concurrency schedulers started successfully.");
    }

    public <T> CompletableFuture<T> submitAsyncTask(Callable<T> task) {
        CompletableFuture<T> future = new CompletableFuture<>();
        asyncWorkerPool.submit(() -> {
            try {
                future.complete(task.call());
            } catch (Exception e) {
                future.completeExceptionally(e);
            }
        });
        return future;
    }

    @PreDestroy
    public void shutdown() {
        logger.info("Shutting down ThreadPoolManager executor services...");
        if (scheduler != null) {
            scheduler.shutdown();
            try {
                if (!scheduler.awaitTermination(2, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }

        if (asyncWorkerPool != null) {
            asyncWorkerPool.shutdown();
        }
    }
}
