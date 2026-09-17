package com.railflow.dao;

import com.railflow.enums.FeedbackCategory;
import com.railflow.enums.FeedbackStatus;
import com.railflow.model.Feedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * JDBC Data Access Object for persisting and analyzing user reviews and system feedback.
 */
@Repository
public class FeedbackDAO {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Feedback> ROW_MAPPER = (rs, rowNum) -> {
        Feedback fb = new Feedback();
        fb.setId(rs.getLong("id"));
        fb.setName(rs.getString("name"));
        fb.setRating(rs.getInt("rating"));
        fb.setCategory(FeedbackCategory.fromString(rs.getString("category")));
        fb.setMessage(rs.getString("message"));
        fb.setPage(rs.getString("page"));
        fb.setStatus(FeedbackStatus.fromString(rs.getString("status")));

        String created = rs.getString("created_at");
        if (created != null && !created.isBlank()) {
            try {
                fb.setCreatedAt(LocalDateTime.parse(created, FORMATTER));
            } catch (Exception e) {
                fb.setCreatedAt(LocalDateTime.now());
            }
        }
        return fb;
    };

    @Autowired
    public FeedbackDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Feedback save(Feedback feedback) {
        String sql = """
            INSERT INTO feedback (name, rating, category, message, page, created_at, status)
            VALUES (?, ?, ?, ?, ?, datetime('now'), ?)
        """;
        jdbcTemplate.update(sql,
                feedback.getName(),
                feedback.getRating(),
                feedback.getCategory().name(),
                feedback.getMessage(),
                feedback.getPage(),
                feedback.getStatus().name()
        );
        Long id = jdbcTemplate.queryForObject("SELECT last_insert_rowid()", Long.class);
        feedback.setId(id);
        return feedback;
    }

    public List<Feedback> findAll(int limit) {
        String sql = "SELECT * FROM feedback ORDER BY id DESC LIMIT ?";
        return jdbcTemplate.query(sql, ROW_MAPPER, Math.max(1, limit));
    }

    public Map<String, Object> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        Long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM feedback", Long.class);
        Double avgRating = jdbcTemplate.queryForObject("SELECT AVG(rating) FROM feedback", Double.class);
        
        List<Map<String, Object>> categoryCounts = jdbcTemplate.queryForList("""
            SELECT category, COUNT(*) as count 
            FROM feedback 
            GROUP BY category 
            ORDER BY count DESC
        """);

        String topCategory = categoryCounts.isEmpty() ? "GENERAL" : (String) categoryCounts.get(0).get("category");

        stats.put("totalReviews", total != null ? total : 0L);
        stats.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 5.0);
        stats.put("mostCommonCategory", topCategory);
        stats.put("categoryBreakdown", categoryCounts);

        return stats;
    }
}
