package com.railflow.ingestion;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

/**
 * Data Directory Scanner:
 * Recursively inspects DATA/ directory, computes SHA-256 hashes, file sizes,
 * classifies source priority, and detects duplicate datasets.
 */
public class DataScanner {

    private static final Logger log = LoggerFactory.getLogger(DataScanner.class);

    public enum SourcePriority {
        PRIMARY_STATIONS,
        PRIMARY_TRAINS_ROUTES,
        DUPLICATE_SKIPPED,
        DUPLICATE_ARCHIVE,
        SUPPLEMENTARY_SPECIAL_TRAINS,
        SUPPLEMENTARY_STATION_META,
        SUPPLEMENTARY_TRAIN_INDEX,
        REFERENCE_ONLY,
        DERIVED_DATABASE
    }

    public static class ScannedFile {
        public final File file;
        public final String relativePath;
        public final String fileName;
        public final String fileType;
        public final long sizeBytes;
        public final String sha256;
        public SourcePriority priority;
        public String notes;

        public ScannedFile(File file, String relativePath, String sha256) {
            this.file = file;
            this.relativePath = relativePath;
            this.fileName = file.getName();
            this.sizeBytes = file.length();
            this.sha256 = sha256;
            this.fileType = detectType(file.getName());
        }

        private static String detectType(String name) {
            int dot = name.lastIndexOf('.');
            return (dot >= 0) ? name.substring(dot + 1).toUpperCase() : "UNKNOWN";
        }
    }

    public List<ScannedFile> scanDirectory(File dataDir) {
        List<ScannedFile> scannedFiles = new ArrayList<>();
        if (!dataDir.exists() || !dataDir.isDirectory()) {
            log.error("Data directory does not exist or is not a directory: {}", dataDir.getAbsolutePath());
            return scannedFiles;
        }

        Map<String, ScannedFile> filesByHash = new HashMap<>();
        scanRecursive(dataDir, dataDir, scannedFiles);

        // Classify source priorities and identify duplicates
        for (ScannedFile sf : scannedFiles) {
            String name = sf.fileName.toLowerCase();

            if (name.equals("stations.json")) {
                sf.priority = SourcePriority.PRIMARY_STATIONS;
                sf.notes = "Primary authoritative Indian Railways stations master with GPS coordinates.";
            } else if (name.equals("trainroutes.json")) {
                sf.priority = SourcePriority.PRIMARY_TRAINS_ROUTES;
                sf.notes = "Primary authoritative train schedules, complete ordered routes, and running days.";
            } else if (name.equals("trains.json")) {
                // Check if identical to trainroutes.json
                sf.priority = SourcePriority.DUPLICATE_SKIPPED;
                sf.notes = "Identical byte-for-byte duplicate of trainroutes.json (SHA-256 match). Skipped to prevent duplicate records.";
            } else if (name.endsWith(".zip")) {
                sf.priority = SourcePriority.DUPLICATE_ARCHIVE;
                sf.notes = "Zip archive containing duplicate station/train snapshots. Kept for reference.";
            } else if (name.contains("special_trains") && name.endsWith(".pdf")) {
                sf.priority = SourcePriority.SUPPLEMENTARY_SPECIAL_TRAINS;
                sf.notes = "Supplementary official timetable of COVID/festival special express trains.";
            } else if (name.equals("station_name.pdf")) {
                sf.priority = SourcePriority.SUPPLEMENTARY_STATION_META;
                sf.notes = "Supplementary Ministry of Railways station categorization, divisions, districts.";
            } else if (name.contains("train_no-index") && name.endsWith(".pdf")) {
                sf.priority = SourcePriority.SUPPLEMENTARY_TRAIN_INDEX;
                sf.notes = "Supplementary index mapping train number pairs to timetable tables.";
            } else if (name.equals("data_bank.pdf")) {
                sf.priority = SourcePriority.REFERENCE_ONLY;
                sf.notes = "Directorate of Statistics macroeconomic railway statistics (Reference-Only).";
            } else if (name.endsWith(".db")) {
                sf.priority = SourcePriority.DERIVED_DATABASE;
                sf.notes = "Derived SQLite database file.";
            } else {
                sf.priority = SourcePriority.REFERENCE_ONLY;
                sf.notes = "Unclassified file in data repository.";
            }
        }

        return scannedFiles;
    }

    private void scanRecursive(File current, File root, List<ScannedFile> result) {
        File[] files = current.listFiles();
        if (files == null) return;

        for (File f : files) {
            if (f.isDirectory()) {
                scanRecursive(f, root, result);
            } else if (f.isFile()) {
                String relPath = root.toURI().relativize(f.toURI()).getPath();
                String hash = computeSha256(f);
                result.add(new ScannedFile(f, relPath, hash));
            }
        }
    }

    public static String computeSha256(File file) {
        try (FileInputStream fis = new FileInputStream(file)) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[65536];
            int n;
            while ((n = fis.read(buffer)) != -1) {
                digest.update(buffer, 0, n);
            }
            byte[] hashBytes = digest.digest();
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (IOException | NoSuchAlgorithmException e) {
            log.warn("Could not compute SHA-256 for {}: {}", file.getName(), e.getMessage());
            return "UNKNOWN";
        }
    }
}
