package com.railflow.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Enterprise Schema Manager for RailFlow SQLite Database (database/railway.db).
 * Defines normalized, traceable relational schema, constraints, and optimized indexes.
 */
public class SchemaManager {

    private static final Logger log = LoggerFactory.getLogger(SchemaManager.class);

    public static void createTables(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            // 1. Data Sources Master (Traceability)
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS data_sources (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    file_name TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    file_type TEXT NOT NULL,
                    file_size_bytes INTEGER NOT NULL,
                    sha256 TEXT NOT NULL,
                    source_priority TEXT NOT NULL,
                    imported INTEGER NOT NULL DEFAULT 0,
                    import_status TEXT NOT NULL DEFAULT 'PENDING',
                    record_count INTEGER NOT NULL DEFAULT 0,
                    notes TEXT,
                    imported_at TEXT
                );
            """);

            // 2. Import Runs Audit Log
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS import_runs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    started_at TEXT NOT NULL,
                    completed_at TEXT,
                    status TEXT NOT NULL,
                    files_processed INTEGER DEFAULT 0,
                    stations_imported INTEGER DEFAULT 0,
                    trains_imported INTEGER DEFAULT 0,
                    stops_imported INTEGER DEFAULT 0,
                    running_days_imported INTEGER DEFAULT 0,
                    edges_imported INTEGER DEFAULT 0,
                    duplicates_found INTEGER DEFAULT 0,
                    invalid_records INTEGER DEFAULT 0,
                    unresolved_references INTEGER DEFAULT 0,
                    duration_ms INTEGER DEFAULT 0
                );
            """);

