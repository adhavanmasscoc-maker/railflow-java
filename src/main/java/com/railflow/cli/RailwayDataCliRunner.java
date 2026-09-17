package com.railflow.cli;

import com.railflow.database.DatabaseManager;
import com.railflow.ingestion.DataIngestionEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Arrays;

/**
 * Command Line Runner for Railway Data Ingestion.
 * Handles CLI flags:
 *   --import-data       : Standard complete import and graph construction
 *   --rebuild-database  : Drops derived tables and rebuilds fresh from DATA/
 *   --update-data       : Incremental import
 */
@Component
public class RailwayDataCliRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RailwayDataCliRunner.class);

    private final DatabaseManager databaseManager;

    public RailwayDataCliRunner() {
        this.databaseManager = new DatabaseManager();
    }

    public RailwayDataCliRunner(DatabaseManager databaseManager) {
        this.databaseManager = databaseManager;
    }

    @Override
    public void run(String... args) {
        if (args == null || args.length == 0) {
            return;
        }

        boolean importData = Arrays.asList(args).contains("--import-data");
        boolean rebuildDb = Arrays.asList(args).contains("--rebuild-database");
        boolean updateData = Arrays.asList(args).contains("--update-data");

        if (importData || rebuildDb || updateData) {
            executeImport(rebuildDb, updateData);
        }
    }

    public DataIngestionEngine.ImportMetrics executeImport(boolean rebuild, boolean incremental) {
        File dataDir = findDataDirectory();
        log.info("Found DATA directory at: {}", dataDir.getAbsolutePath());

        DataIngestionEngine engine = new DataIngestionEngine(databaseManager);
        return engine.runImport(dataDir, rebuild, incremental);
    }

    private File findDataDirectory() {
        String[] paths = {"DATA", "data", "../DATA", "../../DATA"};
        for (String p : paths) {
            File f = new File(p);
            if (f.exists() && f.isDirectory()) {
                return f;
            }
        }
        return new File("DATA");
    }

    public static void main(String[] args) {
        System.out.println("Executing RailFlow Railway Data CLI Tool with args: " + Arrays.toString(args));
        boolean rebuild = Arrays.asList(args).contains("--rebuild-database");
        boolean incremental = Arrays.asList(args).contains("--update-data");

        RailwayDataCliRunner runner = new RailwayDataCliRunner(new DatabaseManager());
        runner.executeImport(rebuild, incremental);
    }
}
