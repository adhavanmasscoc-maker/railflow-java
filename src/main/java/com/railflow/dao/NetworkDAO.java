package com.railflow.dao;

import com.railflow.model.Corridor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * JDBC Data Access Object for Network Corridors, Inter-Hub Edges, and Station Connections.
 */
@Repository
public class NetworkDAO {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public NetworkDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getAllCorridors() {
        String sql = "SELECT * FROM corridors ORDER BY name ASC";
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getAllConnections() {
        String sql = """
            SELECT source_station_code, destination_station_code, distance_km, travel_minutes, corridor_name, connection_type
            FROM station_connections
            ORDER BY corridor_name ASC
        """;
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getConnectionsForStation(String stationCode) {
        String sql = """
            SELECT source_station_code, destination_station_code, distance_km, travel_minutes, corridor_name, connection_type
            FROM station_connections
            WHERE UPPER(source_station_code) = UPPER(?) OR UPPER(destination_station_code) = UPPER(?)
        """;
        return jdbcTemplate.queryForList(sql, stationCode.trim(), stationCode.trim());
    }

    public void insertCorridor(String id, String name, String origin, String destination, double distanceKm, int avgTimeMins, String primaryZone) {
        String sql = "INSERT OR IGNORE INTO corridors (id, name, origin_code, destination_code, distance_km, average_time_mins, primary_zone) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, id, name, origin, destination, distanceKm, avgTimeMins, primaryZone);
    }

    public void insertConnection(String id, String source, String destination, double distanceKm, String corridorName, int travelMins, String type) {
        String sql = "INSERT OR IGNORE INTO station_connections (id, source_station_code, destination_station_code, distance_km, corridor_name, travel_minutes, connection_type) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, id, source, destination, distanceKm, corridorName, travelMins, type);
    }
}
