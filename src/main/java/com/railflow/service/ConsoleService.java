package com.railflow.service;

import com.railflow.dto.AlertResponse;
import com.railflow.dto.DashboardStatsResponse;
import com.railflow.dto.PlatformResponse;
import com.railflow.dto.TrainResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service powering the integrated RailFlowSystem Web Terminal / CLI Simulator.
 * Unifies all 10 interactive console operations into real-time executable backend logic.
 */
@Service
public class ConsoleService {

    private final PlatformService platformService;
    private final TrainService trainService;
    private final AlertService alertService;
    private final CrowdService crowdService;
    private final RecommendationService recommendationService;

    @Autowired
    public ConsoleService(PlatformService platformService,
                          TrainService trainService,
                          AlertService alertService,
                          CrowdService crowdService,
                          RecommendationService recommendationService) {
        this.platformService = platformService;
        this.trainService = trainService;
        this.alertService = alertService;
        this.crowdService = crowdService;
        this.recommendationService = recommendationService;
    }

    public Map<String, Object> execute(String commandInput) {
        if (commandInput == null || commandInput.trim().isEmpty()) {
            return formatResult("HELP", getHelpMenu());
        }

        String input = commandInput.trim();
        String[] parts = input.split("\\s+");
        String cmd = parts[0].toLowerCase();

        return switch (cmd) {
            case "1", "dashboard", "dash" -> formatResult("DASHBOARD", renderDashboard());
            case "2", "platforms", "platform", "plt" -> formatResult("PLATFORMS", renderPlatforms());
            case "3", "update", "setcrowd" -> formatResult("UPDATE_PASSENGERS", handleUpdateCrowd(parts));
            case "4", "trains", "board", "arrivals" -> formatResult("TRAIN_BOARD", renderTrainBoard());
            case "5", "alerts", "alert" -> formatResult("CROWD_ALERTS", renderCrowdAlerts());
            case "6", "stats", "statistics" -> formatResult("PLATFORM_STATISTICS", renderPlatformStatistics());
            case "7", "search", "find" -> formatResult("SEARCH_TRAIN", handleSearchTrain(parts));
            case "8", "report", "passenger" -> formatResult("PASSENGER_REPORT", renderPassengerReport());
            case "9", "sysinfo", "system", "info" -> formatResult("SYSTEM_INFO", renderSystemInfo());
            case "10", "clear", "cls", "reset" -> formatResult("CLEAR", renderWelcomeScreen());
            case "help", "menu", "?" -> formatResult("MENU", getHelpMenu());
            default -> formatResult("UNKNOWN", "⚠️ Unknown command: '" + input + "'\nType 'help' or '1'-'10' to select a menu option.");
        };
    }

    private Map<String, Object> formatResult(String action, String output) {
        Map<String, Object> res = new HashMap<>();
        res.put("action", action);
        res.put("output", output);
        res.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        return res;
    }

    public String getHelpMenu() {
        return """
               ==============================================================
                                   RAILFLOW CONTROL PANEL
               ==============================================================
                 1.  Live Dashboard             (Real-time station overview)
                 2.  View Platform Status       (Occupancy, capacity & types)
                 3.  Update Passenger Count     (Usage: 3 <platformId> <count>)
                 4.  Train Arrival Board        (Live train schedules & delays)
                 5.  Crowd Alerts               (Overcrowding & safety warnings)
                 6.  Platform Statistics        (Min/Max/Avg capacity metrics)
                 7.  Search Train               (Usage: 7 <name or number>)
                 8.  Passenger Report           (Load factor & platform split)
                 9.  System Information         (JVM, memory, threads & OS)
                10.  Reset / Banner Screen      (Clear and show welcome banner)
               ==============================================================
               """;
    }

    public String renderWelcomeScreen() {
        return """
               ==============================================================
                                       RAILFLOW SYSTEM
                             SMART RAILWAY CROWD MONITORING SYSTEM
               ==============================================================

                       +------------------------------------------+
                       |        REAL-TIME RAILWAY CONTROL         |
                       |                                          |
                       |     Crowd Monitoring     [ACTIVE]        |
                       |     Train Monitoring     [ACTIVE]        |
                       |     Platform Monitoring  [ACTIVE]        |
                       +------------------------------------------+

                                   Welcome Operator!
               """;
    }

