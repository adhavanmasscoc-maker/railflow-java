package com.railflow.cli;

import com.railflow.algorithm.PlatformOptimizer;
import com.railflow.algorithm.PlatformRanking;
import com.railflow.algorithm.ThresholdCrowdAnalyzer;
import com.railflow.algorithm.TrainSearch;
import com.railflow.collection.AlertRegistry;
import com.railflow.collection.PlatformRegistry;
import com.railflow.collection.TrainRegistry;
import com.railflow.dto.DashboardStatsResponse;
import com.railflow.dto.PlatformResponse;
import com.railflow.dto.RecommendationResponse;
import com.railflow.dto.TrainResponse;
import com.railflow.model.Platform;
import com.railflow.model.Train;
import com.railflow.repository.InMemoryAlertRepository;
import com.railflow.repository.InMemoryPlatformRepository;
import com.railflow.repository.InMemoryTrainRepository;
import com.railflow.service.*;

import java.util.List;
import java.util.Optional;
import java.util.Scanner;

/**
 * Standalone Interactive Console (CLI) Application for RailFlow.
 * Leverages the EXACT same Java Domain, Algorithms, and Services as the Spring Boot REST API.
 */
public class RailFlowConsole {

    private final PlatformService platformService;
    private final TrainService trainService;
    private final AlertService alertService;
    private final CrowdService crowdService;
    private final RecommendationService recommendationService;
    private final Scanner scanner;

    public RailFlowConsole(PlatformService platformService,
                           TrainService trainService,
                           AlertService alertService,
                           CrowdService crowdService,
                           RecommendationService recommendationService) {
        this.platformService = platformService;
        this.trainService = trainService;
        this.alertService = alertService;
        this.crowdService = crowdService;
        this.recommendationService = recommendationService;
        this.scanner = new Scanner(System.in);
    }

    public static void main(String[] args) {
        // Bootstrap pure Core Java architecture without requiring Spring Web server
        PlatformRegistry platformRegistry = new PlatformRegistry();
        TrainRegistry trainRegistry = new TrainRegistry();
        AlertRegistry alertRegistry = new AlertRegistry();

        InMemoryPlatformRepository platformRepo = new InMemoryPlatformRepository(platformRegistry);
        InMemoryTrainRepository trainRepo = new InMemoryTrainRepository(trainRegistry);
        InMemoryAlertRepository alertRepo = new InMemoryAlertRepository(alertRegistry);

        PlatformService platformService = new PlatformServiceImpl(platformRepo);
        TrainService trainService = new TrainServiceImpl(trainRepo);
        AlertService alertService = new AlertServiceImpl(alertRepo);

        PlatformOptimizer optimizer = new PlatformOptimizer(platformRepo, new com.railflow.algorithm.LeastCrowdedStrategy());
        RecommendationService recommendationService = new RecommendationServiceImpl(optimizer, platformRepo);
        CrowdService crowdService = new CrowdServiceImpl(platformRepo, trainRepo, alertRepo, recommendationService);

        RailFlowConsole console = new RailFlowConsole(platformService, trainService, alertService, crowdService, recommendationService);
        console.run();
    }

    public void run() {
        printBanner();
        boolean running = true;

        while (running) {
            printMainMenu();
            System.out.print("👉 Enter your choice (1-10): ");

            if (!scanner.hasNextInt()) {
                System.out.println("⚠️ Please enter a valid number.");
                scanner.next();
                continue;
            }

            int choice = scanner.nextInt();
            scanner.nextLine(); // consume newline

            System.out.println("\n------------------------------------------------------------");
            switch (choice) {
                case 1 -> showDashboardStats();
                case 2 -> viewAllPlatforms();
                case 3 -> updatePlatformCrowdInteractive();
                case 4 -> viewLiveTrainBoard();
                case 5 -> viewActiveAlerts();
                case 6 -> viewPlatformRankingsHeap();
                case 7 -> searchTrainsInteractive();
                case 8 -> viewOptimizationRecommendations();
                case 9 -> applyRecommendationInteractive();
                case 10 -> {
                    System.out.println("👋 Exiting RailFlow Console. Thank you!");
                    running = false;
                }
                default -> System.out.println("❌ Invalid option. Please select between 1 and 10.");
            }
            System.out.println("------------------------------------------------------------\n");
        }
    }

