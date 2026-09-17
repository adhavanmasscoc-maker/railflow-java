package com.railflow.dao;

import com.railflow.model.Train;
import com.railflow.model.TrainRoute;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JDBC Data Access Object for trains and journey stop sequences.
 */
@Repository
public class TrainDAO {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Train> TRAIN_MAPPER = (rs, rowNum) -> {
        Train t = new Train(
                rs.getString("id"),
                rs.getString("train_number"),
                rs.getString("name"),
                rs.getString("route"),
                rs.getString("source"),
                rs.getString("destination"),
                rs.getString("type"),
                rs.getInt("total_seats"),
                rs.getInt("delay_minutes")
        );
        t.setExpectedPlatform(rs.getInt("expected_platform"));
        return t;
    };

    private static final RowMapper<TrainRoute> ROUTE_MAPPER = (rs, rowNum) -> new TrainRoute(
            rs.getString("id"),
            rs.getString("train_number"),
            rs.getString("station_code"),
            rs.getString("station_name"),
            rs.getInt("sequence_number"),
            rs.getString("arrival_time"),
            rs.getString("departure_time"),
            rs.getDouble("distance_km"),
            rs.getInt("platform")
    );

    @Autowired
    public TrainDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Train> findAll() {
        String sql = "SELECT * FROM trains ORDER BY train_number ASC";
        return jdbcTemplate.query(sql, TRAIN_MAPPER);
    }

    public Optional<Train> findByNumber(String trainNumber) {
        if (trainNumber == null || trainNumber.isBlank()) return Optional.empty();
        String sql = "SELECT * FROM trains WHERE train_number = ?";
        List<Train> list = jdbcTemplate.query(sql, TRAIN_MAPPER, trainNumber.trim());
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<Train> search(String query, int limit) {
        if (query == null || query.isBlank()) return List.of();
        String q = "%" + query.trim().toUpperCase() + "%";
        String sql = """
            SELECT * FROM trains
            WHERE UPPER(train_number) LIKE ? 
               OR UPPER(name) LIKE ? 
               OR UPPER(source) LIKE ? 
               OR UPPER(destination) LIKE ?
            ORDER BY train_number ASC
            LIMIT ?
        """;
        return jdbcTemplate.query(sql, TRAIN_MAPPER, q, q, q, q, Math.max(1, limit));
    }

    public List<Train> findBetweenStations(String fromCode, String toCode) {
        String sql = """
            SELECT DISTINCT t.* FROM trains t
            JOIN train_routes r1 ON t.train_number = r1.train_number
            JOIN train_routes r2 ON t.train_number = r2.train_number
            WHERE UPPER(r1.station_code) = UPPER(?)
              AND UPPER(r2.station_code) = UPPER(?)
              AND r1.sequence_number < r2.sequence_number
            ORDER BY t.train_number ASC
        """;
        return jdbcTemplate.query(sql, TRAIN_MAPPER, fromCode.trim(), toCode.trim());
    }

    public List<TrainRoute> getRoutesForTrain(String trainNumber) {
        String sql = "SELECT * FROM train_routes WHERE train_number = ? ORDER BY sequence_number ASC";
        return jdbcTemplate.query(sql, ROUTE_MAPPER, trainNumber.trim());
    }

    public long count() {
        Long c = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM trains", Long.class);
        return c != null ? c : 0L;
    }

    public void batchInsert(List<Train> trains) {
        String sql = """
            INSERT OR IGNORE INTO trains (
                id, train_number, name, type, source, destination,
                status, delay_minutes, expected_platform, total_seats,
                booked_seats, coaches, route
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.batchUpdate(sql, trains, trains.size(), (ps, t) -> {
            ps.setString(1, t.getId());
            ps.setString(2, t.getTrainNumber());
            ps.setString(3, t.getName());
            ps.setString(4, t.getType());
            ps.setString(5, t.getSourceStation());
            ps.setString(6, t.getDestinationStation());
            ps.setString(7, t.getStatus().name());
            ps.setInt(8, t.getDelayMinutes());
            ps.setInt(9, t.getExpectedPlatform());
            ps.setInt(10, t.getTotalCapacity());
            ps.setInt(11, t.getCurrentPassengers());
            ps.setInt(12, 22);
            ps.setString(13, t.getRoute());
        });
    }

    public void batchInsertRoutes(List<TrainRoute> routes) {
        String sql = """
            INSERT OR IGNORE INTO train_routes (
                id, train_number, station_code, station_name,
                sequence_number, arrival_time, departure_time, distance_km, platform
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.batchUpdate(sql, routes, routes.size(), (ps, r) -> {
            ps.setString(1, r.getId());
            ps.setString(2, r.getTrainNumber());
            ps.setString(3, r.getStationCode());
            ps.setString(4, r.getStationName());
            ps.setInt(5, r.getSequenceNumber());
            ps.setString(6, r.getArrivalTime());
            ps.setString(7, r.getDepartureTime());
            ps.setDouble(8, r.getDistanceKm());
            ps.setInt(9, r.getPlatform());
        });
    }
}
