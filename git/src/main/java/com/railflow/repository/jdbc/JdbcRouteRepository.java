package com.railflow.repository.jdbc;

import com.railflow.database.DatabaseManager;
import com.railflow.model.TrainStop;
import com.railflow.repository.RouteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

/**
 * Pure JDBC implementation of RouteRepository for querying ordered stops and direct trains.
 */
@Repository("jdbcRouteRepository")
public class JdbcRouteRepository implements RouteRepository {

    private static final Logger log = LoggerFactory.getLogger(JdbcRouteRepository.class);
    private final DatabaseManager databaseManager;

    public JdbcRouteRepository(DatabaseManager databaseManager) {
        this.databaseManager = databaseManager;
    }

    @Override
    public List<TrainStop> getStopsByTrainNumber(String trainNumber) {
        List<TrainStop> stops = new ArrayList<>();
        if (trainNumber == null || trainNumber.trim().isEmpty()) {
            return stops;
        }

        String sql = """
            SELECT ts.train_number, ts.stop_sequence, ts.station_code, 
                   COALESCE(s.station_name, ts.station_code) AS station_name,
                   ts.arrival_time, ts.departure_time, ts.journey_day, ts.distance_km
            FROM train_stops ts
            LEFT JOIN stations s ON ts.station_code = s.station_code
            WHERE ts.train_number = ?
            ORDER BY ts.stop_sequence ASC;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, trainNumber.trim());
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    stops.add(new TrainStop(
                        rs.getString("train_number"),
                        rs.getInt("stop_sequence"),
                        rs.getString("station_code"),
                        rs.getString("station_name"),
                        rs.getString("arrival_time"),
                        rs.getString("departure_time"),
                        rs.getInt("journey_day"),
                        rs.getDouble("distance_km")
                    ));
                }
            }
        } catch (SQLException e) {
            log.error("Database error retrieving stops for train {}: {}", trainNumber, e.getMessage());
        }
        return stops;
    }

    @Override
    public List<TrainStop> getStopsByStationCode(String stationCode, int limit) {
        List<TrainStop> stops = new ArrayList<>();
        if (stationCode == null || stationCode.trim().isEmpty()) return stops;

        String sql = """
            SELECT ts.train_number, ts.stop_sequence, ts.station_code,
                   COALESCE(s.station_name, ts.station_code) AS station_name,
                   ts.arrival_time, ts.departure_time, ts.journey_day, ts.distance_km
            FROM train_stops ts
            LEFT JOIN stations s ON ts.station_code = s.station_code
            WHERE ts.station_code = ?
            ORDER BY ts.departure_time ASC
            LIMIT ?;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, stationCode.trim().toUpperCase());
            ps.setInt(2, Math.max(1, limit));
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    stops.add(new TrainStop(
                        rs.getString("train_number"),
                        rs.getInt("stop_sequence"),
                        rs.getString("station_code"),
                        rs.getString("station_name"),
                        rs.getString("arrival_time"),
                        rs.getString("departure_time"),
                        rs.getInt("journey_day"),
                        rs.getDouble("distance_km")
                    ));
                }
            }
        } catch (SQLException e) {
            log.error("Database error getting stops for station {}: {}", stationCode, e.getMessage());
        }
        return stops;
    }

    @Override
    public List<Map<String, Object>> findDirectTrains(String fromStationCode, String toStationCode) {
        List<Map<String, Object>> directTrains = new ArrayList<>();
        if (fromStationCode == null || toStationCode == null) return directTrains;

        String from = fromStationCode.trim().toUpperCase();
        String to = toStationCode.trim().toUpperCase();
        if (from.equals(to)) return directTrains;

        // Ensure from_sequence < to_sequence within the same train route
        String sql = """
            SELECT t.train_number, t.train_name, t.train_type,
                   s1.stop_sequence AS from_seq, s2.stop_sequence AS to_seq,
                   s1.departure_time, s2.arrival_time,
                   s1.journey_day AS from_day, s2.journey_day AS to_day,
                   s1.distance_km AS from_dist, s2.distance_km AS to_dist,
                   COALESCE(rd.frequency_text, 'Daily') AS frequency
            FROM train_stops s1
            JOIN train_stops s2 ON s1.train_id = s2.train_id
            JOIN trains t ON t.id = s1.train_id
            LEFT JOIN train_running_days rd ON rd.train_id = t.id
            WHERE s1.station_code = ?
              AND s2.station_code = ?
              AND s1.stop_sequence < s2.stop_sequence
            ORDER BY (s2.stop_sequence - s1.stop_sequence) ASC, t.train_number ASC;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, from);
            ps.setString(2, to);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> match = new LinkedHashMap<>();
                    String trainNo = rs.getString("train_number");
                    match.put("trainNumber", trainNo);
                    match.put("trainName", rs.getString("train_name"));
                    match.put("trainType", rs.getString("train_type"));
                    match.put("fromStationCode", from);
                    match.put("toStationCode", to);
                    match.put("departureTime", rs.getString("departure_time"));
                    match.put("arrivalTime", rs.getString("arrival_time"));
                    match.put("fromSequence", rs.getInt("from_seq"));
                    match.put("toSequence", rs.getInt("to_seq"));
                    match.put("frequency", rs.getString("frequency"));

                    double d1 = rs.getDouble("from_dist");
                    double d2 = rs.getDouble("to_dist");
                    double dist = (d2 > d1) ? (d2 - d1) : 0.0;
                    match.put("distanceKm", Math.round(dist));

                    directTrains.add(match);
                }
            }
        } catch (SQLException e) {
            log.error("Database error in findDirectTrains ({} -> {}): {}", from, to, e.getMessage());
        }
        return directTrains;
    }

    @Override
    public long countStops() {
        String sql = "SELECT COUNT(*) FROM train_stops;";
        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            log.error("Database error counting train stops: {}", e.getMessage());
        }
        return 0L;
    }
}
