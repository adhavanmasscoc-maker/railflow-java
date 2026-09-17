package com.railflow.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Pure JDBC SQLite Database Manager for RailFlow.
 * Connects to database/railway.db using standard JDBC, sets optimal SQLite pragmas,
 * and manages transactional lifecycle.
 */
public class DatabaseManager {

    private static final Logger log = LoggerFactory.getLogger(DatabaseManager.class);

    public static final String DEFAULT_DB_PATH = "database/railway.db";
    private final String dbPath;
    private final String jdbcUrl;

    public DatabaseManager() {
        this(DEFAULT_DB_PATH);
    }

    public DatabaseManager(String dbPath) {
        this.dbPath = dbPath;
        this.jdbcUrl = "jdbc:sqlite:" + dbPath;
        ensureDatabaseDirectory();
    }

    public void ensureDatabaseDirectory() {
        File dbFile = new File(dbPath);
        File parentDir = dbFile.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            boolean created = parentDir.mkdirs();
            log.info("Created database directory: {} (success: {})", parentDir.getAbsolutePath(), created);
        }
    }

    /**
     * Obtains a standard SQLite JDBC connection with WAL mode and foreign key constraints enabled.
     */
    public Connection getConnection() throws SQLException {
        Connection conn = DriverManager.getConnection(jdbcUrl);
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("PRAGMA foreign_keys = ON;");
            stmt.execute("PRAGMA journal_mode = WAL;");
            stmt.execute("PRAGMA synchronous = NORMAL;");
            stmt.execute("PRAGMA busy_timeout = 60000;");
        }
        return conn;
    }

    /**
     * Gets a connection configured specifically for bulk ingestion (foreign keys disabled temporarily, larger cache).
     */
    public Connection getBulkIngestionConnection() throws SQLException {
        Connection conn = DriverManager.getConnection(jdbcUrl);
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("PRAGMA foreign_keys = OFF;");
            stmt.execute("PRAGMA journal_mode = WAL;");
            stmt.execute("PRAGMA synchronous = NORMAL;");
            stmt.execute("PRAGMA cache_size = 50000;");
            stmt.execute("PRAGMA temp_store = MEMORY;");
        }
        conn.setAutoCommit(false);
        return conn;
    }

    public String getDbPath() {
        return dbPath;
    }

    public String getJdbcUrl() {
        return jdbcUrl;
    }

    public boolean databaseExists() {
        File f = new File(dbPath);
        return f.exists() && f.length() > 0;
    }

    public boolean deleteDatabase() {
        File f = new File(dbPath);
        if (f.exists()) {
            // Also clean up wal/shm if present
            File wal = new File(dbPath + "-wal");
            File shm = new File(dbPath + "-shm");
            if (wal.exists()) wal.delete();
            if (shm.exists()) shm.delete();
            return f.delete();
        }
        return true;
    }
}