    private String renderDashboard() {
        DashboardStatsResponse stats = crowdService.getDashboardStatistics();
        StringBuilder sb = new StringBuilder();
        sb.append("==============================================================\n");
        sb.append("                       LIVE STATION DASHBOARD                 \n");
        sb.append("==============================================================\n");
        sb.append(String.format(" Station: %s (%s) | Time: %s\n", stats.stationName(), stats.stationCode(), stats.timestamp()));
        sb.append("--------------------------------------------------------------\n");
        sb.append(String.format(" 👥 Total Active Passengers : %d / %d (Cap)\n", stats.totalCurrentCrowd(), stats.totalCapacity()));
        sb.append(String.format(" 📊 Average Occupancy Rate  : %.1f%% (%s)\n", stats.averageOccupancyRate() * 100, stats.averageOccupancyPercentage() + "%"));
        sb.append(String.format(" 🚨 Critical Platforms (>90%): %d\n", stats.criticalPlatformsCount()));
        sb.append(String.format(" ⚠️  Warning Platforms (>75%) : %d\n", stats.warningPlatformsCount()));
        sb.append(String.format(" 🟢 Normal Platforms        : %d\n", stats.normalPlatformsCount()));
        sb.append(String.format(" 🚆 Tracked Trains Active   : %d (Delayed: %d | Arriving: %d)\n", stats.activeTrainsCount(), stats.delayedTrainsCount(), stats.arrivingSoonTrainsCount()));
        sb.append(String.format(" 🔔 Active Safety Alerts    : %d\n", stats.activeAlertsCount()));
        sb.append("==============================================================\n");
        return sb.toString();
    }

    private String renderPlatforms() {
        List<PlatformResponse> list = platformService.getAllPlatforms();
        StringBuilder sb = new StringBuilder();
        sb.append("===================================================================================\n");
        sb.append("                                PLATFORM STATUS BOARD                              \n");
        sb.append("===================================================================================\n");
        sb.append(String.format("%-10s | %-16s | %-8s | %-8s | %-10s | %-10s | %-6s\n",
                "ID", "NAME", "CROWD", "CAPACITY", "OCCUPANCY", "STATUS", "GATES"));
        sb.append("-----------------------------------------------------------------------------------\n");
        for (PlatformResponse p : list) {
            String badge = p.occupancyRate() >= 0.90 ? "[CRITICAL]" : (p.occupancyRate() >= 0.75 ? "[WARNING]" : "[NORMAL]");
            sb.append(String.format("%-10s | %-16s | %-8d | %-8d | %-9.1f%% | %-10s | %d/%d\n",
                    p.id(), p.name(), p.currentCrowd(), p.capacity(), p.occupancyRate() * 100, badge, p.activeGates(), p.gateCount()));
        }
        sb.append("===================================================================================\n");
        return sb.toString();
    }

    private String handleUpdateCrowd(String[] parts) {
        if (parts.length < 3) {
            return "⚠️ Usage: 3 <platformId> <crowdCount>\nExample: 3 PLT-001 540";
        }
        try {
            String pltId = parts[1].toUpperCase();
            if (!pltId.startsWith("PLT-")) {
                pltId = "PLT-" + String.format("%03d", Integer.parseInt(parts[1]));
            }
            int crowd = Integer.parseInt(parts[2]);
            PlatformResponse updated = platformService.updatePlatformCrowd(pltId, crowd);
            return String.format("✅ SUCCESS: %s crowd updated to %d / %d (%.1f%% occupancy - %s)",
                    updated.name(), updated.currentCrowd(), updated.capacity(), updated.occupancyRate() * 100, updated.status());
        } catch (Exception e) {
            return "❌ Error updating crowd: " + e.getMessage();
        }
    }

