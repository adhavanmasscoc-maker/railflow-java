package com.railflow.concurrency;

import com.railflow.algorithm.CrowdAnalyzer;
import com.railflow.enums.AlertSeverity;
import com.railflow.model.Alert;
import com.railflow.model.Platform;
import com.railflow.repository.AlertRepository;
import com.railflow.repository.PlatformRepository;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;

/**
 * Concurrency worker: Evaluates platform states against safety rules and automatically triggers or resolves alerts.
 */
public class AlertProcessor implements Runnable {

    private static final Logger logger = Logger.getLogger(AlertProcessor.class.getName());

    private final PlatformRepository platformRepository;
    private final AlertRepository alertRepository;
    private final CrowdAnalyzer crowdAnalyzer;
    private final AtomicInteger alertCounter = new AtomicInteger(500);

    public AlertProcessor(PlatformRepository platformRepository, AlertRepository alertRepository, CrowdAnalyzer crowdAnalyzer) {
        this.platformRepository = platformRepository;
        this.alertRepository = alertRepository;
        this.crowdAnalyzer = crowdAnalyzer;
    }

    @Override
    public void run() {
        try {
            List<Platform> platforms = platformRepository.findAll();
            for (Platform p : platforms) {
                CrowdAnalyzer.CrowdAnalysisResult result = crowdAnalyzer.analyze(p);
                if (result.requiresIntervention()) {
                    ensureAlertExists(p, result);
                } else {
                    autoResolvePlatformAlerts(p.getId());
                }
            }
            // Auto purge old resolved alerts (older than 2 hours)
            alertRepository.purgeResolvedOlderThan(2);
        } catch (Exception e) {
            logger.warning("Error during alert processing: " + e.getMessage());
        }
    }

    private void ensureAlertExists(Platform platform, CrowdAnalyzer.CrowdAnalysisResult result) {
        boolean alreadyActive = alertRepository.findActive().stream()
                .anyMatch(a -> platform.getId().equals(a.getPlatformId()));

        if (!alreadyActive) {
            AlertSeverity severity = platform.isCritical() ? AlertSeverity.CRITICAL : AlertSeverity.HIGH;
            Alert alert = new Alert(
                    "ALT-" + alertCounter.getAndIncrement(),
                    platform.isCritical() ? "CRITICAL_OVERCROWDING" : "HIGH_CROWD",
                    severity,
                    String.format("%s Overcrowding Alert (%.0f%%)", platform.getName(), result.occupancyRate() * 100),
                    result.advisoryNote()
            );
            alert.setPlatformId(platform.getId());
            alert.setPlatformName(platform.getName());
            alert.setRecommendedAction("Open additional gates and initiate foot-traffic diversion.");
            alertRepository.save(alert);
        }
    }

    private void autoResolvePlatformAlerts(String platformId) {
        for (Alert a : alertRepository.findActive()) {
            if (platformId.equals(a.getPlatformId())) {
                a.resolve();
            }
        }
    }
}
