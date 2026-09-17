package com.railflow.repository;

import com.railflow.model.RailwayRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * High-performance SQLite-backed repository for empirical Indian Railways master CSV dataset.
 * Supports parameterized dynamic filtering, pagination, and sub-millisecond aggregate grouping.
 */
@Repository
public class SQLiteRailwayRecordRepository implements RailwayRecordRepository {

    private static final Logger log = LoggerFactory.getLogger(SQLiteRailwayRecordRepository.class);

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SQLiteRailwayRecordRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<RailwayRecord> rowMapper = (rs, rowNum) -> mapRow(rs);

    private RailwayRecord mapRow(ResultSet rs) throws SQLException {
        return new RailwayRecord(
                rs.getString("source_pdf"),
                rs.getString("source_page"),
                rs.getString("year"),
                rs.getString("category"),
                rs.getDouble("broad_gauge_metric"),
                rs.getDouble("metre_gauge_metric"),
                rs.getDouble("narrow_gauge_metric"),
                rs.getDouble("total_metric"),
                rs.getInt("is_valid") == 1
        );
    }

    @Override
    public long count() {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM railway_records", Long.class);
        return count != null ? count : 0L;
    }

    @Override
    public long countByCategory(String category) {
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM railway_records WHERE LOWER(category) LIKE LOWER(?)",
                Long.class,
                "%" + category + "%"
        );
        return count != null ? count : 0L;
    }

    @Override
    public List<RailwayRecord> findPaginated(int page, int size, String category, String year, String search) {
        StringBuilder sql = new StringBuilder("SELECT source_pdf, source_page, year, category, broad_gauge_metric, metre_gauge_metric, narrow_gauge_metric, total_metric, is_valid FROM railway_records WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            sql.append("AND LOWER(category) LIKE LOWER(?) ");
            params.add("%" + category.trim() + "%");
        }

        if (year != null && !year.trim().isEmpty() && !year.equalsIgnoreCase("ALL")) {
            sql.append("AND year = ? ");
            params.add(year.trim());
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(category) LIKE LOWER(?) OR LOWER(source_pdf) LIKE LOWER(?) OR year LIKE ?) ");
            String wild = "%" + search.trim() + "%";
            params.add(wild);
            params.add(wild);
            params.add(wild);
        }

        sql.append("ORDER BY id ASC LIMIT ? OFFSET ?");
        params.add(Math.max(1, size));
        params.add(Math.max(0, page * size));

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    @Override
    public List<String> findDistinctCategories() {
        return jdbcTemplate.queryForList(
                "SELECT DISTINCT category FROM railway_records WHERE category IS NOT NULL AND TRIM(category) != '' ORDER BY category ASC",
                String.class
        );
    }

    @Override
    public List<String> findDistinctYears() {
        return jdbcTemplate.queryForList(
                "SELECT DISTINCT year FROM railway_records WHERE year IS NOT NULL AND year != 'Unknown' ORDER BY year DESC",
                String.class
        );
    }

    @Override
    public Map<String, Long> getCategorySummary() {
        Map<String, Long> summary = new LinkedHashMap<>();
        String sql = "SELECT category, COUNT(*) as cnt FROM railway_records GROUP BY category ORDER BY cnt DESC";
        jdbcTemplate.query(sql, rs -> {
            String cat = rs.getString("category");
            if (cat == null || cat.trim().isEmpty()) cat = "General";
            summary.put(cat, rs.getLong("cnt"));
        });
        return summary;
    }

    @Override
    @Transactional
    public void batchInsert(List<RailwayRecord> records) {
        if (records == null || records.isEmpty()) return;

        String sql = """
            INSERT INTO railway_records (
                source_pdf, source_page, year, category,
                broad_gauge_metric, metre_gauge_metric, narrow_gauge_metric,
                total_metric, is_valid
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;

        final int batchSize = 1000;
        for (int i = 0; i < records.size(); i += batchSize) {
            final List<RailwayRecord> batch = records.subList(i, Math.min(i + batchSize, records.size()));
            jdbcTemplate.batchUpdate(sql, batch, batch.size(), (ps, record) -> {
                ps.setString(1, record.getSourcePdf());
                ps.setString(2, record.getSourcePage());
                ps.setString(3, record.getYear());
                ps.setString(4, record.getCategory());
                ps.setDouble(5, record.getBroadGaugeMetric());
                ps.setDouble(6, record.getMetreGaugeMetric());
                ps.setDouble(7, record.getNarrowGaugeMetric());
                ps.setDouble(8, record.getTotalMetric());
                ps.setInt(9, record.isValid() ? 1 : 0);
            });
        }
        log.info("Successfully batch inserted {} CSV records into SQLite 'railway_records' table.", records.size());
    }

    @Override
    public void save(RailwayRecord record) {
        String sql = """
            INSERT INTO railway_records (
                source_pdf, source_page, year, category,
                broad_gauge_metric, metre_gauge_metric, narrow_gauge_metric,
                total_metric, is_valid
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                record.getSourcePdf(),
                record.getSourcePage(),
                record.getYear(),
                record.getCategory(),
                record.getBroadGaugeMetric(),
                record.getMetreGaugeMetric(),
                record.getNarrowGaugeMetric(),
                record.getTotalMetric(),
                record.isValid() ? 1 : 0
        );
    }
}
