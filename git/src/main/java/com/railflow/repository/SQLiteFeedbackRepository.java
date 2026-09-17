package com.railflow.repository;

import com.railflow.enums.FeedbackCategory;
import com.railflow.enums.FeedbackStatus;
import com.railflow.model.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * SQLite-backed implementation of FeedbackRepository.
 *
 * Demonstrates:
 * - JDBC / JdbcTemplate
 * - Parameterized SQL (PreparedStatement — never raw concatenation)
 * - RowMapper (functional interface, lambda-friendly)
 * - KeyHolder for auto-generated primary key retrieval
 * - Repository Pattern implementation
 * - java.time integration
 */
@Repository
public class SQLiteFeedbackRepository implements FeedbackRepository {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SQLiteFeedbackRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ─── RowMapper ────────────────────────────────────────────────────────────

    private final RowMapper<Feedback> feedbackRowMapper = (rs, rowNum) -> mapRow(rs);

    private Feedback mapRow(ResultSet rs) throws SQLException {
        Feedback fb = new Feedback();
        fb.setId(rs.getLong("id"));
        fb.setRating(rs.getInt("rating"));
        fb.setCategory(FeedbackCategory.fromString(rs.getString("category")));
        fb.setMessage(rs.getString("message"));
        fb.setPage(rs.getString("page"));
        fb.setStatus(FeedbackStatus.valueOf(rs.getString("status")));

        String createdAtStr = rs.getString("created_at");
        if (createdAtStr != null && !createdAtStr.isEmpty()) {
            fb.setCreatedAt(LocalDateTime.parse(createdAtStr, FORMATTER));
        } else {
            fb.setCreatedAt(LocalDateTime.now());
        }
        return fb;
    }

    // ─── INSERT ───────────────────────────────────────────────────────────────

    @Override
    public Feedback save(Feedback feedback) {
        String sql = """
                INSERT INTO feedback (rating, category, message, page, created_at, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, feedback.getRating());
            ps.setString(2, feedback.getCategory().name());
            ps.setString(3, feedback.getMessage());
            ps.setString(4, feedback.getPage() != null ? feedback.getPage() : "");
            ps.setString(5, feedback.getCreatedAt().format(FORMATTER));
            ps.setString(6, feedback.getStatus().name());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key != null) {
            feedback.setId(key.longValue());
        }
        return feedback;
    }

    // ─── QUERIES ──────────────────────────────────────────────────────────────

    @Override
    public List<Feedback> findAll() {
        String sql = "SELECT * FROM feedback ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, feedbackRowMapper);
    }

    @Override
    public List<Feedback> findRecent(int limit) {
        String sql = "SELECT * FROM feedback ORDER BY created_at DESC LIMIT ?";
        return jdbcTemplate.query(sql, feedbackRowMapper, limit);
    }

    @Override
    public Optional<Feedback> findById(long id) {
        String sql = "SELECT * FROM feedback WHERE id = ?";
        List<Feedback> results = jdbcTemplate.query(sql, feedbackRowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public long count() {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM feedback", Long.class);
        return count != null ? count : 0L;
    }
}
