/**
 * StationRepository — Prepared-statement data access for stations table
 */
const { getDatabase } = require('../../database/db');

class StationRepository {
    /**
     * Get all stations with optional pagination
     */
    static findAll({ limit = 50, offset = 0, zone = null, state = null } = {}) {
        const db = getDatabase();
        let query = 'SELECT * FROM stations';
        const params = [];
        const conditions = [];

        if (zone) { conditions.push('zone = ?'); params.push(zone); }
        if (state) { conditions.push('state = ?'); params.push(state); }

        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return db.prepare(query).all(...params);
    }

    /**
     * Find station by code (exact match)
     */
    static findByCode(code) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM stations WHERE code = ?').get(code.toUpperCase());
    }

    /**
     * Search stations by name or code prefix
     */
    static search(query, limit = 25) {
        const db = getDatabase();
        const q = query.toUpperCase().trim();
        return db.prepare(`
            SELECT * FROM stations
            WHERE code LIKE ? OR UPPER(name) LIKE ?
            ORDER BY
                CASE WHEN code = ? THEN 0
                     WHEN code LIKE ? THEN 1
                     WHEN UPPER(name) LIKE ? THEN 2
                     ELSE 3
                END,
                name ASC
            LIMIT ?
        `).all(`${q}%`, `%${q}%`, q, `${q}%`, `${q}%`, limit);
    }

    /**
     * Get total station count
     */
    static count(filters = {}) {
        const db = getDatabase();
        let query = 'SELECT COUNT(*) as count FROM stations';
        const params = [];
        const conditions = [];

        if (filters.zone) { conditions.push('zone = ?'); params.push(filters.zone); }
        if (filters.state) { conditions.push('state = ?'); params.push(filters.state); }

        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        return db.prepare(query).get(...params).count;
    }

    /**
     * Get distinct zones
     */
    static getZones() {
        const db = getDatabase();
        return db.prepare('SELECT DISTINCT zone FROM stations WHERE zone IS NOT NULL ORDER BY zone').all().map(r => r.zone);
    }

    /**
     * Get distinct states
     */
    static getStates() {
        const db = getDatabase();
        return db.prepare('SELECT DISTINCT state FROM stations WHERE state IS NOT NULL ORDER BY state').all().map(r => r.state);
    }

    /**
     * Get trains passing through a station
     */
    static getTrainsAtStation(stationCode, limit = 50) {
        const db = getDatabase();
        return db.prepare(`
            SELECT ts.*, t.name as train_name, t.type as train_type,
                   t.source_name, t.dest_name
            FROM train_stations ts
            JOIN trains t ON ts.train_number = t.number
            WHERE ts.station_code = ?
            ORDER BY ts.departure_time ASC
            LIMIT ?
        `).all(stationCode.toUpperCase(), limit);
    }
}

module.exports = StationRepository;
