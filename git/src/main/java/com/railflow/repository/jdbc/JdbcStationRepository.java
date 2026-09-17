package com.railflow.repository.jdbc;

import com.railflow.database.DatabaseManager;
import com.railflow.model.Station;
import com.railflow.repository.StationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

/**
 * Pure JDBC implementation of StationRepository querying SQLite database (database/railway.db).
 * Guarantees parameterized PreparedStatements, proper resource management, and alias resolution.
 */
@Repository("jdbcStationRepository")
public class JdbcStationRepository implements StationRepository {

    private static final Logger log = LoggerFactory.getLogger(JdbcStationRepository.class);
    private final DatabaseManager databaseManager;

    public JdbcStationRepository(DatabaseManager databaseManager) {
        this.databaseManager = databaseManager;
    }

    @Override
    public Optional<Station> findByCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return Optional.empty();
        }
        String cleanCode = code.trim().toUpperCase();

        String sql = """
            SELECT station_code, station_name, city, state, zone, latitude, longitude, total_platforms
            FROM stations
            WHERE station_code = ?
            LIMIT 1;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, cleanCode);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRowToStation(rs));
                }
            }

            // Fallback: Check if cleanCode matches an alias
            String aliasSql = """
                SELECT s.station_code, s.station_name, s.city, s.state, s.zone, s.latitude, s.longitude, s.total_platforms
                FROM station_aliases a
                JOIN stations s ON a.station_code = s.station_code
                WHERE a.normalized_alias = ? OR a.alias = ?
                LIMIT 1;
            """;
            try (PreparedStatement aps = conn.prepareStatement(aliasSql)) {
                aps.setString(1, cleanCode);
                aps.setString(2, cleanCode);
                try (ResultSet ars = aps.executeQuery()) {
                    if (ars.next()) {
                        return Optional.of(mapRowToStation(ars));
                    }
                }
            }

        } catch (SQLException e) {
            log.error("Database error while finding station by code '{}': {}", cleanCode, e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    public List<Station> findAll() {
        List<Station> list = new ArrayList<>();
        String sql = "SELECT station_code, station_name, city, state, zone, latitude, longitude, total_platforms FROM stations ORDER BY station_name ASC;";

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapRowToStation(rs));
            }
        } catch (SQLException e) {
            log.error("Database error in findAll stations: {}", e.getMessage());
        }
        return list;
    }

    public List<Station> findAll(int limit, int offset) {
        List<Station> list = new ArrayList<>();
        String sql = "SELECT station_code, station_name, city, state, zone, latitude, longitude, total_platforms FROM stations ORDER BY station_name ASC LIMIT ? OFFSET ?;";

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, Math.max(1, limit));
            ps.setInt(2, Math.max(0, offset));
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRowToStation(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Database error in paginated findAll stations: {}", e.getMessage());
        }
        return list;
    }

    @Override
    public Station save(Station station) {
        if (station == null || station.getCode() == null) {
            throw new IllegalArgumentException("Station and station code must not be null");
        }
        String sql = """
            INSERT INTO stations (station_code, station_name, city, state, zone, latitude, longitude, total_platforms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(station_code) DO UPDATE SET
                station_name = excluded.station_name,
                city = excluded.city,
                state = excluded.state,
                zone = excluded.zone,
                latitude = excluded.latitude,
                longitude = excluded.longitude,
                total_platforms = excluded.total_platforms;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, station.getCode().toUpperCase().trim());
            ps.setString(2, station.getName());
            ps.setString(3, station.getCity());
            ps.setString(4, station.getState());
            ps.setString(5, station.getZone());
            ps.setDouble(6, station.getLatitude());
            ps.setDouble(7, station.getLongitude());
            ps.setInt(8, station.getPlatformCount());
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("Database error saving station '{}': {}", station.getCode(), e.getMessage());
        }
        return station;
    }

    @Override
    public List<Station> searchByNameOrCode(String query) {
        return searchByNameOrCode(query, 20);
    }

    public List<Station> searchByNameOrCode(String query, int limit) {
        List<Station> results = new ArrayList<>();
        if (query == null || query.trim().isEmpty()) {
            return results;
        }
        String term = query.trim().toUpperCase();
        String likeTerm = "%" + term + "%";

        // Query both primary stations and aliases with priority ordering
        String sql = """
            SELECT DISTINCT s.station_code, s.station_name, s.city, s.state, s.zone, s.latitude, s.longitude, s.total_platforms,
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
            LIMIT ?;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, term);
            ps.setString(2, term);
            ps.setString(3, term + "%");
            ps.setString(4, term + "%");
            ps.setString(5, likeTerm);
            ps.setString(6, likeTerm);
            ps.setString(7, likeTerm);
            ps.setString(8, likeTerm);
            ps.setInt(9, Math.max(1, limit));

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    results.add(mapRowToStation(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Database error during station autocomplete search for '{}': {}", query, e.getMessage());
        }
        return results;
    }

    @Override
    public long count() {
        String sql = "SELECT COUNT(*) FROM stations;";
        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            log.error("Database error counting stations: {}", e.getMessage());
        }
        return 0L;
    }

    private Station mapRowToStation(ResultSet rs) throws SQLException {
        String code = rs.getString("station_code");
        String name = rs.getString("station_name");
        String city = rs.getString("city");
        String state = rs.getString("state");
        String zone = rs.getString("zone");
        double lat = rs.getDouble("latitude");
        double lon = rs.getDouble("longitude");
        int platforms = rs.getInt("total_platforms");

        Station station = new Station(code, name, city != null ? city : name, zone != null ? zone : "IR", Math.max(1, platforms));
        station.setState(state);
        station.setLatitude(lat);
        station.setLongitude(lon);
        return station;
    }
}
