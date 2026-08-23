package com.railflow.config;

import com.railflow.io.CsvParser;
import com.railflow.io.RailwayDataValidator;
import com.railflow.model.RailwayRecord;
import com.railflow.repository.RailwayRecordRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Enterprise SQLite Database Initializer and Master CSV Ingestion Engine.
 * Creates schemas, applies indexes, and ingests all 13,849 empirical CSV records into SQLite.
 */
@Component
public class DatabaseInitializer {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final JdbcTemplate jdbcTemplate;
    private final RailwayRecordRepository railwayRecordRepository;

    @Autowired
    public DatabaseInitializer(JdbcTemplate jdbcTemplate, RailwayRecordRepository railwayRecordRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.railwayRecordRepository = railwayRecordRepository;
    }

    @PostConstruct
    public void initializeDatabase() {
        try {
            // Ensure data/database directory exists
            File dbDir = new File("data/database");
            if (!dbDir.exists()) {
                boolean created = dbDir.mkdirs();
                log.info("Created SQLite database directory: {} (success: {})", dbDir.getAbsolutePath(), created);
            }

            // 1. Create feedback table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS feedback (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rating INTEGER NOT NULL,
                    category TEXT NOT NULL,
                    message TEXT NOT NULL,
                    page TEXT,
                    created_at TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'NEW'
                );
            """);

            // 2. Create pnr_records table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS pnr_records (
                    pnr_number TEXT PRIMARY KEY,
                    train_number TEXT NOT NULL,
                    train_name TEXT NOT NULL,
                    travel_date TEXT NOT NULL,
                    class_type TEXT NOT NULL,
                    chart_status TEXT NOT NULL,
                    from_station_code TEXT NOT NULL,
                    from_station_name TEXT NOT NULL,
                    to_station_code TEXT NOT NULL,
                    to_station_name TEXT NOT NULL,
                    boarding_code TEXT,
                    boarding_name TEXT,
                    booking_status TEXT NOT NULL,
                    current_status TEXT NOT NULL,
                    passengers_json TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_pnr_train ON pnr_records(train_number);");

            // 3. Create railway_records master table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS railway_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    source_pdf TEXT,
                    source_page TEXT,
                    year TEXT,
                    category TEXT,
                    broad_gauge_metric REAL,
                    metre_gauge_metric REAL,
                    narrow_gauge_metric REAL,
                    total_metric REAL,
                    is_valid INTEGER NOT NULL DEFAULT 1
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_records_year ON railway_records(year);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_records_category ON railway_records(category);");

            // 4. Create trains table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS trains (
                    id TEXT PRIMARY KEY,
                    train_number TEXT NOT NULL UNIQUE,
                    name TEXT NOT NULL,
                    type TEXT,
                    source TEXT,
                    destination TEXT,
                    status TEXT,
                    delay_minutes INTEGER DEFAULT 0,
                    expected_platform INTEGER DEFAULT 1,
                    total_seats INTEGER DEFAULT 1000,
                    booked_seats INTEGER DEFAULT 750,
                    coaches INTEGER DEFAULT 22,
                    route TEXT
                );
            """);