    private String renderTrainBoard() {
        List<TrainResponse> trains = trainService.getAllTrains();
        StringBuilder sb = new StringBuilder();
        sb.append("=======================================================================================\n");
        sb.append("                              LIVE TRAIN ARRIVAL BOARD                                 \n");
        sb.append("=======================================================================================\n");
        sb.append(String.format("%-7s | %-24s | %-12s | %-10s | %-10s | %-10s\n",
                "TRAIN#", "TRAIN NAME", "PLATFORM", "ETA", "STATUS", "DELAY"));
        sb.append("---------------------------------------------------------------------------------------\n");
        for (TrainResponse t : trains) {
            String eta = t.minutesToArrival() <= 1 ? "ARRIVING" : t.minutesToArrival() + " min";
            String delay = t.delayMinutes() > 0 ? "+" + t.delayMinutes() + " min" : "ON TIME";
            sb.append(String.format("%-7s | %-24s | %-12s | %-10s | %-10s | %-10s\n",
                    t.trainNumber(), truncate(t.name(), 24), t.expectedPlatform() > 0 ? "Platform " + t.expectedPlatform() : "PLT-001", eta, t.status(), delay));
        }
        sb.append("=======================================================================================\n");
        return sb.toString();
    }

    private String renderCrowdAlerts() {
        List<AlertResponse> alerts = alertService.getActiveAlerts();
        StringBuilder sb = new StringBuilder();
        sb.append("=======================================================================================\n");
        sb.append("                              ACTIVE CROWD & SAFETY ALERTS                             \n");
        sb.append("=======================================================================================\n");
        if (alerts.isEmpty()) {
            sb.append(" 🟢 All platforms operating within safe density thresholds. No active alerts.\n");
        } else {
            for (AlertResponse a : alerts) {
                String icon = a.severity() != null && a.severity().equalsIgnoreCase("CRITICAL") ? "🚨 [CRITICAL]" : "⚠️ [WARNING]";
                sb.append(String.format(" %s %s - %s\n    Location: %s | Created: %s\n\n",
                        icon, a.id(), a.message(), a.platformName() != null ? a.platformName() : a.platformId(), a.createdAt()));
            }
        }
        sb.append("=======================================================================================\n");
        return sb.toString();
    }

    private String renderPlatformStatistics() {
        List<PlatformResponse> list = platformService.getAllPlatforms();
        if (list.isEmpty()) return "No platforms registered.";

        int totalCrowd = list.stream().mapToInt(PlatformResponse::currentCrowd).sum();
        int totalCapacity = list.stream().mapToInt(PlatformResponse::capacity).sum();
        PlatformResponse maxPlt = list.stream().max(Comparator.comparingDouble(PlatformResponse::occupancyRate)).orElse(list.get(0));
        PlatformResponse minPlt = list.stream().min(Comparator.comparingDouble(PlatformResponse::occupancyRate)).orElse(list.get(0));

        double avgCrowd = list.stream().mapToInt(PlatformResponse::currentCrowd).average().orElse(0);

        StringBuilder sb = new StringBuilder();
        sb.append("==============================================================\n");
        sb.append("                    PLATFORM CAPACITY STATISTICS              \n");
        sb.append("==============================================================\n");
        sb.append(String.format(" Total Platforms Configured: %d\n", list.size()));
        sb.append(String.format(" Combined Station Capacity : %d passengers\n", totalCapacity));
        sb.append(String.format(" Active Passenger Volume   : %d passengers (%.1f%% Utilized)\n", totalCrowd, (double) totalCrowd / totalCapacity * 100));
        sb.append(String.format(" Average Crowd per Platform: %.0f passengers\n", avgCrowd));
        sb.append("--------------------------------------------------------------\n");
        sb.append(String.format(" 🔥 Peak Congested Platform : %s (%d / %d - %.1f%%)\n",
                maxPlt.name(), maxPlt.currentCrowd(), maxPlt.capacity(), maxPlt.occupancyRate() * 100));
        sb.append(String.format(" 🟢 Least Crowded Platform  : %s (%d / %d - %.1f%%)\n",
                minPlt.name(), minPlt.currentCrowd(), minPlt.capacity(), minPlt.occupancyRate() * 100));
        sb.append("==============================================================\n");
        return sb.toString();
    }

