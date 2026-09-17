package com.railflow.config;

import com.railflow.io.CsvParser;
import com.railflow.io.RailwayDataValidator;
import com.railflow.model.RailwayRecord;
import com.railflow.repository.RailwayRecordRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.railflow.model.Station;
import com.railflow.model.Train;
import com.railflow.model.TrainStop;
import com.railflow.service.RailwayDataLoader;
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
import java.util.Map;

/**
 * Enterprise SQLite Database Initializer and Master CSV Ingestion Engine.
 * Creates schemas, applies indexes, and ingests all 13,849 empirical CSV records into SQLite.
 */
@Component
public class DatabaseInitializer {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final JdbcTemplate jdbcTemplate;
    private final RailwayRecordRepository railwayRecordRepository;
    private final RailwayDataLoader railwayDataLoader;

    @Autowired
    public DatabaseInitializer(JdbcTemplate jdbcTemplate, RailwayRecordRepository railwayRecordRepository, RailwayDataLoader railwayDataLoader) {
        this.jdbcTemplate = jdbcTemplate;
        this.railwayRecordRepository = railwayRecordRepository;
        this.railwayDataLoader = railwayDataLoader;
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
                    name TEXT DEFAULT 'Operations Controller',
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

            // 4. Create stations table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS stations (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    code TEXT NOT NULL UNIQUE,
                    city TEXT,
                    zone TEXT,
                    total_platforms INTEGER DEFAULT 4,
                    latitude REAL DEFAULT 0.0,
                    longitude REAL DEFAULT 0.0,
                    status TEXT DEFAULT 'OPERATIONAL'
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_stn_code ON stations(code);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_stn_name ON stations(name);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_stn_city ON stations(city);");

            // 5. Create search_aliases table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS search_aliases (
                    id TEXT PRIMARY KEY,
                    alias TEXT NOT NULL,
                    station_code TEXT NOT NULL,
                    alias_type TEXT DEFAULT 'COMMON'
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_alias_name ON search_aliases(alias);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_alias_code ON search_aliases(station_code);");

            // 6. Create trains table
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
                    route TEXT,
                    frequency TEXT DEFAULT 'Daily'
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_train_no ON trains(train_number);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_train_name ON trains(name);");

            // 7. Create train_routes table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS train_routes (
                    id TEXT PRIMARY KEY,
                    train_number TEXT NOT NULL,
                    station_code TEXT NOT NULL,
                    station_name TEXT NOT NULL,
                    sequence_number INTEGER NOT NULL,
                    arrival_time TEXT,
                    departure_time TEXT,
                    distance_km REAL,
                    platform INTEGER DEFAULT 1
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_route_train ON train_routes(train_number);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_route_stn ON train_routes(station_code);");

            // 8. Create corridors and station_connections tables
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS corridors (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    origin_code TEXT NOT NULL,
                    destination_code TEXT NOT NULL,
                    distance_km REAL,
                    average_time_mins INTEGER,
                    primary_zone TEXT
                );
            """);
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS station_connections (
                    id TEXT PRIMARY KEY,
                    source_station_code TEXT NOT NULL,
                    destination_station_code TEXT NOT NULL,
                    distance_km REAL,
                    corridor_name TEXT,
                    travel_minutes INTEGER,
                    connection_type TEXT DEFAULT 'TRUNK'
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_conn_src ON station_connections(source_station_code);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_conn_dst ON station_connections(destination_station_code);");

            // 8b. Create rail_edges table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS rail_edges (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    from_station_code TEXT NOT NULL,
                    to_station_code TEXT NOT NULL,
                    train_number TEXT NOT NULL,
                    distance_km REAL DEFAULT 0.0
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_edge_from ON rail_edges(from_station_code);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_edge_to ON rail_edges(to_station_code);");

            // 9. Create platforms table
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
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_plt_stn ON platforms(station_code);");

            // 10. Create crowd_telemetry table
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS crowd_telemetry (
                    id TEXT PRIMARY KEY,
                    platform_id TEXT NOT NULL,
                    station_code TEXT NOT NULL,
                    platform_number INTEGER NOT NULL,
                    passenger_count INTEGER NOT NULL,
                    capacity INTEGER NOT NULL,
                    density_percentage REAL NOT NULL,
                    status TEXT NOT NULL,
                    timestamp TEXT NOT NULL
                );
            """);
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_tel_stn ON crowd_telemetry(station_code);");
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_tel_time ON crowd_telemetry(timestamp);");

