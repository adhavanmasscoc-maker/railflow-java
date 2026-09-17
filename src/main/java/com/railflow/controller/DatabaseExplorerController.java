package com.railflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.*;

/**
 * REST Controller providing direct inspection of SQLite database tables, real row counts,
 * and JDBC architecture demonstrations.
 */
@RestController
@RequestMapping("/api/database")
@CrossOrigin(origins = "*")
public class DatabaseExplorerController {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseExplorerController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getDatabaseOverview() {
        Map<String, Object> response = new HashMap<>();

        // Query real row counts for all system tables
        List<Map<String, Object>> tables = new ArrayList<>();
        String[] tableNames = {
            "stations", "trains", "train_routes", "corridors",
            "station_connections", "search_aliases", "platforms",
            "crowd_telemetry", "feedback", "pnr_records", "railway_records"
        };

        long totalRows = 0;
        for (String tbl : tableNames) {
            try {
                Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tbl, Long.class);
                long rowCount = count != null ? count : 0L;
                totalRows += rowCount;
                tables.add(Map.of(
                        "name", tbl,
                        "rows", rowCount,
                        "type", "TABLE",
                        "status", "ONLINE"
                ));
            } catch (Exception e) {
                tables.add(Map.of("name", tbl, "rows", 0, "type", "TABLE", "status", "ERROR"));
            }
        }

        // Query SQLite indexes
        List<Map<String, Object>> indexes = jdbcTemplate.queryForList("""
            SELECT name, tbl_name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_%'
        """);

        File dbFile = new File("data/database/railflow.db");
        long dbSizeBytes = dbFile.exists() ? dbFile.length() : 0L;

        response.put("databaseEngine", "SQLite 3 via Xerial JDBC");
        response.put("databasePath", dbFile.getAbsolutePath());
        response.put("databaseSizeBytes", dbSizeBytes);
        response.put("databaseSizeFormatted", String.format("%.2f MB", (double) dbSizeBytes / (1024 * 1024)));
        response.put("totalTables", tableNames.length);
        response.put("totalIndexes", indexes.size());
        response.put("totalDatabaseRows", totalRows);
        response.put("tables", tables);
        response.put("indexes", indexes);

        return ResponseEntity.ok(response);
    }
}
