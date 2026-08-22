package com.railflow.service;

import com.railflow.dto.DashboardStatsResponse;
import com.railflow.enums.PlatformStatus;
import com.railflow.enums.TrainStatus;
import com.railflow.model.CrowdSnapshot;
import com.railflow.model.Platform;
import com.railflow.model.Train;
import com.railflow.repository.AlertRepository;
import com.railflow.repository.PlatformRepository;
import com.railflow.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Service implementation for crowd statistics and dashboard aggregation.
 */
@Service
public class CrowdServiceImpl implements CrowdService {

    private final PlatformRepository platformRepository;
    private final TrainRepository trainRepository;
    private final AlertRepository alertRepository;
    private final RecommendationService recommendationService;

    // Thread-safe historical snapshots buffer
    private final List<CrowdSnapshot> snapshotHistory = new CopyOnWriteArrayList<>();

    @Autowired
    public CrowdServiceImpl(PlatformRepository platformRepository,
                            TrainRepository trainRepository,
                            AlertRepository alertRepository,
                            RecommendationService recommendationService) {
        this.platformRepository = platformRepository;
        this.trainRepository = trainRepository;
        this.alertRepository = alertRepository;
        this.recommendationService = recommendationService;
    }

    @Override
    public DashboardStatsResponse getDashboardStatistics() {
        List<Platform> platforms = platformRepository.findAll();
        List<Train> trains = trainRepository.findAll();

        int totalPlatforms = platforms.size();
        int totalCapacity = platforms.stream().mapToInt(Platform::getCapacity).sum();
        int totalCrowd = platforms.stream().mapToInt(Platform::getCurrentCrowd).sum();
        double avgOccupancy = totalCapacity > 0 ? (double) totalCrowd / totalCapacity : 0.0;

        int critical = (int) platforms.stream().filter(Platform::isCritical).count();
        int warning = (int) platforms.stream().filter(p -> p.getStatus() == PlatformStatus.WARNING).count();
        int normal = totalPlatforms - critical - warning;

        int delayedTrains = (int) trains.stream().filter(Train::isDelayed).count();
        int arrivingSoon = (int) trains.stream().filter(t -> t.isArrivingSoon(15)).count();
        int activeAlerts = alertRepository.findActive().size();
        int totalRecs = recommendationService.getAllRecommendations().size();

        return new DashboardStatsResponse(
                totalPlatforms,
                totalCapacity,
                totalCrowd,
                avgOccupancy,
                (int) Math.round(avgOccupancy * 100),
                critical,
                warning,
                normal,
                trains.size(),
                delayedTrains,
                arrivingSoon,
                activeAlerts,
                totalRecs,
                getHourlyCrowdTrend(),
                "New Delhi Central",
                "NDLS",
                LocalDateTime.now().toString()
        );
    }

    @Override
    public List<Map<String, Object>> getHourlyCrowdTrend() {
        List<Map<String, Object>> trend = new ArrayList<>();
        int currentTotal = platformRepository.findAll().stream().mapToInt(Platform::getCurrentCrowd).sum();

        // 12-hour historical trend points
        double[] factors = {0.3, 0.4, 0.6, 0.85, 1.0, 0.9, 0.75, 0.8, 0.95, 1.05, 0.9, 1.0};
        LocalDateTime now = LocalDateTime.now();

        for (int i = 11; i >= 0; i--) {
            LocalDateTime time = now.minusHours(i);
            int estimatedCrowd = (int) (currentTotal * factors[11 - i]);
            Map<String, Object> point = new HashMap<>();
            point.put("time", String.format("%02d:00", time.getHour()));
            point.put("crowd", estimatedCrowd);
            point.put("occupancy", Math.min(1.0, (double) estimatedCrowd / 5000));
            trend.add(point);
        }
        return trend;
    }

    @Override
    public void recordSnapshot(CrowdSnapshot snapshot) {
        if (snapshot != null) {
            snapshotHistory.add(snapshot);
            if (snapshotHistory.size() > 144) {
                snapshotHistory.remove(0);
            }
        }
    }

    @Override
    public List<CrowdSnapshot> getRecentSnapshots() {
        return new ArrayList<>(snapshotHistory);
    }
}