            // 11. Create alerts table
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

            // 12. Seed Stations & Aliases if empty
            Integer stationCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM stations", Integer.class);
            if (stationCount != null && stationCount == 0) {
                seedStationsAndAliases();
            }

            // 13. Seed Corridors & Station Connections if empty
            Integer corridorCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM corridors", Integer.class);
            if (corridorCount != null && corridorCount == 0) {
                seedCorridorsAndConnections();
            }

            // 14. Seed Trains & Train Routes if empty
            Integer trainCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM trains", Integer.class);
            if (trainCount != null && trainCount == 0) {
                seedTrainsAndRoutes();
            }

            // 15. Seed Platforms & Initial Telemetry if empty
            Integer platformCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM platforms", Integer.class);
            if (platformCount != null && platformCount == 0) {
                seedPlatformsAndInitialTelemetry();
            }

            // 16. Ingest Master CSV Data if table is empty
            long recordCount = railwayRecordRepository.count();
            if (recordCount == 0) {
                ingestCsvDataToSqlite();
            } else {
                log.info("SQLite 'railway_records' already contains {} records. Skipping CSV ingestion.", recordCount);
            }

            // 17. Seed baseline feedback if empty
            Integer feedbackCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM feedback", Integer.class);
            if (feedbackCount != null && feedbackCount == 0) {
                seedInitialFeedback();
            }