            // 3. Import Errors Log
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS import_errors (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    source_file TEXT NOT NULL,
                    record_identifier TEXT,
                    error_type TEXT NOT NULL,
                    error_message TEXT NOT NULL,
                    raw_record TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );
            """);

            // 4. Stations Master
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS stations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    station_code TEXT NOT NULL UNIQUE,
                    station_name TEXT NOT NULL,
                    code TEXT GENERATED ALWAYS AS (station_code) VIRTUAL,
                    name TEXT GENERATED ALWAYS AS (station_name) VIRTUAL,
                    normalized_name TEXT,
                    city TEXT,
                    division TEXT,
                    state TEXT,
                    zone TEXT DEFAULT 'IR',
                    latitude REAL,
                    longitude REAL,
                    total_platforms INTEGER DEFAULT 4,
                    category TEXT,
                    source_id INTEGER,
                    source_file TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(source_id) REFERENCES data_sources(id)
                );
            """);

            // 5. Station Aliases
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS station_aliases (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    station_id INTEGER,
                    station_code TEXT NOT NULL,
                    alias TEXT NOT NULL,
                    normalized_alias TEXT NOT NULL,
                    alias_type TEXT DEFAULT 'COMMON',
                    source_id INTEGER,
                    source_file TEXT,
                    FOREIGN KEY(station_id) REFERENCES stations(id),
                    FOREIGN KEY(source_id) REFERENCES data_sources(id)
                );
            """);

            // 6. Trains Master
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS trains (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    train_number TEXT NOT NULL UNIQUE,
                    train_name TEXT NOT NULL,
                    name TEXT GENERATED ALWAYS AS (train_name) VIRTUAL,
                    train_type TEXT DEFAULT 'EXP',
                    type TEXT GENERATED ALWAYS AS (train_type) VIRTUAL,
                    source_station_code TEXT,
                    source TEXT GENERATED ALWAYS AS (source_station_code) VIRTUAL,
                    destination_station_code TEXT,
                    destination TEXT GENERATED ALWAYS AS (destination_station_code) VIRTUAL,
                    total_distance_km REAL,
                    coaches INTEGER DEFAULT 22,
                    source_id INTEGER,
                    source_file TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(source_id) REFERENCES data_sources(id)
                );
            """);

            // 7. Train Stops (Ordered Sequences)
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS train_stops (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    train_id INTEGER NOT NULL,
                    train_number TEXT NOT NULL,
                    station_id INTEGER,
                    station_code TEXT NOT NULL,
                    stop_sequence INTEGER NOT NULL,
                    arrival_time TEXT,
                    departure_time TEXT,
                    halt_minutes INTEGER,
                    distance_km REAL,
                    journey_day INTEGER DEFAULT 1,
                    source_id INTEGER,
                    source_file TEXT,
                    FOREIGN KEY(train_id) REFERENCES trains(id),
                    FOREIGN KEY(station_id) REFERENCES stations(id),
                    FOREIGN KEY(source_id) REFERENCES data_sources(id)
                );
            """);

            // 8. Train Running Days
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS train_running_days (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    train_id INTEGER NOT NULL,
                    train_number TEXT NOT NULL,
                    monday INTEGER DEFAULT 0,
                    tuesday INTEGER DEFAULT 0,
                    wednesday INTEGER DEFAULT 0,
                    thursday INTEGER DEFAULT 0,
                    friday INTEGER DEFAULT 0,
                    saturday INTEGER DEFAULT 0,
                    sunday INTEGER DEFAULT 0,
                    frequency_text TEXT DEFAULT 'Daily',
                    source_id INTEGER,
                    source_file TEXT,
                    FOREIGN KEY(train_id) REFERENCES trains(id),
                    FOREIGN KEY(source_id) REFERENCES data_sources(id)
                );
            """);

            // 9. Rail Edges (Graph Topology)
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS rail_edges (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    from_station_id INTEGER,
                    from_station_code TEXT NOT NULL,
                    to_station_id INTEGER,
                    to_station_code TEXT NOT NULL,
                    train_id INTEGER NOT NULL,
                    train_number TEXT NOT NULL,
                    from_sequence INTEGER NOT NULL,
                    to_sequence INTEGER NOT NULL,
                    distance_km REAL,
                    travel_minutes INTEGER,
                    source_id INTEGER,
                    source_file TEXT,
                    FOREIGN KEY(from_station_id) REFERENCES stations(id),
                    FOREIGN KEY(to_station_id) REFERENCES stations(id),
                    FOREIGN KEY(train_id) REFERENCES trains(id),
                    FOREIGN KEY(source_id) REFERENCES data_sources(id)
                );
            """);

            // 10. Special Trains (Supplementary PDF Schedule Ingestion)
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS special_trains (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    train_number TEXT NOT NULL,
                    train_name TEXT NOT NULL,
                    from_station TEXT,
                    to_station TEXT,
                    departure_time TEXT,
                    arrival_time TEXT,
                    frequency TEXT,
                    days_of_operation TEXT,
                    owning_railway TEXT,
                    valid_from TEXT,
                    valid_to TEXT,
                    service_category TEXT DEFAULT 'SPECIAL_COVID_FESTIVAL',
                    source_id INTEGER,
                    source_file TEXT,
                    raw_text TEXT,
                    FOREIGN KEY(source_id) REFERENCES data_sources(id)
                );
            """);

            // Compatibility Views for existing application DAOs
            stmt.execute("""
                CREATE VIEW IF NOT EXISTS search_aliases AS 
                SELECT id, alias, station_code, alias_type FROM station_aliases;
            """);

            stmt.execute("""
                CREATE VIEW IF NOT EXISTS train_routes AS
                SELECT ts.id, ts.train_number, ts.station_code, 
                       COALESCE(s.station_name, ts.station_code) AS station_name,
                       ts.stop_sequence AS sequence_number, 
                       ts.arrival_time, ts.departure_time, 
                       ts.distance_km, 1 AS platform
                FROM train_stops ts
                LEFT JOIN stations s ON ts.station_code = s.station_code;
            """);

            log.info("Successfully created all 10 normalized schema tables and compatibility views in railway.db");
        }
    }

    public static void createIndexes(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_stn_code ON stations(station_code);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_stn_name ON stations(station_name);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_stn_city ON stations(city);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_stn_zone ON stations(zone);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_alias_code ON station_aliases(station_code);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_alias_norm ON station_aliases(normalized_alias);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_alias_name ON station_aliases(alias);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_train_num ON trains(train_number);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_train_src ON trains(source_station_code);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_train_dst ON trains(destination_station_code);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_stop_train ON train_stops(train_id);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_stop_train_no ON train_stops(train_number);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_stop_stn ON train_stops(station_code);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_stop_order ON train_stops(train_number, stop_sequence);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_edge_from ON rail_edges(from_station_code);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_edge_to ON rail_edges(to_station_code);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_edge_pair ON rail_edges(from_station_code, to_station_code);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_edge_train ON rail_edges(train_number);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_days_train ON train_running_days(train_id);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_days_train_no ON train_running_days(train_number);");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_special_trn ON special_trains(train_number);");
            log.info("Successfully created/verified all 21 performance indexes in railway.db");
        }
    }

    public static void dropAllTables(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("DROP VIEW IF EXISTS train_routes;");
            stmt.execute("DROP VIEW IF EXISTS search_aliases;");
            String[] tables = {
                "rail_edges",
                "train_stops",
                "train_running_days",
                "special_trains",
                "station_aliases",
                "trains",
                "stations",
                "import_errors",
                "import_runs",
                "data_sources"
            };
            for (String table : tables) {
                stmt.execute("DROP TABLE IF EXISTS " + table + ";");
            }
            log.info("Successfully dropped all tables for full database rebuild.");
        }
    }
}
