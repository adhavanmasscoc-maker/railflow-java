package com.railflow.repository;

import com.railflow.model.PnrRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * SQLite JDBC implementation of PnrRepository for instant local cached PNR queries.
 */
@Repository
public class SQLitePnrRepository implements PnrRepository {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SQLitePnrRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<PnrRecord> rowMapper = (rs, rowNum) -> mapRow(rs);

    private PnrRecord mapRow(ResultSet rs) throws SQLException {
        PnrRecord record = new PnrRecord();
        record.setPnrNumber(rs.getString("pnr_number"));
        record.setTrainNumber(rs.getString("train_number"));
        record.setTrainName(rs.getString("train_name"));
        record.setTravelDate(rs.getString("travel_date"));
        record.setClassType(rs.getString("class_type"));
        record.setChartStatus(rs.getString("chart_status"));
        record.setFromStationCode(rs.getString("from_station_code"));
        record.setFromStationName(rs.getString("from_station_name"));
        record.setToStationCode(rs.getString("to_station_code"));
        record.setToStationName(rs.getString("to_station_name"));
        record.setBoardingCode(rs.getString("boarding_code"));
        record.setBoardingName(rs.getString("boarding_name"));
        record.setBookingStatus(rs.getString("booking_status"));
        record.setCurrentStatus(rs.getString("current_status"));
        record.setPassengersJson(rs.getString("passengers_json"));

        String createdAt = rs.getString("created_at");
        if (createdAt != null && !createdAt.isEmpty()) {
            try {
                record.setCreatedAt(LocalDateTime.parse(createdAt, FORMATTER));
            } catch (Exception e) {
                record.setCreatedAt(LocalDateTime.now());
            }
        }
        return record;
    }

    @Override
    public Optional<PnrRecord> findByPnr(String pnr) {
        String sql = "SELECT * FROM pnr_records WHERE pnr_number = ? LIMIT 1";
        List<PnrRecord> results = jdbcTemplate.query(sql, rowMapper, pnr);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public PnrRecord save(PnrRecord record) {
        String sql = """
            INSERT INTO pnr_records (
                pnr_number, train_number, train_name, travel_date, class_type,
                chart_status, from_station_code, from_station_name,
                to_station_code, to_station_name, boarding_code, boarding_name,
                booking_status, current_status, passengers_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(pnr_number) DO UPDATE SET
                train_number = excluded.train_number,
                train_name = excluded.train_name,
                travel_date = excluded.travel_date,
                class_type = excluded.class_type,
                chart_status = excluded.chart_status,
                from_station_code = excluded.from_station_code,
                from_station_name = excluded.from_station_name,
                to_station_code = excluded.to_station_code,
                to_station_name = excluded.to_station_name,
                booking_status = excluded.booking_status,
                current_status = excluded.current_status,
                passengers_json = excluded.passengers_json,
                created_at = excluded.created_at
        """;

        String created = (record.getCreatedAt() != null ? record.getCreatedAt() : LocalDateTime.now()).format(FORMATTER);

        jdbcTemplate.update(sql,
                record.getPnrNumber(),
                record.getTrainNumber(),
                record.getTrainName(),
                record.getTravelDate(),
                record.getClassType(),
                record.getChartStatus(),
                record.getFromStationCode(),
                record.getFromStationName(),
                record.getToStationCode(),
                record.getToStationName(),
                record.getBoardingCode(),
                record.getBoardingName(),
                record.getBookingStatus(),
                record.getCurrentStatus(),
                record.getPassengersJson(),
                created
        );
        return record;
    }

    @Override
    public List<PnrRecord> findRecent(int limit) {
        String sql = "SELECT * FROM pnr_records ORDER BY created_at DESC LIMIT ?";
        return jdbcTemplate.query(sql, rowMapper, limit);
    }

    @Override
    public long count() {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM pnr_records", Long.class);
        return count != null ? count : 0L;
    }

    @Override
    public boolean existsByPnr(String pnr) {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM pnr_records WHERE pnr_number = ?", Integer.class, pnr);
        return count != null && count > 0;
    }
}
