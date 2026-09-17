package com.railflow.service;

import com.railflow.dao.PlatformDAO;
import com.railflow.model.CrowdTelemetry;
import com.railflow.model.Platform;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;

/**
 * Enterprise Scheduled Service generating simulated platform operational telemetry
 * every 3,000 milliseconds using Java Concurrency (ScheduledExecutorService).
 *
 * Implements the Indian Railways Rule Engine:
 * - NORMAL:   density < 70%
 * - WARNING:  density >= 70% && density < 90%
 * - CRITICAL: density >= 90%
 *
 * All metrics are strictly marked as 'SIMULATED MODEL'.
 */
@Service
public class CrowdSimulationService {

    private static final Logger log = LoggerFactory.getLogger(CrowdSimulationService.class);
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm:ss");

    private final PlatformDAO platformDAO;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "RailFlow-CrowdSimulation-Worker");
        t.setDaemon(true);
        return t;
    });

    private final List<CrowdTelemetry> inMemoryRecentTelemetry = new CopyOnWriteArrayList<>();
    private final Random random = new Random();
    private long tickCounter = 0;

    @Autowired
    public CrowdSimulationService(PlatformDAO platformDAO) {
        this.platformDAO = platformDAO;
    }

    @PostConstruct
    public void startSimulationScheduler() {
        log.info("Starting CrowdSimulationService scheduler with 3,000 ms cadence...");
        scheduler.scheduleAtFixedRate(this::simulationTick, 1500, 3000, TimeUnit.MILLISECONDS);
    }

    @PreDestroy
    public void stopSimulationScheduler() {
        log.info("Shutting down CrowdSimulationService scheduler...");
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

    public synchronized void simulationTick() {
        try {
            tickCounter++;
            List<Platform> platforms = platformDAO.findAll();
            if (platforms.isEmpty()) return;

            List<CrowdTelemetry> currentBatch = new ArrayList<>();
            String timestamp = LocalDateTime.now().format(TIME_FMT);

            for (Platform p : platforms) {
                int capacity = p.getCapacity();
                // Fluctuate crowd realistically between 30% and 105% of capacity
                double variation = (random.nextGaussian() * 0.08); // small organic fluctuation
                double currentOccupancy = p.getOccupancyRate();
                double newOccupancy = Math.max(0.20, Math.min(1.10, currentOccupancy + variation));
                
                int newCrowd = (int) Math.round(capacity * newOccupancy);
                double densityPercent = Math.round(((double) newCrowd / capacity) * 100.0 * 10.0) / 10.0;

                // Density Rule Engine
                String status;
                if (densityPercent >= 90.0) {
                    status = "CRITICAL";
                } else if (densityPercent >= 70.0) {
                    status = "WARNING";
                } else {
                    status = "NORMAL";
                }

                platformDAO.updateCrowdDensity(p.getId(), newCrowd, newOccupancy, status);

                CrowdTelemetry telemetry = new CrowdTelemetry(
                        p.getId(),
                        p.getStationCode(),
                        p.getPlatformNumber(),
                        newCrowd,
                        capacity,
                        densityPercent,
                        status,
                        timestamp
                );

                currentBatch.add(telemetry);
                // Persist telemetry for major hubs periodically
                if (tickCounter % 5 == 0 && (p.getStationCode().equals("MAS") || p.getStationCode().equals("NDLS"))) {
                    platformDAO.recordTelemetry(telemetry);
                }
            }

            // Keep in-memory cache of latest telemetry for high-speed client polling
            inMemoryRecentTelemetry.clear();
            inMemoryRecentTelemetry.addAll(currentBatch);

        } catch (Exception e) {
            log.error("Error executing simulation tick: {}", e.getMessage());
        }
    }

    public List<CrowdTelemetry> getLatestTelemetry() {
        if (inMemoryRecentTelemetry.isEmpty()) {
            return platformDAO.getLatestTelemetry(30);
        }
        return new ArrayList<>(inMemoryRecentTelemetry);
    }

    public Map<String, Object> getProvenanceDetails() {
        Map<String, Object> prov = new HashMap<>();
        prov.put("modelType", "SIMULATED MODEL");
        prov.put("generator", "CrowdSimulationService (Java ScheduledExecutorService)");
        prov.put("intervalMs", 3000);
        prov.put("totalTicksGenerated", tickCounter);
        prov.put("densityRuleEngine", Map.of(
                "NORMAL", "< 70%",
                "WARNING", "70% - 89%",
                "CRITICAL", ">= 90%"
        ));
        prov.put("provenanceGuarantee", "Crowd telemetry is generated by CrowdSimulationService using a 3,000 ms background scheduler. Station Registry & Timetables are REAL DATA backed by SQLite.");
        return prov;
    }
}