    private String handleSearchTrain(String[] parts) {
        if (parts.length < 2) {
            return "⚠️ Usage: 7 <trainName or trainNumber>\nExample: 7 12301 or 7 Rajdhani";
        }
        String q = String.join(" ", Arrays.copyOfRange(parts, 1, parts.length));
        List<TrainResponse> results = trainService.searchTrains(q);
        if (results.isEmpty()) {
            return "❌ No trains found matching query: '" + q + "'";
        }
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Found %d train(s) matching '%s':\n", results.size(), q));
        sb.append("---------------------------------------------------------------------------------------\n");
        for (TrainResponse t : results) {
            sb.append(String.format("🚆 #%s - %s (%s ➔ %s)\n    Status: %s | Delay: %d min | Expected: Platform %s | Passengers: %d\n",
                    t.trainNumber(), t.name(), t.sourceStation(), t.destinationStation(), t.status(), t.delayMinutes(), t.expectedPlatform() > 0 ? t.expectedPlatform() : 1, t.currentPassengers()));
        }
        return sb.toString();
    }

    private String renderPassengerReport() {
        List<TrainResponse> trains = trainService.getAllTrains();
        List<PlatformResponse> platforms = platformService.getAllPlatforms();
        StringBuilder sb = new StringBuilder();
        sb.append("==============================================================\n");
        sb.append("                   PASSENGER DISTRIBUTION REPORT              \n");
        sb.append("==============================================================\n");
        sb.append(" [PLATFORM PASSENGER BREAKDOWN]\n");
        for (PlatformResponse p : platforms) {
            int bars = (int) (p.occupancyRate() * 20);
            String meter = "█".repeat(Math.max(0, Math.min(20, bars))) + "░".repeat(Math.max(0, 20 - bars));
            sb.append(String.format(" %-14s : [%s] %d/%d (%.1f%%)\n", p.name(), meter, p.currentCrowd(), p.capacity(), p.occupancyRate() * 100));
        }
        sb.append("\n [TRAIN ON-BOARD LOAD]\n");
        for (TrainResponse t : trains.stream().limit(8).toList()) {
            sb.append(String.format(" • %-6s %-20s : %d / %d passengers (Load: %d%%)\n",
                    t.trainNumber(), truncate(t.name(), 20), t.currentPassengers(), t.totalCapacity(), t.totalCapacity() > 0 ? (int)((double)t.currentPassengers()/t.totalCapacity()*100) : 0));
        }
        sb.append("==============================================================\n");
        return sb.toString();
    }

    private String renderSystemInfo() {
        Runtime rt = Runtime.getRuntime();
        long totalMem = rt.totalMemory() / (1024 * 1024);
        long freeMem = rt.freeMemory() / (1024 * 1024);
        long usedMem = totalMem - freeMem;
        int activeThreads = Thread.activeCount();

        StringBuilder sb = new StringBuilder();
        sb.append("==============================================================\n");
        sb.append("                   RAILFLOW SYSTEM ARCHITECTURE               \n");
        sb.append("==============================================================\n");
        sb.append(String.format(" Java Runtime Version : %s (%s)\n", System.getProperty("java.version"), System.getProperty("java.vendor")));
        sb.append(String.format(" Operating System     : %s (%s - %s)\n", System.getProperty("os.name"), System.getProperty("os.arch"), System.getProperty("os.version")));
        sb.append(String.format(" Available Processors : %d Cores\n", rt.availableProcessors()));
        sb.append(String.format(" JVM Memory Allocated : %d MB / %d MB (Used: %d MB)\n", usedMem, totalMem, usedMem));
        sb.append(String.format(" Active Thread Pool   : %d Threads\n", activeThreads));
        sb.append(String.format(" JVM Uptime           : %d seconds\n", ManagementFactory.getRuntimeMXBean().getUptime() / 1000));
        sb.append(" Storage Engine       : SQLite (data/database/railflow.db)\n");
        sb.append(" In-Memory Datastore  : ConcurrentHashMap Registries (Sub-ms O(1))\n");
        sb.append(" Algorithms Active    : Heuristic DSA Platform Optimization (Least Crowded & Capacity)\n");
        sb.append("==============================================================\n");
        return sb.toString();
    }

    private String truncate(String str, int max) {
        if (str == null) return "";
        return str.length() > max ? str.substring(0, max - 3) + "..." : str;
    }
}
