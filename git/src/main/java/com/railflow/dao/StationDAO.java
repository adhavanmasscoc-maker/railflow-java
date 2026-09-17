package com.railflow.dao;

import com.railflow.model.SearchAlias;
import com.railflow.model.Station;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * JDBC Data Access Object for stations and intelligent search aliases.
 * Strictly uses parameterized queries and PreparedStatements via JdbcTemplate.
 */
@Repository
public class StationDAO {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Station> STATION_MAPPER = (rs, rowNum) -> new Station(
            rs.getString("code"),
            rs.getString("name"),
            rs.getString("city"),
            rs.getString("zone")
    );

    @Autowired
    public StationDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Station> findAll() {
        String sql = "SELECT code, name, city, zone FROM stations ORDER BY name ASC";
        return jdbcTemplate.query(sql, STATION_MAPPER);
    }

    public Optional<Station> findByCode(String code) {
        if (code == null || code.isBlank()) return Optional.empty();
        String sql = "SELECT code, name, city, zone FROM stations WHERE UPPER(code) = UPPER(?)";
        List<Station> results = jdbcTemplate.query(sql, STATION_MAPPER, code.trim());
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Intelligent search matching exact code, prefix, station name, city, or registered alias.
     */
    public List<Station> search(String query, int limit) {
        if (query == null || query.isBlank()) return List.of();
        String q = query.trim().toUpperCase();

        String sql = """
            SELECT DISTINCT s.code, s.name, s.city, s.zone,
                CASE 
                    WHEN UPPER(s.code) = ? THEN 0
                    WHEN UPPER(s.code) LIKE ? THEN 1
                    WHEN UPPER(s.name) LIKE ? THEN 2
                    WHEN UPPER(s.city) LIKE ? THEN 3
                    WHEN EXISTS (SELECT 1 FROM search_aliases a WHERE a.station_code = s.code AND UPPER(a.alias) LIKE ?) THEN 4
                    ELSE 5
                END AS rank_score
            FROM stations s
            WHERE UPPER(s.code) LIKE ? 
               OR UPPER(s.name) LIKE ? 
               OR UPPER(s.city) LIKE ? 
               OR s.code IN (SELECT station_code FROM search_aliases WHERE UPPER(alias) LIKE ?)
            ORDER BY rank_score ASC, s.name ASC
            LIMIT ?
        """;

        String startsWith = q + "%";
        String contains = "%" + q + "%";

        return jdbcTemplate.query(sql, STATION_MAPPER,
                q, startsWith, startsWith, startsWith, startsWith,
                startsWith, contains, contains, contains,
                Math.max(1, limit)
        );
    }

    public List<Station> findByZone(String zone) {
        String sql = "SELECT code, name, city, zone FROM stations WHERE UPPER(zone) = UPPER(?) ORDER BY name ASC";
        return jdbcTemplate.query(sql, STATION_MAPPER, zone.trim());
    }

    public List<SearchAlias> getAliasesForStation(String stationCode) {
        String sql = "SELECT id, alias, station_code, alias_type FROM search_aliases WHERE UPPER(station_code) = UPPER(?)";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new SearchAlias(
                rs.getString("id"),
                rs.getString("alias"),
                rs.getString("station_code"),
                rs.getString("alias_type")
        ), stationCode.trim());
    }

    public long count() {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM stations", Long.class);
        return count != null ? count : 0L;
    }

    public void batchInsert(List<Station> stations) {
        String sql = "INSERT OR IGNORE INTO stations (id, code, name, city, zone, total_platforms) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.batchUpdate(sql, stations, stations.size(), (ps, s) -> {
            ps.setString(1, "STN-" + s.getCode());
            ps.setString(2, s.getCode());
            ps.setString(3, s.getName());
            ps.setString(4, s.getCity() != null ? s.getCity() : s.getName());
            ps.setString(5, s.getZone() != null ? s.getZone() : "IR");
            ps.setInt(6, 6);
        });
    }

    public void insertAlias(String alias, String stationCode, String aliasType) {
        String sql = "INSERT OR IGNORE INTO search_aliases (id, alias, station_code, alias_type) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, "ALS-" + System.nanoTime(), alias.toUpperCase().trim(), stationCode.toUpperCase().trim(), aliasType);
    }
}
