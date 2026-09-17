package com.railflow.repository.jdbc;

import com.railflow.database.DatabaseManager;
import com.railflow.model.TrainStop;
import com.railflow.repository.TimetableRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

/**
 * Pure JDBC implementation of TimetableRepository querying train_running_days and station schedules.
 */
@Repository("jdbcTimetableRepository")
public class JdbcTimetableRepository implements TimetableRepository {

    private static final Logger log = LoggerFactory.getLogger(JdbcTimetableRepository.class);
    private final DatabaseManager databaseManager;

    public JdbcTimetableRepository(DatabaseManager databaseManager) {
        this.databaseManager = databaseManager;
    }

    @Override
    public Map<String, Boolean> getRunningDays(String trainNumber) {
        Map<String, Boolean> days = new LinkedHashMap<>();
        days.put("Monday", false);
        days.put("Tuesday", false);
        days.put("Wednesday", false);
        days.put("Thursday", false);
        days.put("Friday", false);
        days.put("Saturday", false);
        days.put("Sunday", false);

        if (trainNumber == null || trainNumber.trim().isEmpty()) {
            return days;
        }

        String sql = """
            SELECT monday, tuesday, wednesday, thursday, friday, saturday, sunday
            FROM train_running_days
            WHERE train_number = ?
            LIMIT 1;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, trainNumber.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    days.put("Monday", rs.getInt("monday") == 1);
                    days.put("Tuesday", rs.getInt("tuesday") == 1);
                    days.put("Wednesday", rs.getInt("wednesday") == 1);
                    days.put("Thursday", rs.getInt("thursday") == 1);
                    days.put("Friday", rs.getInt("friday") == 1);
                    days.put("Saturday", rs.getInt("saturday") == 1);
                    days.put("Sunday", rs.getInt("sunday") == 1);
                }
            }
        } catch (SQLException e) {
            log.error("Database error getting running days for train {}: {}", trainNumber, e.getMessage());
        }
        return days;
    }

    @Override
    public String getFrequencyText(String trainNumber) {
        if (trainNumber == null) return "Daily";
        String sql = "SELECT frequency_text FROM train_running_days WHERE train_number = ? LIMIT 1;";
        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, trainNumber.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String freq = rs.getString("frequency_text");
                    if (freq != null && !freq.trim().isEmpty()) {
                        return freq;
                    }
                }
            }
        } catch (SQLException e) {
            log.error("Database error getting frequency for train {}: {}", trainNumber, e.getMessage());
        }
        return "Daily";
    }

    @Override
    public List<TrainStop> getStationTimetable(String stationCode, int limit) {
        List<TrainStop> list = new ArrayList<>();
        if (stationCode == null) return list;

        String sql = """
            SELECT ts.train_number, ts.stop_sequence, ts.station_code,
                   COALESCE(s.station_name, ts.station_code) AS station_name,
                   ts.arrival_time, ts.departure_time, ts.journey_day, ts.distance_km
            FROM train_stops ts
            LEFT JOIN stations s ON ts.station_code = s.station_code
            WHERE ts.station_code = ?
            ORDER BY COALESCE(ts.departure_time, ts.arrival_time) ASC
            LIMIT ?;
        """;

        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, stationCode.trim().toUpperCase());
            ps.setInt(2, Math.max(1, limit));
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new TrainStop(
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
            log.error("Database error getting station timetable for {}: {}", stationCode, e.getMessage());
        }
        return list;
    }

    @Override
    public long countRunningDays() {
        String sql = "SELECT COUNT(*) FROM train_running_days;";
        try (Connection conn = databaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            log.error("Database error counting running days: {}", e.getMessage());
        }
        return 0L;
    }
}
