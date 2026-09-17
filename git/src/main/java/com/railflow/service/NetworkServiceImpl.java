package com.railflow.service;

import com.railflow.dao.NetworkDAO;
import com.railflow.dao.PlatformDAO;
import com.railflow.dao.StationDAO;
import com.railflow.dao.TrainDAO;
import com.railflow.exception.StationNotFoundException;
import com.railflow.model.Station;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Implementation of NetworkService providing network topology graph,
 * hub connectivity data, and corridor analytics from SQLite via JDBC.
 */
@Service
public class NetworkServiceImpl implements NetworkService {

    private final NetworkDAO networkDAO;
    private final StationDAO stationDAO;
    private final TrainDAO trainDAO;
    private final PlatformDAO platformDAO;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public NetworkServiceImpl(NetworkDAO networkDAO, StationDAO stationDAO,
                              TrainDAO trainDAO, PlatformDAO platformDAO,
                              JdbcTemplate jdbcTemplate) {
        this.networkDAO = networkDAO;
        this.stationDAO = stationDAO;
        this.trainDAO = trainDAO;
        this.platformDAO = platformDAO;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Map<String, Object> getNetworkGraph() {
        Map<String, Object> response = new HashMap<>();

        // Get rich station nodes with coordinates
        List<Map<String, Object>> nodes = jdbcTemplate.queryForList("""
            SELECT code, name, city, zone, total_platforms, latitude, longitude, status
            FROM stations
            ORDER BY code ASC
        """);

        List<Map<String, Object>> edges = networkDAO.getAllConnections();

        response.put("nodes", nodes);
        response.put("edges", edges);
        response.put("totalNodes", nodes.size());
        response.put("totalEdges", edges.size());
        return response;
    }

    @Override
    public Map<String, Object> getHubDetails(String stationCode) {
        if (stationCode == null || stationCode.isBlank()) {
            throw new IllegalArgumentException("Station code is required.");
        }
        String code = stationCode.trim().toUpperCase();

        List<Map<String, Object>> list = jdbcTemplate.queryForList("""
            SELECT code, name, city, zone, total_platforms, latitude, longitude, status
            FROM stations
            WHERE UPPER(code) = ?
        """, code);

        if (list.isEmpty()) {
            throw new StationNotFoundException("Hub not found for code: " + code);
        }

        Map<String, Object> hub = new HashMap<>(list.get(0));

        // Connected Stations
        List<Map<String, Object>> connections = networkDAO.getConnectionsForStation(code);
        hub.put("connections", connections);

        // Platforms
        hub.put("platforms", platformDAO.findByStation(code));

        // Incoming / Outgoing Routes
        List<Map<String, Object>> incoming = jdbcTemplate.queryForList("""
            SELECT DISTINCT t.train_number, t.name, t.source, t.destination, r.arrival_time, r.platform
            FROM trains t
            JOIN train_routes r ON t.train_number = r.train_number
            WHERE UPPER(r.station_code) = ? AND UPPER(t.destination) = ?
        """, code, code);

        List<Map<String, Object>> outgoing = jdbcTemplate.queryForList("""
            SELECT DISTINCT t.train_number, t.name, t.source, t.destination, r.departure_time, r.platform
            FROM trains t
            JOIN train_routes r ON t.train_number = r.train_number
            WHERE UPPER(r.station_code) = ? AND UPPER(t.source) = ?
        """, code, code);

        hub.put("incomingRoutes", incoming);
        hub.put("outgoingRoutes", outgoing);

        return hub;
    }

    @Override
    public Map<String, Object> getNetworkStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStations", stationDAO.count());
        stats.put("totalTrains", trainDAO.count());
        stats.put("totalCorridors", networkDAO.getAllCorridors().size());
        stats.put("totalConnections", networkDAO.getAllConnections().size());
        stats.put("totalPlatforms", platformDAO.count());
        return stats;
    }
}