            // 18. Seed baseline PNR records if empty
            Integer pnrCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM pnr_records", Integer.class);
            if (pnrCount != null && pnrCount == 0) {
                seedInitialPnrRecords();
            }

        } catch (Exception e) {
            log.error("Failed to initialize SQLite database schema or CSV data: {}", e.getMessage(), e);
        }
    }

    private void seedStationsAndAliases() {
        log.info("Seeding Indian Railways Hubs & Stations into SQLite from master dataset...");
        List<Station> realStations = railwayDataLoader.getStationMapper().getAllStations();
        String stnSql = "INSERT OR REPLACE INTO stations (id, code, name, city, zone, total_platforms, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        if (!realStations.isEmpty()) {
            int batchSize = 1000;
            for (int i = 0; i < realStations.size(); i += batchSize) {
                List<Station> batch = realStations.subList(i, Math.min(i + batchSize, realStations.size()));
                jdbcTemplate.batchUpdate(stnSql, batch, batch.size(), (ps, s) -> {
                    ps.setString(1, "STN-" + s.getCode());
                    ps.setString(2, s.getCode());
                    ps.setString(3, s.getName());
                    ps.setString(4, s.getAddress().isEmpty() ? s.getCity() : s.getAddress());
                    ps.setString(5, s.getZone().isEmpty() ? "IR" : s.getZone());
                    ps.setInt(6, s.getPlatformCount());
                    ps.setDouble(7, s.getLatitude());
                    ps.setDouble(8, s.getLongitude());
                    ps.setString(9, "OPERATIONAL");
                });
            }
            log.info("Successfully ingested {} real stations into SQLite.", realStations.size());
        }

        // Aliases mapping colloquial and partial names to station codes
        String aliasSql = "INSERT OR IGNORE INTO search_aliases (id, alias, station_code, alias_type) VALUES (?, ?, ?, ?)";
        Object[][] aliases = {
            {"ALS-1",  "TRICH", "TPJ", "PREFIX"},
            {"ALS-2",  "TRICHY", "TPJ", "COMMON"},
            {"ALS-3",  "TIRUCHY", "TPJ", "COMMON"},
            {"ALS-4",  "TIRUCHIRAPPALLI", "TPJ", "EXACT"},
            {"ALS-5",  "TAMB", "TBM", "PREFIX"},
            {"ALS-6",  "TAMBARAM", "TBM", "EXACT"},
            {"ALS-7",  "CHENNAI", "MAS", "METRO"},
            {"ALS-8",  "CHENNAI CENTRAL", "MAS", "EXACT"},
            {"ALS-9",  "MADRAS", "MAS", "HISTORICAL"},
            {"ALS-10", "EGMORE", "MS", "COMMON"},
            {"ALS-11", "CHENNAI EGMORE", "MS", "EXACT"},
            {"ALS-12", "MUMBAI", "CSTM", "METRO"},
            {"ALS-13", "BOMBAY", "CSTM", "HISTORICAL"},
            {"ALS-14", "VT", "CSTM", "HISTORICAL"},
            {"ALS-15", "MUMBAI CENTRAL", "BCT", "EXACT"},
            {"ALS-16", "DELHI", "NDLS", "METRO"},
            {"ALS-17", "NEW DELHI", "NDLS", "EXACT"},
            {"ALS-18", "HOWRAH", "HWH", "EXACT"},
            {"ALS-19", "KOLKATA", "HWH", "METRO"},
            {"ALS-20", "CALCUTTA", "HWH", "HISTORICAL"},
            {"ALS-21", "BANGALORE", "SBC", "HISTORICAL"},
            {"ALS-22", "BENGALURU", "SBC", "METRO"},
            {"ALS-23", "PUNE", "PUNE", "EXACT"},
            {"ALS-24", "POONA", "PUNE", "HISTORICAL"},
            {"ALS-25", "MADURAI", "MDU", "EXACT"},
            {"ALS-26", "TEMPLE CITY", "MDU", "ALIAS"},
            {"ALS-27", "COIMBATORE", "CBE", "EXACT"},
            {"ALS-28", "KOVAI", "CBE", "ALIAS"},
            {"ALS-29", "KANPUR", "CNB", "EXACT"},
            {"ALS-30", "AHMEDABAD", "ADI", "EXACT"},
            {"ALS-31", "HYDERABAD", "HYB", "METRO"},
            {"ALS-32", "SECUNDERABAD", "SC", "EXACT"},
            {"ALS-33", "JAIPUR", "JP", "EXACT"},
            {"ALS-34", "VARANASI", "BSB", "EXACT"},
            {"ALS-35", "BANARAS", "BSB", "HISTORICAL"},
            {"ALS-36", "GORAKHPUR", "GKP", "EXACT"},
            {"ALS-37", "PATNA", "PNBE", "EXACT"},
            {"ALS-38", "BHOPAL", "BPL", "EXACT"},
            {"ALS-39", "NAGPUR", "NGP", "EXACT"}
        };

        for (Object[] row : aliases) {
            jdbcTemplate.update(aliasSql, row);
        }
        log.info("Successfully seeded stations and search aliases.");
    }

    private void seedCorridorsAndConnections() {
        log.info("Seeding Inter-Hub Corridors and Station Connections...");
        String corrSql = "INSERT OR IGNORE INTO corridors (id, name, origin_code, destination_code, distance_km, average_time_mins, primary_zone) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Object[][] corridors = {
            {"CORR-01", "Northern Trunk (Delhi - Howrah)", "NDLS", "HWH", 1445.0, 1050, "NR/ER"},
            {"CORR-02", "Western Trunk (Delhi - Mumbai)", "NDLS", "MMCT", 1384.0, 950, "NR/WR"},
            {"CORR-03", "Grand Trunk (Delhi - Chennai)", "NDLS", "MAS", 2180.0, 1740, "NR/SR"},
            {"CORR-04", "Central Corridor (Mumbai - Chennai)", "CSMT", "MAS", 1281.0, 1260, "CR/SR"},
            {"CORR-05", "South Coast Corridor (Chennai - Madurai)", "MS", "MDU", 495.0, 450, "SR"},
            {"CORR-06", "Silicon Corridor (Chennai - Bengaluru)", "MAS", "SBC", 362.0, 270, "SR/SWR"}
        };
        for (Object[] row : corridors) {
            jdbcTemplate.update(corrSql, row);
        }

        String connSql = "INSERT OR IGNORE INTO station_connections (id, source_station_code, destination_station_code, distance_km, corridor_name, travel_minutes, connection_type) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Object[][] conns = {
            {"CONN-01", "NDLS", "AGC", 195.0, "Western Trunk", 120, "TRUNK"},
            {"CONN-02", "AGC", "GWL", 118.0, "Grand Trunk", 75, "TRUNK"},
            {"CONN-03", "GWL", "BPL", 398.0, "Grand Trunk", 310, "TRUNK"},
            {"CONN-04", "BPL", "NGP", 390.0, "Grand Trunk", 320, "TRUNK"},
            {"CONN-05", "NGP", "SC", 575.0, "Grand Trunk", 510, "TRUNK"},
            {"CONN-06", "SC", "MAS", 698.0, "Grand Trunk", 660, "TRUNK"},
            {"CONN-07", "NDLS", "CNB", 440.0, "Northern Trunk", 290, "TRUNK"},
            {"CONN-08", "CNB", "BSB", 320.0, "Northern Trunk", 240, "TRUNK"},
            {"CONN-09", "BSB", "PNBE", 230.0, "Northern Trunk", 180, "TRUNK"},
            {"CONN-10", "PNBE", "HWH", 530.0, "Northern Trunk", 420, "TRUNK"},
            {"CONN-11", "NDLS", "JP", 308.0, "Western Trunk", 260, "TRUNK"},
            {"CONN-12", "JP", "ADI", 625.0, "Western Trunk", 540, "TRUNK"},
            {"CONN-13", "ADI", "MMCT", 491.0, "Western Trunk", 380, "TRUNK"},
            {"CONN-14", "MMCT", "CSMT", 10.0, "Mumbai Suburban", 25, "INTERCONNECT"},
            {"CONN-15", "CSMT", "PUNE", 192.0, "Deccan Corridor", 180, "TRUNK"},
            {"CONN-16", "PUNE", "SC", 598.0, "Central Corridor", 540, "TRUNK"},
            {"CONN-17", "PUNE", "MAS", 1089.0, "Central Corridor", 1080, "TRUNK"},
            {"CONN-18", "MAS", "MS", 4.0, "Chennai Urban Interconnect", 10, "INTERCONNECT"},
            {"CONN-19", "MS", "TBM", 27.0, "South Coast Corridor", 35, "SUBURBAN"},
            {"CONN-20", "MAS", "SBC", 362.0, "Silicon Corridor", 270, "TRUNK"},
            {"CONN-21", "MAS", "SA", 334.0, "Southern Trunk", 290, "TRUNK"},
            {"CONN-22", "SA", "CBE", 160.0, "Kongu Express Route", 150, "TRUNK"},
            {"CONN-23", "SA", "TPJ", 140.0, "Cauvery Route", 130, "TRUNK"},
            {"CONN-24", "TPJ", "MDU", 161.0, "Pandian Route", 140, "TRUNK"},
            {"CONN-25", "CNB", "GKP", 280.0, "Avadh Route", 270, "FEEDER"}
        };
        for (Object[] row : conns) {
            jdbcTemplate.update(connSql, row);
        }
        log.info("Successfully seeded network corridors and station connections.");
    }

    private void seedTrainsAndRoutes() {
        log.info("Seeding Indian Railways Express Trains & Journey Stop Sequences from master dataset...");
        List<Train> realTrains = railwayDataLoader.getTrainRouteMapper().getAllTrains();
        String trainSql = "INSERT OR REPLACE INTO trains (id, train_number, name, type, source, destination, status, delay_minutes, expected_platform, total_seats, booked_seats, coaches, route, frequency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        if (!realTrains.isEmpty()) {
            int batchSize = 500;
            for (int i = 0; i < realTrains.size(); i += batchSize) {
                List<Train> batch = realTrains.subList(i, Math.min(i + batchSize, realTrains.size()));
                jdbcTemplate.batchUpdate(trainSql, batch, batch.size(), (ps, t) -> {
                    ps.setString(1, t.getId());
                    ps.setString(2, t.getTrainNumber());
                    ps.setString(3, t.getName());
                    ps.setString(4, t.getType());
                    ps.setString(5, t.getSourceStation());
                    ps.setString(6, t.getDestinationStation());
                    ps.setString(7, "ON_TIME");
                    ps.setInt(8, 0);
                    ps.setInt(9, 1);
                    ps.setInt(10, t.getTotalSeats());
                    ps.setInt(11, (int) (t.getTotalSeats() * 0.75));
                    ps.setInt(12, 22);
                    ps.setString(13, t.getRoute());
                    ps.setString(14, "Daily");
                });
            }
            log.info("Successfully ingested {} real trains into SQLite.", realTrains.size());

            // Ingest train stops into train_routes
            String routeSql = "INSERT OR IGNORE INTO train_routes (id, train_number, station_code, station_name, sequence_number, arrival_time, departure_time, distance_km, platform) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            Map<String, List<TrainStop>> allStops = railwayDataLoader.getTrainRouteMapper().getAllStopsByTrain();
            List<TrainStop> buffer = new ArrayList<>(5000);
            for (List<TrainStop> stops : allStops.values()) {
                buffer.addAll(stops);
                if (buffer.size() >= 5000) {
                    jdbcTemplate.batchUpdate(routeSql, buffer, buffer.size(), (ps, s) -> {
                        ps.setString(1, "RT-" + s.getTrainNumber() + "-" + s.getSequence());
                        ps.setString(2, s.getTrainNumber());
                        ps.setString(3, s.getStationCode());
                        ps.setString(4, s.getStationName());
                        ps.setInt(5, s.getSequence());
                        ps.setString(6, s.getArrivalTime());
                        ps.setString(7, s.getDepartureTime());
                        ps.setDouble(8, s.getDistanceKm());
                        ps.setInt(9, 1);
                    });
                    buffer.clear();
                }
            }
            if (!buffer.isEmpty()) {
                jdbcTemplate.batchUpdate(routeSql, buffer, buffer.size(), (ps, s) -> {
                    ps.setString(1, "RT-" + s.getTrainNumber() + "-" + s.getSequence());
                    ps.setString(2, s.getTrainNumber());
                    ps.setString(3, s.getStationCode());
                    ps.setString(4, s.getStationName());
                    ps.setInt(5, s.getSequence());
                    ps.setString(6, s.getArrivalTime());
                    ps.setString(7, s.getDepartureTime());
                    ps.setDouble(8, s.getDistanceKm());
                    ps.setInt(9, 1);
                });
            }
            log.info("Successfully ingested real train route sequences into SQLite.");
        }
    }

    private void seedPlatformsAndInitialTelemetry() {
        log.info("Seeding Terminal Platforms and Initial Crowd Telemetry...");
        String pltSql = "INSERT OR IGNORE INTO platforms (id, platform_number, station_code, capacity, current_crowd, status, assigned_train_id, safety_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        // Seed platforms for major hubs: MAS (12), NDLS (16), CSMT (18), HWH (23), TPJ (8)
        String[] stations = {"MAS", "NDLS", "CSMT", "HWH", "TPJ", "PUNE", "SBC", "TBM"};
        int[] platformCounts = {12, 16, 18, 23, 8, 6, 10, 8};

        String telSql = """
            INSERT OR IGNORE INTO crowd_telemetry (
                id, platform_id, station_code, platform_number, passenger_count, capacity, density_percentage, status, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """;

        for (int i = 0; i < stations.length; i++) {
            String stn = stations[i];
            int count = platformCounts[i];
            for (int p = 1; p <= count; p++) {
                String pltId = "PLT-" + stn + "-" + p;
                int capacity = 500 + (p * 50);
                int crowd = (int) (capacity * (0.35 + (0.05 * (p % 7))));
                double density = Math.round(((double) crowd / capacity) * 100.0 * 10.0) / 10.0;
                String status = density >= 90.0 ? "CRITICAL" : (density >= 70.0 ? "WARNING" : "NORMAL");

                jdbcTemplate.update(pltSql, pltId, p, stn, capacity, crowd, status, (p == 1 ? "TRN-12301" : null), 96.5);
                jdbcTemplate.update(telSql, "TEL-" + stn + "-" + p, pltId, stn, p, crowd, capacity, density, status);
            }
        }
        log.info("Successfully seeded platforms and initial simulated telemetry.");
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