    private void printBanner() {
        System.out.println("============================================================");
        System.out.println("  🚉 RAILFLOW — SMART RAILWAY CROWD MONITORING SYSTEM (CLI)  ");
        System.out.println("  Core Java 17 | DSA & Algorithms | In-Memory Engine         ");
        System.out.println("============================================================");
    }

    private void printMainMenu() {
        System.out.println("\n--- MAIN MENU ---");
        System.out.println("1. 📊 Station Dashboard Overview");
        System.out.println("2. 🚉 View All Platforms & Crowd Status");
        System.out.println("3. 👥 Update Platform Crowd Count");
        System.out.println("4. 🚆 Live Train Schedule Board");
        System.out.println("5. 🚨 Active Crowd & Delay Alerts");
        System.out.println("6. 🏆 Platform Ranking (PriorityQueue Max-Heap DSA)");
        System.out.println("7. 🔍 Search Train (Linear / Binary Search DSA)");
        System.out.println("8. 💡 View Algorithmic Optimization Recommendations");
        System.out.println("9. ✅ Apply Optimization Recommendation");
        System.out.println("10. 🚪 Exit");
    }

    private void showDashboardStats() {
        DashboardStatsResponse stats = crowdService.getDashboardStatistics();
        System.out.println("📊 --- STATION DASHBOARD SNAPSHOT ---");
        System.out.printf("Station: %s (%s)%n", stats.stationName(), stats.stationCode());
        System.out.printf("Total Platforms: %d | Total Capacity: %d | Current Crowd: %d%n",
                stats.totalPlatforms(), stats.totalCapacity(), stats.totalCurrentCrowd());
        System.out.printf("Average Occupancy: %.1f%% (%d%%)%n",
                stats.averageOccupancyRate() * 100, stats.averageOccupancyPercentage());
        System.out.printf("Platforms Status -> Critical: %d | Warning: %d | Normal: %d%n",
                stats.criticalPlatformsCount(), stats.warningPlatformsCount(), stats.normalPlatformsCount());
        System.out.printf("Trains Active: %d | Delayed: %d | Arriving Soon: %d%n",
                stats.activeTrainsCount(), stats.delayedTrainsCount(), stats.arrivingSoonTrainsCount());
        System.out.printf("Active Alerts: %d | Actionable Recommendations: %d%n",
                stats.activeAlertsCount(), stats.totalRecommendationsCount());
    }

    private void viewAllPlatforms() {
        List<PlatformResponse> platforms = platformService.getAllPlatforms();
        System.out.println("🚉 --- PLATFORM STATUS DIRECTORY ---");
        System.out.printf("%-10s %-14s %-10s %-14s %-12s %-10s%n",
                "ID", "Name", "Crowd", "Capacity", "Occupancy", "Status");
        System.out.println("------------------------------------------------------------------");
        for (PlatformResponse p : platforms) {
            System.out.printf("%-10s %-14s %-10d %-14d %-12s %-10s%n",
                    p.id(), p.name(), p.currentCrowd(), p.capacity(),
                    p.occupancyPercentage() + "%", p.status());
        }
    }

    private void updatePlatformCrowdInteractive() {
        System.out.print("Enter Platform ID (e.g. PLT-001): ");
        String id = scanner.nextLine().trim();
        System.out.print("Enter New Crowd Count: ");
        if (!scanner.hasNextInt()) {
            System.out.println("❌ Invalid crowd input.");
            scanner.next();
            return;
        }
        int newCrowd = scanner.nextInt();
        scanner.nextLine();

        try {
            PlatformResponse updated = platformService.updatePlatformCrowd(id, newCrowd);
            System.out.printf("✅ Successfully updated %s crowd to %d (%.1f%% - %s)%n",
                    updated.name(), updated.currentCrowd(), updated.occupancyRate() * 100, updated.status());
        } catch (Exception e) {
            System.out.println("❌ Update failed: " + e.getMessage());
        }
    }

