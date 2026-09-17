package com.railflow.repository.jdbc;

import com.railflow.database.DatabaseManager;
import com.railflow.model.GraphEdge;
import com.railflow.repository.GraphRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

/**
 * Pure JDBC implementation of GraphRepository for railway network topology and corridor pathfinding.
 */
@Repository("jdbcGraphRepository")
public class JdbcGraphRepository implements GraphRepository {

    private static final Logger log = LoggerFactory.getLogger(JdbcGraphRepository.class);
    private final DatabaseManager databaseManager;

    public JdbcGraphRepository(DatabaseManager databaseManager) {
        this.databaseManager = databaseManager;
    }

    @Override
    public List<GraphEdge> getOutgoingEdges(String stationCode) {
        Map<String, GraphEdge> edgeMap = new LinkedHashMap<>();
        if (stationCode == null) return new ArrayList<>();

        String sql = """
            SELECT e.from_station_code, e.to_station_code, e.distance_km,
                   e.train_number, t.train_name, s1.departure_time, s2.arrival_time, e.from_sequence
            FROM rail_edges e
            JOIN trains t ON t.id = e.train_id
            LEFT JOIN train_stops s1 ON s1.train_id = e.train_id AND s1.stop_sequence = e.from_sequence
            LEFT JOIN train_stops s2 ON s2.train_id = e.train_id AND s2.stop_sequence = e.to_sequence
            WHERE e.from_station_code = ?
            ORDER BY e.to_station_code ASC, e.train_number ASC;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, stationCode.trim().toUpperCase());
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String to = rs.getString("to_station_code");
                    double dist = rs.getDouble("distance_km");
                    String trainNo = rs.getString("train_number");
                    String trainName = rs.getString("train_name");
                    String dep = rs.getString("departure_time");
                    String arr = rs.getString("arrival_time");
                    int seq = rs.getInt("from_sequence");

                    GraphEdge edge = edgeMap.computeIfAbsent(to, k -> new GraphEdge(stationCode, to, dist));
                    edge.addTrain(trainNo, trainName, dep, arr, seq);
                }
            }
        } catch (SQLException e) {
            log.error("Database error getting outgoing edges for {}: {}", stationCode, e.getMessage());
        }
        return new ArrayList<>(edgeMap.values());
    }

    @Override
    public List<String> getConnectedStations(String stationCode) {
        List<String> list = new ArrayList<>();
        if (stationCode == null) return list;

        String sql = """
            SELECT DISTINCT to_station_code
            FROM rail_edges
            WHERE from_station_code = ?
            ORDER BY to_station_code ASC;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, stationCode.trim().toUpperCase());
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(rs.getString("to_station_code"));
                }
            }
        } catch (SQLException e) {
            log.error("Database error getting connected stations for {}: {}", stationCode, e.getMessage());
        }
        return list;
    }

    @Override
    public List<Map<String, Object>> findRoutes(String fromCode, String toCode, int maxTransfers) {
        List<Map<String, Object>> allRoutes = new ArrayList<>();
        if (fromCode == null || toCode == null) return allRoutes;

        String from = fromCode.trim().toUpperCase();
        String to = toCode.trim().toUpperCase();
        if (from.equals(to)) return allRoutes;

        // 1. Direct trains (0 Transfers)
        String directSql = """
            SELECT t.train_number, t.train_name, t.train_type,
                   s1.stop_sequence AS seq1, s2.stop_sequence AS seq2,
                   s1.departure_time, s2.arrival_time,
                   s1.distance_km AS dist1, s2.distance_km AS dist2
            FROM train_stops s1
            JOIN train_stops s2 ON s1.train_id = s2.train_id
            JOIN trains t ON t.id = s1.train_id
            WHERE s1.station_code = ? AND s2.station_code = ? AND s1.stop_sequence < s2.stop_sequence
            ORDER BY (s2.stop_sequence - s1.stop_sequence) ASC
            LIMIT 15;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(directSql)) {
            ps.setString(1, from);
            ps.setString(2, to);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> r = new LinkedHashMap<>();
                    r.put("type", "DIRECT");
                    r.put("transfers", 0);
                    r.put("stations", List.of(
                        Map.of("code", from, "name", from),
                        Map.of("code", to, "name", to)
                    ));
                    r.put("trains", List.of(Map.of(
                        "number", rs.getString("train_number"),
                        "name", rs.getString("train_name"),
                        "type", rs.getString("train_type"),
                        "departure", rs.getString("departure_time") != null ? rs.getString("departure_time") : "-",
                        "arrival", rs.getString("arrival_time") != null ? rs.getString("arrival_time") : "-"
                    )));
                    double d1 = rs.getDouble("dist1");
                    double d2 = rs.getDouble("dist2");
                    double dist = (d2 > d1) ? (d2 - d1) : 0.0;
                    r.put("distanceKm", Math.round(dist));
                    allRoutes.add(r);
                }
            }
        } catch (SQLException e) {
            log.error("Database error finding direct routes ({} -> {}): {}", from, to, e.getMessage());
        }

        // 2. One-transfer connections (1 Transfer) if requested and needed
        if (maxTransfers >= 1 && allRoutes.size() < 10) {
            String transferSql = """
                SELECT DISTINCT 
                       s1_mid.station_code AS mid_station,
                       t1.train_number AS train1_no, t1.train_name AS train1_name, s1_orig.departure_time AS dep1, s1_mid.arrival_time AS arr1,
                       t2.train_number AS train2_no, t2.train_name AS train2_name, s2_mid.departure_time AS dep2, s2_dest.arrival_time AS arr2
                FROM train_stops s1_orig
                JOIN train_stops s1_mid ON s1_orig.train_id = s1_mid.train_id AND s1_orig.stop_sequence < s1_mid.stop_sequence
                JOIN trains t1 ON t1.id = s1_orig.train_id
                JOIN train_stops s2_mid ON s2_mid.station_code = s1_mid.station_code
                JOIN train_stops s2_dest ON s2_mid.train_id = s2_dest.train_id AND s2_mid.stop_sequence < s2_dest.stop_sequence
                JOIN trains t2 ON t2.id = s2_mid.train_id
                WHERE s1_orig.station_code = ? 
                  AND s2_dest.station_code = ?
                  AND s1_mid.station_code NOT IN (?, ?)
                  AND t1.id != t2.id
                LIMIT 10;
            """;

            try (Connection conn = databaseManager.getConnection();
                 PreparedStatement ps = conn.prepareStatement(transferSql)) {
                ps.setString(1, from);
                ps.setString(2, to);
                ps.setString(3, from);
                ps.setString(4, to);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        String mid = rs.getString("mid_station");
                        Map<String, Object> r = new LinkedHashMap<>();
                        r.put("type", "TRANSFER_1_HOP");
                        r.put("transfers", 1);
                        r.put("interchangeStation", mid);
                        r.put("stations", List.of(
                            Map.of("code", from, "name", from),
                            Map.of("code", mid, "name", mid),
                            Map.of("code", to, "name", to)
                        ));
                        r.put("trains", List.of(
                            Map.of("leg", 1, "number", rs.getString("train1_no"), "name", rs.getString("train1_name"), "departure", rs.getString("dep1") != null ? rs.getString("dep1") : "-", "arrival", rs.getString("arr1") != null ? rs.getString("arr1") : "-"),
                            Map.of("leg", 2, "number", rs.getString("train2_no"), "name", rs.getString("train2_name"), "departure", rs.getString("dep2") != null ? rs.getString("dep2") : "-", "arrival", rs.getString("arr2") != null ? rs.getString("arr2") : "-")
                        ));
                        allRoutes.add(r);
                    }
                }
            } catch (SQLException e) {
                log.error("Database error finding 1-transfer routes: {}", e.getMessage());
            }
        }

        // 3. Multi-hop Graph BFS if still no routes found or transfers >= 2 requested
        if (maxTransfers >= 2 && allRoutes.isEmpty()) {
            List<String> path = bfsFindPath(from, to, maxTransfers + 1);
            if (!path.isEmpty()) {
                Map<String, Object> r = new LinkedHashMap<>();
                r.put("type", "GRAPH_MULTI_TRANSFER");
                r.put("transfers", path.size() - 2);

                List<Map<String, String>> stnList = new ArrayList<>();
                for (String c : path) {
                    stnList.add(Map.of("code", c, "name", c));
                }
                r.put("stations", stnList);
                r.put("trains", List.of(Map.of("number", "CORRIDOR_LINK", "name", "Connecting Railway Corridor")));
                allRoutes.add(r);
            }
        }

        return allRoutes;
    }

    private List<String> bfsFindPath(String start, String target, int maxDepth) {
        Queue<List<String>> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();

        queue.add(List.of(start));
        visited.add(start);

        String edgeSql = "SELECT DISTINCT to_station_code FROM rail_edges WHERE from_station_code = ? LIMIT 20;";

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(edgeSql)) {

            while (!queue.isEmpty()) {
                List<String> path = queue.poll();
                if (path.size() > maxDepth + 1) continue;

                String current = path.get(path.size() - 1);
                if (current.equals(target)) {
                    return path;
                }

                ps.setString(1, current);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        String neighbor = rs.getString("to_station_code");
                        if (!visited.contains(neighbor)) {
                            visited.add(neighbor);
                            List<String> nextPath = new ArrayList<>(path);
                            nextPath.add(neighbor);
                            if (neighbor.equals(target)) {
                                return nextPath;
                            }
                            if (nextPath.size() <= maxDepth) {
                                queue.add(nextPath);
                            }
                        }
                    }
                }
            }
        } catch (SQLException e) {
            log.error("Database error during BFS pathfinding: {}", e.getMessage());
        }

        return Collections.emptyList();
    }

    @Override
    public long countEdges() {
        String sql = "SELECT COUNT(*) FROM rail_edges;";
        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            log.error("Database error counting rail edges: {}", e.getMessage());
        }
        return 0L;
    }

    @Override
    public long countDistinctSegments() {
        String sql = "SELECT COUNT(DISTINCT from_station_code || '->' || to_station_code) FROM rail_edges;";
        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            log.error("Database error counting distinct segments: {}", e.getMessage());
        }
        return 0L;
    }
}
