/**
 * AnalyticsRepository — Data access for historical railway data and system analytics
 */
const { getDatabase } = require('../../database/db');

class AnalyticsRepository {
    /**
     * Get historical data with filters and pagination
     */
    static findHistorical({ year, gauge, category, metric_name, limit = 100, offset = 0 } = {}) {
        const db = getDatabase();
        let query = 'SELECT * FROM historical_railway_data';
        const params = [];
        const conditions = [];

        if (year && year !== 'ALL') { conditions.push('year = ?'); params.push(year); }
        if (gauge && gauge !== 'ALL') { conditions.push('gauge = ?'); params.push(gauge); }
        if (category && category !== 'ALL') { conditions.push('category = ?'); params.push(category); }
        if (metric_name) { conditions.push('metric_name LIKE ?'); params.push(`%${metric_name}%`); }

        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        query += ' ORDER BY year ASC, category ASC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return db.prepare(query).all(...params);
    }

    /**
     * Count historical records with filters
     */
    static countHistorical(filters = {}) {
        const db = getDatabase();
        let query = 'SELECT COUNT(*) as count FROM historical_railway_data';
        const params = [];
        const conditions = [];

        if (filters.year && filters.year !== 'ALL') { conditions.push('year = ?'); params.push(filters.year); }
        if (filters.gauge && filters.gauge !== 'ALL') { conditions.push('gauge = ?'); params.push(filters.gauge); }
        if (filters.category && filters.category !== 'ALL') { conditions.push('category = ?'); params.push(filters.category); }

        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        return db.prepare(query).get(...params).count;
    }

    /**
     * Get distinct years available in historical data
     */
    static getYears() {
        const db = getDatabase();
        return db.prepare('SELECT DISTINCT year FROM historical_railway_data ORDER BY year ASC').all().map(r => r.year);
    }

    /**
     * Get distinct gauges
     */
    static getGauges() {
        const db = getDatabase();
        return db.prepare('SELECT DISTINCT gauge FROM historical_railway_data WHERE gauge IS NOT NULL ORDER BY gauge').all().map(r => r.gauge);
    }

    /**
     * Get distinct categories
     */
    static getCategories() {
        const db = getDatabase();
        return db.prepare('SELECT DISTINCT category FROM historical_railway_data ORDER BY category').all().map(r => r.category);
    }

    /**
     * Get summary statistics
     */
    static getSummary() {
        const db = getDatabase();

        const totalRecords = db.prepare('SELECT COUNT(*) as count FROM historical_railway_data').get().count;
        const yearRange = db.prepare('SELECT MIN(year) as min_year, MAX(year) as max_year FROM historical_railway_data').get();
        const gaugeBreakdown = db.prepare(`
            SELECT gauge, COUNT(*) as count
            FROM historical_railway_data
            WHERE gauge IS NOT NULL
            GROUP BY gauge ORDER BY count DESC
        `).all();
        const categoryBreakdown = db.prepare(`
            SELECT category, COUNT(*) as count
            FROM historical_railway_data
            GROUP BY category ORDER BY count DESC
        `).all();

        return {
            total_records: totalRecords,
            year_range: yearRange,
            gauge_breakdown: gaugeBreakdown,
            category_breakdown: categoryBreakdown
        };
    }

    /**
     * Get time-series data for a specific metric across years
     */
    static getTimeSeries(metricName, gauge = null) {
        const db = getDatabase();
        let query = `
            SELECT year, metric_value, gauge
            FROM historical_railway_data
            WHERE metric_name LIKE ?
        `;
        const params = [`%${metricName}%`];

        if (gauge && gauge !== 'ALL') {
            query += ' AND gauge = ?';
            params.push(gauge);
        }

        query += ' ORDER BY year ASC';
        return db.prepare(query).all(...params);
    }

    /**
     * Log a system metric
     */
    static logMetric(key, value) {
        const db = getDatabase();
        db.prepare('INSERT INTO system_analytics (metric_key, metric_val) VALUES (?, ?)').run(key, String(value));
    }
}

module.exports = AnalyticsRepository;
