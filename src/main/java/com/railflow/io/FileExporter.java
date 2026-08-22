package com.railflow.io;

import com.railflow.model.CrowdSnapshot;
import com.railflow.model.Platform;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Demonstrates Java File output using BufferedWriter for report export.
 */
@Component
public class FileExporter {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Exports current platform states into a clean CSV format.
     */
    public void exportPlatformsToCsv(Path destination, List<Platform> platforms) throws IOException {
        if (destination.getParent() != null) {
            Files.createDirectories(destination.getParent());
        }

        try (BufferedWriter writer = Files.newBufferedWriter(destination, StandardCharsets.UTF_8)) {
            writer.write("PlatformID,PlatformName,Capacity,CurrentCrowd,OccupancyPercentage,Status,ActiveGates\n");
            for (Platform p : platforms) {
                writer.write(String.format("%s,\"%s\",%d,%d,%.2f,%s,%d\n",
                        p.getId(),
                        p.getName(),
                        p.getCapacity(),
                        p.getCurrentCrowd(),
                        p.getOccupancyRate() * 100,
                        p.getStatus(),
                        p.getActiveGateCount()));
            }
        }
    }

    /**
     * Exports historical crowd snapshots to a summary TXT file.
     */
    public void exportSnapshotsToTxt(Path destination, List<CrowdSnapshot> snapshots) throws IOException {
        if (destination.getParent() != null) {
            Files.createDirectories(destination.getParent());
        }

        try (BufferedWriter writer = Files.newBufferedWriter(destination, StandardCharsets.UTF_8)) {
            writer.write("=========================================================================\n");
            writer.write("              RAILFLOW CROWD MONITORING SNAPSHOT AUDIT REPORT            \n");
            writer.write("=========================================================================\n\n");

            for (CrowdSnapshot s : snapshots) {
                writer.write(String.format("[%s] Total Crowd: %d | Total Capacity: %d | Avg Occupancy: %.1f%% | Critical: %d | Alerts: %d\n",
                        s.timestamp().format(FORMATTER),
                        s.totalCrowd(),
                        s.totalCapacity(),
                        s.averageOccupancyRate() * 100,
                        s.criticalPlatformCount(),
                        s.activeAlertCount()));
            }
            writer.write("\nEnd of Audit Log.\n");
        }
    }
}
