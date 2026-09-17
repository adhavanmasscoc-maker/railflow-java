package com.railflow.dao;

import com.railflow.enums.PlatformStatus;
import com.railflow.model.CrowdTelemetry;
import com.railflow.model.Platform;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JDBC Data Access Object for Platforms and real-time Crowd Telemetry.
 */
@Repository
public class PlatformDAO {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Platform> PLATFORM_MAPPER = (rs, rowNum) -> {
        Platform p = new Platform(
                rs.getString("id"),
                rs.getInt("platform_number"),
                rs.getString("station_code"),
                rs.getInt("capacity"),
                4
        );
        p.updateCrowd(rs.getInt("current_crowd"));
        p.setCurrentTrainId(rs.getString("assigned_train_id"));
        return p;
    };

    private static final RowMapper<CrowdTelemetry> TELEMETRY_MAPPER = (rs, rowNum) -> new CrowdTelemetry(
            rs.getString("platform_id"),
            rs.getString("station_code"),
            rs.getInt("platform_number"),
            rs.getInt("passenger_count"),
            rs.getInt("capacity"),
            rs.getDouble("density_percentage"),
            rs.getString("status"),
            rs.getString("timestamp")
    );

    @Autowired
    public PlatformDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Platform> findAll() {
        String sql = "SELECT * FROM platforms ORDER BY station_code ASC, platform_number ASC";
        return jdbcTemplate.query(sql, PLATFORM_MAPPER);
    }

    public List<Platform> findByStation(String stationCode) {
        String sql = "SELECT * FROM platforms WHERE UPPER(station_code) = UPPER(?) ORDER BY platform_number ASC";
        return jdbcTemplate.query(sql, PLATFORM_MAPPER, stationCode.trim());
    }

    public Optional<Platform> findById(String id) {
        String sql = "SELECT * FROM platforms WHERE id = ?";
        List<Platform> list = jdbcTemplate.query(sql, PLATFORM_MAPPER, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public void updateCrowdDensity(String platformId, int newCrowd, double occupancyRate, String status) {
        String sql = "UPDATE platforms SET current_crowd = ?, status = ? WHERE id = ?";
        jdbcTemplate.update(sql, newCrowd, status, platformId);
    }

    public void recordTelemetry(CrowdTelemetry telemetry) {
        String sql = """
            INSERT INTO crowd_telemetry (
                id, platform_id, station_code, platform_number,
                passenger_count, capacity, density_percentage, status, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """;
        jdbcTemplate.update(sql,
                "TEL-" + System.nanoTime(),
                telemetry.getPlatformId(),
                telemetry.getStationCode(),
                telemetry.getPlatformNumber(),
                telemetry.getPassengerCount(),
                telemetry.getCapacity(),
                telemetry.getDensityPercentage(),
                telemetry.getStatus()
        );
    }

    public List<CrowdTelemetry> getLatestTelemetry(int limit) {
        String sql = """
            SELECT platform_id, station_code, platform_number, passenger_count, capacity, density_percentage, status, timestamp
            FROM crowd_telemetry
            ORDER BY id DESC
            LIMIT ?
        """;
        return jdbcTemplate.query(sql, TELEMETRY_MAPPER, limit);
    }

    public void batchInsert(List<Platform> platforms) {
        String sql = """
            INSERT OR IGNORE INTO platforms (
                id, platform_number, station_code, capacity,
                current_crowd, status, assigned_train_id, safety_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.batchUpdate(sql, platforms, platforms.size(), (ps, p) -> {
            ps.setString(1, p.getId());
            ps.setInt(2, p.getPlatformNumber());
            ps.setString(3, p.getStationCode());
            ps.setInt(4, p.getCapacity());
            ps.setInt(5, p.getCurrentCrowd());
            ps.setString(6, p.getStatus().name());
            ps.setString(7, p.getCurrentTrainId());
            ps.setDouble(8, 98.5);
        });
    }

    public long count() {
        Long c = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM platforms", Long.class);
        return c != null ? c : 0L;
    }
}