            // 5. Create stations table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS stations (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    code TEXT NOT NULL UNIQUE,
                    zone TEXT,
                    total_platforms INTEGER DEFAULT 4
                );
            """);

            // 6. Create platforms table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS platforms (
                    id TEXT PRIMARY KEY,
                    platform_number INTEGER NOT NULL,
                    station_code TEXT NOT NULL,
                    capacity INTEGER NOT NULL,
                    current_crowd INTEGER NOT NULL,
                    status TEXT NOT NULL,
                    assigned_train_id TEXT,
                    safety_score REAL DEFAULT 95.0
                );
            """);

            // 7. Create alerts table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS alerts (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    message TEXT NOT NULL,
                    severity TEXT NOT NULL,
                    type TEXT NOT NULL,
                    platform_id TEXT,
                    train_id TEXT,
                    timestamp TEXT NOT NULL,
                    acknowledged INTEGER NOT NULL DEFAULT 0,
                    resolved INTEGER NOT NULL DEFAULT 0
                );
            """);

            log.info("SQLite database tables verified/created successfully in railflow.db");

            // 8. Ingest Master CSV Data if table is empty
            long recordCount = railwayRecordRepository.count();
            if (recordCount == 0) {
                ingestCsvDataToSqlite();
            } else {
                log.info("SQLite 'railway_records' already contains {} records. Skipping CSV ingestion.", recordCount);
            }

            // 9. Seed baseline feedback if empty
            Integer feedbackCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM feedback", Integer.class);
            if (feedbackCount != null && feedbackCount == 0) {
                seedInitialFeedback();
            }

            // 10. Seed baseline PNR records if empty
            Integer pnrCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM pnr_records", Integer.class);
            if (pnrCount != null && pnrCount == 0) {
                seedInitialPnrRecords();
            }

        } catch (Exception e) {
            log.error("Failed to initialize SQLite database schema or CSV data: {}", e.getMessage(), e);
        }
    }

    private void ingestCsvDataToSqlite() {
        File csvFile = findFile("ALL_RAILWAY_DATA.csv", Arrays.asList(
                "data/railway/ALL_RAILWAY_DATA.csv",
                "../data/railway/ALL_RAILWAY_DATA.csv",
                "JAVA/ALL_RAILWAY_DATA.csv",
                "../JAVA/ALL_RAILWAY_DATA.csv",
                "d:/CS-ML-JAVA/JAVA/ALL_RAILWAY_DATA.csv",
                "d:/CS-ML-JAVA/RailFlow/data/railway/ALL_RAILWAY_DATA.csv"
        ));

        if (csvFile == null || !csvFile.exists()) {
            log.warn("ALL_RAILWAY_DATA.csv not found for SQLite ingestion.");
            return;
        }

        log.info("Starting batch ingestion of CSV data from {} into SQLite...", csvFile.getAbsolutePath());
        long startTime = System.currentTimeMillis();

        RailwayDataValidator validator = new RailwayDataValidator();
        List<RailwayRecord> batchList = new ArrayList<>(14000);

        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile, StandardCharsets.UTF_8))) {
            String line;
            boolean isHeader = true;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                if (isHeader) {
                    isHeader = false;
                    continue;
                }
                List<String> cols = CsvParser.parseLine(line);
                RailwayRecord record = validator.validateAndCreate(cols);
                batchList.add(record);
            }

            railwayRecordRepository.batchInsert(batchList);
            long elapsed = System.currentTimeMillis() - startTime;
            log.info("Batch ingestion completed: Ingested {} rows into SQLite in {} ms.", batchList.size(), elapsed);

        } catch (IOException e) {
            log.error("Error reading CSV for SQLite ingestion: {}", e.getMessage(), e);
        }
    }

    private void seedInitialFeedback() {
        String seedSql = """
            INSERT INTO feedback (rating, category, message, page, created_at, status)
            VALUES (?, ?, ?, ?, datetime('now'), ?)
        """;

        jdbcTemplate.update(seedSql, 5, "UI_UX", "The dashboard is very intuitive and real-time telemetry updates seamlessly.", "Dashboard", "REVIEWED");
        jdbcTemplate.update(seedSql, 5, "OPTIMIZATION", "Platform reallocation heuristics saved our station controller considerable time.", "Optimization", "REVIEWED");
        jdbcTemplate.update(seedSql, 4, "TRAIN_INFORMATION", "Train tracking and timetable lookup are fast and accurate.", "Train Explorer", "REVIEWED");
        jdbcTemplate.update(seedSql, 5, "DATA_ACCURACY", "The historical dataset explorer is fantastic for divisional railway research.", "Data Explorer", "REVIEWED");
        jdbcTemplate.update(seedSql, 4, "PERFORMANCE", "Zero latency client responsiveness even during high crowd simulation ticks.", "Crowd Monitoring", "NEW");

        log.info("Seeded initial realistic feedback entries into SQLite database.");
    }

    private void seedInitialPnrRecords() {
        String insertSql = """
            INSERT INTO pnr_records (
                pnr_number, train_number, train_name, travel_date, class_type,
                chart_status, from_station_code, from_station_name,
                to_station_code, to_station_name, boarding_code, boarding_name,
                booking_status, current_status, passengers_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """;

        jdbcTemplate.update(insertSql,
                "6223797269", "12303", "POORVA EXPRESS", "24-08-2026", "SL",
                "CHART PREPARED", "JSME", "JASIDIH JUNCTION", "NDLS", "NEW DELHI",
                "JSME", "JASIDIH JUNCTION", "CNF", "CNF (Confirmed)",
                "[{\"passengerNo\":1,\"bookingStatus\":\"CNF\",\"currentStatus\":\"CNF\",\"coach\":\"S4\",\"berth\":\"32 (MB)\",\"quota\":\"GN\"},{\"passengerNo\":2,\"bookingStatus\":\"CNF\",\"currentStatus\":\"CNF\",\"coach\":\"S4\",\"berth\":\"33 (LB)\",\"quota\":\"GN\"}]"
        );

        jdbcTemplate.update(insertSql,
                "0123456789", "12301", "HOWRAH RAJDHANI EXPRESS", "Today", "2A",
                "CHART PREPARED", "NDLS", "NEW DELHI", "HWH", "HOWRAH JUNCTION",
                "NDLS", "NEW DELHI", "CNF", "CNF (Confirmed)",
                "[{\"passengerNo\":1,\"bookingStatus\":\"CNF\",\"currentStatus\":\"CNF\",\"coach\":\"A2\",\"berth\":\"18 (UB)\",\"quota\":\"GN\"},{\"passengerNo\":2,\"bookingStatus\":\"CNF\",\"currentStatus\":\"CNF\",\"coach\":\"A2\",\"berth\":\"19 (SL)\",\"quota\":\"GN\"}]"
        );

        jdbcTemplate.update(insertSql,
                "8492019482", "20608", "VANDE BHARAT EXPRESS", "25-08-2026", "CC",
                "CHART PREPARED", "MAS", "CHENNAI CENTRAL", "SBC", "KSR BENGALURU",
                "MAS", "CHENNAI CENTRAL", "CNF", "CNF (Confirmed)",
                "[{\"passengerNo\":1,\"bookingStatus\":\"CNF\",\"currentStatus\":\"CNF\",\"coach\":\"C3\",\"berth\":\"42 (W)\",\"quota\":\"GN\"}]"
        );

        jdbcTemplate.update(insertSql,
                "4519283746", "12951", "MUMBAI RAJDHANI EXPRESS", "26-08-2026", "3A",
                "CHART PREPARED", "MMCT", "MUMBAI CENTRAL", "NDLS", "NEW DELHI",
                "MMCT", "MUMBAI CENTRAL", "RAC", "RAC 3 (Confirmed Berth Likely)",
                "[{\"passengerNo\":1,\"bookingStatus\":\"RAC 8\",\"currentStatus\":\"RAC 3\",\"coach\":\"B4\",\"berth\":\"71 (SL)\",\"quota\":\"GN\"}]"
        );

        jdbcTemplate.update(insertSql,
                "2948175039", "12123", "DECCAN QUEEN SUPERFAST", "27-08-2026", "2S",
                "CHART NOT PREPARED", "CSMT", "MUMBAI CSMT", "PUNE", "PUNE JUNCTION",
                "CSMT", "MUMBAI CSMT", "CNF", "CNF (Confirmed)",
                "[{\"passengerNo\":1,\"bookingStatus\":\"CNF\",\"currentStatus\":\"CNF\",\"coach\":\"D2\",\"berth\":\"14 (WS)\",\"quota\":\"GN\"}]"
        );

        log.info("Seeded initial realistic IRCTC PNR records into SQLite database.");
    }

    private File findFile(String filename, List<String> paths) {
        for (String p : paths) {
            File f = new File(p);
            if (f.exists() && f.isFile()) {
                return f;
            }
        }
        return null;
    }
}
