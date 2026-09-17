package com.railflow;

import com.railflow.database.DatabaseManager;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

/**
 * Demonstrates the REAL SQL queries executed by RailFlow against SQLite database/railway.db
 * triggered when users click interactive buttons in the application.
 */
public class LiveSqlButtonQueriesDemo {

    private static final DatabaseManager db = new DatabaseManager("database/railway.db");

    @Test
    public void runAllUserButtonQueries() throws Exception {
        System.out.println("================================================================================");
        System.out.println("  LIVE SQL QUERIES EXECUTED AGAINST database/railway.db ON USER BUTTON CLICKS   ");
        System.out.println("================================================================================\n");

        try (Connection conn = db.getConnection()) {
            // Button 1: User types in search bar -> Autocomplete Query
            demonstrateButton1SearchAutocomplete(conn);

            // Button 2: User clicks on station card "NDLS" -> Station Profile & Connected Hubs
            demonstrateButton2StationProfile(conn);

            // Button 3: User clicks "Plan Route" (NDLS -> MAS) -> Direct Trains Query
            demonstrateButton3PlanDirectRoute(conn);

            // Button 4: User clicks "View Timetable" for Train 12622 -> Ordered Route Query
            demonstrateButton4ViewTrainTimetable(conn);

            // Button 5: User clicks "Find Transfer Routes" (NDLS -> MAS) -> 1-Transfer Interchange Query
            demonstrateButton5TransferRoutes(conn);

            // Button 6: User clicks "Database Explorer" -> Schema Table Breakdown Query
            demonstrateButton6DatabaseExplorer(conn);

            // Button 7: User clicks "Audit Provenance" -> Traceability back to source file & SHA-256
            demonstrateButton7DataProvenance(conn);
        }
    }

