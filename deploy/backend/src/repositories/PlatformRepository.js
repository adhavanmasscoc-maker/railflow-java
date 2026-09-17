/**
 * PlatformRepository — Data access for platform crowd monitoring
 */
const { getDatabase } = require('../../database/db');

class PlatformRepository {
    /**
     * Get all platforms for a station
     */
    static findByStation(stationCode) {
        const db = getDatabase();
        return db.prepare(`
            SELECT * FROM platforms
            WHERE station_code = ?
            ORDER BY platform_number ASC
        `).all(stationCode.toUpperCase());
    }

    /**
     * Get all platforms with optional status filter
     */
    static findAll({ status = null, limit = 100, offset = 0 } = {}) {
        const db = getDatabase();
        let query = 'SELECT p.*, s.name as station_name FROM platforms p LEFT JOIN stations s ON p.station_code = s.code';
        const params = [];

        if (status) {
            query += ' WHERE p.status = ?';
            params.push(status);
        }

        query += ' ORDER BY p.station_code, p.platform_number LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return db.prepare(query).all(...params);
    }

    /**
     * Update crowd count for a platform
     */
    static updateCrowd(stationCode, platformNumber, passengers) {
        const db = getDatabase();
        const capacity = 500;
        let status = 'normal';
        const ratio = passengers / capacity;
        if (ratio > 0.9) status = 'critical';
        else if (ratio > 0.7) status = 'crowded';

        return db.prepare(`
            UPDATE platforms SET
                current_passengers = ?,
                status = ?,
                last_updated = datetime('now')
            WHERE station_code = ? AND platform_number = ?
        `).run(passengers, status, stationCode.toUpperCase(), platformNumber);
    }

    /**
     * Get platform statistics summary
     */
    static getSummary() {
        const db = getDatabase();
        const total = db.prepare('SELECT COUNT(*) as count FROM platforms').get().count;
        const statusCounts = db.prepare(`
            SELECT status, COUNT(*) as count FROM platforms GROUP BY status
        `).all();
        const avgOccupancy = db.prepare(`
            SELECT AVG(CAST(current_passengers AS REAL) / NULLIF(capacity, 0)) as avg_ratio
            FROM platforms
        `).get();

        return {
            total_platforms: total,
            status_breakdown: statusCounts,
            avg_occupancy_ratio: avgOccupancy?.avg_ratio || 0
        };
    }
}

module.exports = PlatformRepository;
