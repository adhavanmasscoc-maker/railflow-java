/**
 * TrainRepository — Prepared-statement data access for trains table
 */
const { getDatabase } = require('../../database/db');

class TrainRepository {
    /**
     * Get all trains with pagination
     */
    static findAll({ limit = 50, offset = 0, type = null } = {}) {
        const db = getDatabase();
        let query = 'SELECT * FROM trains';
        const params = [];

        if (type) {
            query += ' WHERE type = ?';
            params.push(type);
        }

        query += ' ORDER BY number ASC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return db.prepare(query).all(...params);
    }

    /**
     * Find train by number (exact match)
     */
    static findByNumber(number) {
        const db = getDatabase();
        return db.prepare('SELECT * FROM trains WHERE number = ?').get(String(number));
    }

    /**
     * Search trains by number or name prefix
     */
    static search(query, limit = 25) {
        const db = getDatabase();
        const q = query.toUpperCase().trim();
        return db.prepare(`
            SELECT * FROM trains
            WHERE number LIKE ? OR UPPER(name) LIKE ?
            ORDER BY
                CASE WHEN number = ? THEN 0
                     WHEN number LIKE ? THEN 1
                     WHEN UPPER(name) LIKE ? THEN 2
                     ELSE 3
                END,
                number ASC
            LIMIT ?
        `).all(`${q}%`, `%${q}%`, q, `${q}%`, `${q}%`, limit);
    }

    /**
     * Get route (station stops) for a train
     */
    static getRoute(trainNumber) {
        const db = getDatabase();
        return db.prepare(`
            SELECT ts.*, s.name as station_name_full, s.zone, s.state
            FROM train_stations ts
            LEFT JOIN stations s ON ts.station_code = s.code
            WHERE ts.train_number = ?
            ORDER BY ts.stop_sequence ASC
        `).all(String(trainNumber));
    }

    /**
     * Get total train count
     */
    static count(filters = {}) {
        const db = getDatabase();
        let query = 'SELECT COUNT(*) as count FROM trains';
        const params = [];

        if (filters.type) {
            query += ' WHERE type = ?';
            params.push(filters.type);
        }

        return db.prepare(query).get(...params).count;
    }

    /**
     * Get distinct train types
     */
    static getTypes() {
        const db = getDatabase();
        return db.prepare('SELECT DISTINCT type FROM trains WHERE type IS NOT NULL ORDER BY type').all().map(r => r.type);
    }

    /**
     * Find trains between two stations
     */
    static findBetweenStations(fromCode, toCode, limit = 25) {
        const db = getDatabase();
        return db.prepare(`
            SELECT DISTINCT t.*,
                   ts1.stop_sequence as from_seq, ts1.departure_time as dep_time,
                   ts2.stop_sequence as to_seq, ts2.arrival_time as arr_time,
                   ts2.distance_from_source - ts1.distance_from_source as distance
            FROM trains t
            JOIN train_stations ts1 ON t.number = ts1.train_number AND ts1.station_code = ?
            JOIN train_stations ts2 ON t.number = ts2.train_number AND ts2.station_code = ?
            WHERE ts1.stop_sequence < ts2.stop_sequence
            ORDER BY ts1.departure_time ASC
            LIMIT ?
        `).all(fromCode.toUpperCase(), toCode.toUpperCase(), limit);
    }
}

module.exports = TrainRepository;