    private void demonstrateButton1SearchAutocomplete(Connection conn) throws SQLException {
        printHeader("BUTTON ACTION 1: User types 'MUMBAI' in Station Search Bar");
        String sql = """
            SELECT DISTINCT s.station_code, s.station_name, s.city, s.zone,
                   CASE 
                       WHEN s.station_code = ? THEN 1
                       WHEN UPPER(s.station_name) = ? THEN 2
                       WHEN s.station_code LIKE ? THEN 3
                       WHEN UPPER(s.station_name) LIKE ? THEN 4
                       ELSE 5
                   END AS match_rank
            FROM stations s
            LEFT JOIN station_aliases a ON s.station_code = a.station_code
            WHERE s.station_code LIKE ?
               OR UPPER(s.station_name) LIKE ?
               OR UPPER(s.city) LIKE ?
               OR a.normalized_alias LIKE ?
            ORDER BY match_rank ASC, s.station_name ASC
            LIMIT 5;
        """;
        System.out.println("EXECUTED SQL:");
        System.out.println(sql);
        System.out.println("PARAMETERS: ['MUMBAI', 'MUMBAI', 'MUMBAI%', 'MUMBAI%', '%MUMBAI%', '%MUMBAI%', '%MUMBAI%', '%MUMBAI%']\n");
        System.out.println("LIVE RESULTS RETURNED FROM database/railway.db:");

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            String term = "MUMBAI";
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setString(3, term + "%");
            ps.setString(4, term + "%");
            ps.setString(5, "%" + term + "%");
            ps.setString(6, "%" + term + "%");
            ps.setString(7, "%" + term + "%");
            ps.setString(8, "%" + term + "%");

            try (ResultSet rs = ps.executeQuery()) {
                printResultSet(rs);
            }
        }
    }

    private void demonstrateButton2StationProfile(Connection conn) throws SQLException {
        printHeader("BUTTON ACTION 2: User clicks on Station Card 'NDLS' (New Delhi)");
        String sql = """
            SELECT s.station_code, s.station_name, s.city, s.zone, s.latitude, s.longitude,
                   (SELECT COUNT(*) FROM train_stops ts WHERE ts.station_code = s.station_code) AS scheduled_train_stops,
                   (SELECT COUNT(DISTINCT e.to_station_code) FROM rail_edges e WHERE e.from_station_code = s.station_code) AS connected_corridors
            FROM stations s
            WHERE s.station_code = 'NDLS';
        """;
        System.out.println("EXECUTED SQL:");
        System.out.println(sql);
        System.out.println("LIVE RESULTS RETURNED FROM database/railway.db:");

        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            printResultSet(rs);
        }

        System.out.println("\n--- Top 5 Connected Outgoing Hubs from NDLS via rail_edges ---");
        String edgesSql = """
            SELECT e.to_station_code, s.station_name, COUNT(DISTINCT e.train_number) AS active_trains, ROUND(e.distance_km, 1) AS distance_km
            FROM rail_edges e
            LEFT JOIN stations s ON s.station_code = e.to_station_code
            WHERE e.from_station_code = 'NDLS'
            GROUP BY e.to_station_code, s.station_name
            ORDER BY active_trains DESC
            LIMIT 5;
        """;
        try (PreparedStatement ps = conn.prepareStatement(edgesSql);
             ResultSet rs = ps.executeQuery()) {
            printResultSet(rs);
        }
    }

    private void demonstrateButton3PlanDirectRoute(Connection conn) throws SQLException {
        printHeader("BUTTON ACTION 3: User clicks 'Plan Route' (Origin: NDLS -> Destination: MAS)");
        String sql = """
            SELECT t.train_number, t.train_name, t.train_type,
                   s1.stop_sequence AS from_seq, s2.stop_sequence AS to_seq,
                   s1.departure_time AS dep_time, s2.arrival_time AS arr_time,
                   ROUND(s2.distance_km - s1.distance_km, 1) AS route_distance_km,
                   COALESCE(rd.frequency_text, 'Daily') AS frequency
            FROM train_stops s1
            JOIN train_stops s2 ON s1.train_id = s2.train_id
            JOIN trains t ON t.id = s1.train_id
            LEFT JOIN train_running_days rd ON rd.train_id = t.id
            WHERE s1.station_code = 'NDLS'
              AND s2.station_code = 'MAS'
              AND s1.stop_sequence < s2.stop_sequence
            ORDER BY route_distance_km ASC;
        """;
        System.out.println("EXECUTED SQL (Strictly enforcing from_sequence < to_sequence within same train):");
        System.out.println(sql);
        System.out.println("LIVE RESULTS RETURNED FROM database/railway.db:");

        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            printResultSet(rs);
        }
    }

    private void demonstrateButton4ViewTrainTimetable(Connection conn) throws SQLException {
        printHeader("BUTTON ACTION 4: User clicks 'View Timetable' for Train 12622 (Tamil Nadu Express)");
        String sql = """
            SELECT ts.stop_sequence AS seq, ts.station_code, s.station_name,
                   ts.arrival_time, ts.departure_time, ts.halt_minutes,
                   ROUND(ts.distance_km, 1) AS cum_dist_km, ts.journey_day AS day
            FROM train_stops ts
            LEFT JOIN stations s ON s.station_code = ts.station_code
            WHERE ts.train_number = '12622'
            ORDER BY ts.stop_sequence ASC
            LIMIT 10;
        """;
        System.out.println("EXECUTED SQL (Showing first 10 strictly ordered stops):");
        System.out.println(sql);
        System.out.println("LIVE RESULTS RETURNED FROM database/railway.db:");

        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            printResultSet(rs);
        }
    }

    private void demonstrateButton5TransferRoutes(Connection conn) throws SQLException {
        printHeader("BUTTON ACTION 5: User clicks 'Find Connecting / 1-Transfer Routes' (NDLS -> MAS)");
        String sql = """
            SELECT DISTINCT 
                   s1_mid.station_code AS interchange_hub,
                   COALESCE(sm.station_name, s1_mid.station_code) AS hub_name,
                   t1.train_number AS leg1_train_no, t1.train_name AS leg1_train_name,
                   s1_orig.departure_time AS leg1_dep, s1_mid.arrival_time AS leg1_arr,
                   t2.train_number AS leg2_train_no, t2.train_name AS leg2_train_name,
                   s2_mid.departure_time AS leg2_dep, s2_dest.arrival_time AS leg2_arr
            FROM train_stops s1_orig
            JOIN train_stops s1_mid ON s1_orig.train_id = s1_mid.train_id AND s1_orig.stop_sequence < s1_mid.stop_sequence
            JOIN trains t1 ON t1.id = s1_orig.train_id
            JOIN train_stops s2_mid ON s2_mid.station_code = s1_mid.station_code
            JOIN train_stops s2_dest ON s2_mid.train_id = s2_dest.train_id AND s2_mid.stop_sequence < s2_dest.stop_sequence
            JOIN trains t2 ON t2.id = s2_mid.train_id
            LEFT JOIN stations sm ON sm.station_code = s1_mid.station_code
            WHERE s1_orig.station_code = 'NDLS'
              AND s2_dest.station_code = 'MAS'
              AND s1_mid.station_code NOT IN ('NDLS', 'MAS')
              AND t1.id != t2.id
            LIMIT 3;
        """;
        System.out.println("EXECUTED SQL (2-hop graph transfer discovery):");
        System.out.println(sql);
        System.out.println("LIVE RESULTS RETURNED FROM database/railway.db:");

        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            printResultSet(rs);
        }
    }

    private void demonstrateButton6DatabaseExplorer(Connection conn) throws SQLException {
        printHeader("BUTTON ACTION 6: User clicks 'Database Explorer' Tab");
        String sql = """
            SELECT 'stations' AS table_name, COUNT(*) AS row_count, 'Primary Stations Master with GPS' AS purpose FROM stations
            UNION ALL
            SELECT 'trains', COUNT(*), 'Primary Express & Passenger Trains Master' FROM trains
            UNION ALL
            SELECT 'train_stops', COUNT(*), 'Ordered Route Sequences (Sequence, Arr, Dep, Halt)' FROM train_stops
            UNION ALL
            SELECT 'rail_edges', COUNT(*), 'Directed Graph Network Topology Edges (A -> B)' FROM rail_edges
            UNION ALL
            SELECT 'train_running_days', COUNT(*), 'Operational Day Matrix (Mon-Sun) & Frequency' FROM train_running_days
            UNION ALL
            SELECT 'station_aliases', COUNT(*), 'Colloquial, Metro, & Official Search Aliases' FROM station_aliases
            UNION ALL
            SELECT 'special_trains', COUNT(*), 'Mined PDF Timetables for Special/Festival Trains' FROM special_trains
            UNION ALL
            SELECT 'data_sources', COUNT(*), 'File Provenance Traceability & SHA-256 Checksums' FROM data_sources
            UNION ALL
            SELECT 'import_runs', COUNT(*), 'Historical Audit Logs of Ingestion Engine Runs' FROM import_runs;
        """;
        System.out.println("EXECUTED SQL:");
        System.out.println(sql);
        System.out.println("LIVE RESULTS RETURNED FROM database/railway.db:");

        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            printResultSet(rs);
        }
    }

    private void demonstrateButton7DataProvenance(Connection conn) throws SQLException {
        printHeader("BUTTON ACTION 7: User checks Data Provenance & Traceability of Train 12622");
        String sql = """
            SELECT t.train_number, t.train_name, t.source_file, ds.file_type, ds.file_size_bytes, ds.sha256, ds.source_priority
            FROM trains t
            JOIN data_sources ds ON ds.id = t.source_id
            WHERE t.train_number = '12622';
        """;
        System.out.println("EXECUTED SQL (Checking which physical file produced Train 12622):");
        System.out.println(sql);
        System.out.println("LIVE RESULTS RETURNED FROM database/railway.db:");

        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            printResultSet(rs);
        }
    }

    private static void printHeader(String title) {
        System.out.println("\n--------------------------------------------------------------------------------");
        System.out.println("  " + title);
        System.out.println("--------------------------------------------------------------------------------");
    }

    private static void printResultSet(ResultSet rs) throws SQLException {
        ResultSetMetaData meta = rs.getMetaData();
        int cols = meta.getColumnCount();

        // Print header
        StringBuilder header = new StringBuilder("  ");
        for (int i = 1; i <= cols; i++) {
            header.append(String.format("%-22s", meta.getColumnLabel(i))).append(" | ");
        }
        System.out.println(header.toString());
        System.out.println("  " + "-".repeat(header.length() - 2));

        // Print rows
        int rowCount = 0;
        while (rs.next()) {
            rowCount++;
            StringBuilder row = new StringBuilder("  ");
            for (int i = 1; i <= cols; i++) {
                String val = rs.getString(i);
                if (val == null) val = "NULL";
                if (val.length() > 20) val = val.substring(0, 17) + "...";
                row.append(String.format("%-22s", val)).append(" | ");
            }
            System.out.println(row.toString());
        }
        if (rowCount == 0) {
            System.out.println("  (0 rows returned)");
        }
    }
}