    private void viewLiveTrainBoard() {
        List<TrainResponse> trains = trainService.getAllTrains();
        System.out.println("🚆 --- LIVE TRAIN SCHEDULE BOARD ---");
        System.out.printf("%-8s %-24s %-12s %-10s %-12s %-10s%n",
                "Number", "Train Name", "Route", "ETA", "Delay", "Status");
        System.out.println("--------------------------------------------------------------------------------");
        for (TrainResponse t : trains) {
            System.out.printf("%-8s %-24s %-12s %-10s %-12s %-10s%n",
                    t.trainNumber(), truncate(t.name(), 23), t.route(),
                    t.minutesToArrival() + " min", t.delayMinutes() + " min", t.status());
        }
    }

    private void viewActiveAlerts() {
        var alerts = alertService.getActiveAlerts();
        System.out.println("🚨 --- ACTIVE SYSTEM ALERTS ---");
        if (alerts.isEmpty()) {
            System.out.println("✨ No active alerts. Station operations nominal.");
            return;
        }
        for (var a : alerts) {
            System.out.printf("[%s] %s | Platform: %s | %s%n  Action: %s%n",
                    a.severity(), a.title(), a.platformName() != null ? a.platformName() : "N/A",
                    a.message(), a.recommendedAction());
        }
    }

    private void viewPlatformRankingsHeap() {
        System.out.println("🏆 --- TOP MOST CONGESTED PLATFORMS (MAX-HEAP DSA) ---");
        List<Platform> domainPlatforms = platformService.getAllPlatforms().stream()
                .map(p -> platformService.getPlatformDomain(p.id()))
                .toList();

        List<Platform> topCongested = PlatformRanking.getTopKMostCongested(domainPlatforms, 3);
        int rank = 1;
        for (Platform p : topCongested) {
            System.out.printf("#%d %s: %d/%d (%.1f%%) - Status: %s%n",
                    rank++, p.getName(), p.getCurrentCrowd(), p.getCapacity(), p.getOccupancyRate() * 100, p.getStatus());
        }
    }

    private void searchTrainsInteractive() {
        System.out.print("Enter train number or destination keyword: ");
        String query = scanner.nextLine().trim();
        List<TrainResponse> results = trainService.searchTrains(query);

        System.out.printf("🔍 Found %d matching train(s):%n", results.size());
        for (TrainResponse t : results) {
            System.out.printf("• [%s] %s (%s -> %s) | Status: %s%n",
                    t.trainNumber(), t.name(), t.sourceStation(), t.destinationStation(), t.status());
        }
    }

    private void viewOptimizationRecommendations() {
        List<RecommendationResponse> recs = recommendationService.getAllRecommendations();
        System.out.println("💡 --- HEURISTIC OPTIMIZATION RECOMMENDATIONS ---");
        if (recs.isEmpty()) {
            System.out.println("✨ All platforms balanced. No intervention required.");
            return;
        }
        for (RecommendationResponse r : recs) {
            System.out.printf("[%s] %s (Priority: %d/100)%n  Issue: %s%n  Action: %s%n  Impact: %s%n",
                    r.id(), r.type(), r.priority(), r.issueDescription(), r.actionDescription(), r.expectedImpact());
        }
    }

    private void applyRecommendationInteractive() {
        System.out.print("Enter Recommendation ID to apply (e.g. REC-100): ");
        String id = scanner.nextLine().trim();
        boolean success = recommendationService.applyRecommendation(id);
        if (success) {
            System.out.println("✅ Optimization applied successfully!");
        } else {
            System.out.println("❌ Failed to apply. Invalid ID or already executed.");
        }
    }

    private String truncate(String val, int max) {
        if (val == null) return "";
        return val.length() > max ? val.substring(0, max - 1) + "…" : val;
    }
}
