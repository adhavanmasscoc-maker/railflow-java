/**
 * FeedbackRepository — Data access layer for structured user feedback in SQLite
 */
const { getDatabase } = require('../../database/db');

class FeedbackRepository {
    constructor() {
        this._db = null;
    }

    get db() {
        if (!this._db) this._db = getDatabase();
        return this._db;
    }

    /**
     * Insert structured feedback
     */
    create({ rating, category, sentiment, quick_tags, journey_rating, feature_request, source_view, ip_hash }) {
        const stmt = this.db.prepare(`
            INSERT INTO feedback (
                rating, category, sentiment, quick_tags,
                journey_rating, feature_request, source_view, ip_hash
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const tagsJson = Array.isArray(quick_tags) ? JSON.stringify(quick_tags) : (quick_tags || '[]');
        const result = stmt.run(
            Number(rating) || 5,
            String(category || 'General'),
            String(sentiment || 'Positive'),
            tagsJson,
            Number(journey_rating) || 5,
            feature_request ? String(feature_request) : null,
            String(source_view || 'web'),
            ip_hash ? String(ip_hash) : null
        );

        return this.getById(result.lastInsertRowid);
    }

    /**
     * Get feedback item by ID
     */
    getById(id) {
        return this.db.prepare('SELECT * FROM feedback WHERE id = ?').get(id);
    }

    /**
     * List feedback with optional filters and pagination
     */
    findAll({ limit = 25, offset = 0, category, sentiment } = {}) {
        let query = 'SELECT * FROM feedback WHERE 1=1';
        const params = [];

        if (category && category !== 'ALL') {
            query += ' AND category = ?';
            params.push(category);
        }

        if (sentiment && sentiment !== 'ALL') {
            query += ' AND sentiment = ?';
            params.push(sentiment);
        }

        const countStmt = query.replace('SELECT *', 'SELECT COUNT(*) as count');
        const total = this.db.prepare(countStmt).get(...params).count;

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const rows = this.db.prepare(query).all(...params);

        return {
            data: rows.map(r => ({
                ...r,
                quick_tags: (() => {
                    try { return JSON.parse(r.quick_tags); } catch { return []; }
                })()
            })),
            total,
            limit,
            offset
        };
    }

    /**
     * Get statistical summary of feedback
     */
    getStats() {
        const total = this.db.prepare('SELECT COUNT(*) as cnt FROM feedback').get().cnt;
        if (total === 0) {
            return {
                total: 0,
                avg_rating: 5.0,
                sentiment_breakdown: {},
                category_breakdown: {},
                recent_tags: []
            };
        }

        const avg = this.db.prepare('SELECT AVG(rating) as avg_r FROM feedback').get().avg_r;
        const sentiments = this.db.prepare('SELECT sentiment, COUNT(*) as cnt FROM feedback GROUP BY sentiment').all();
        const categories = this.db.prepare('SELECT category, COUNT(*) as cnt FROM feedback GROUP BY category').all();

        return {
            total,
            avg_rating: Number(avg ? avg.toFixed(1) : 5.0),
            sentiment_breakdown: sentiments.reduce((acc, s) => ({ ...acc, [s.sentiment]: s.cnt }), {}),
            category_breakdown: categories.reduce((acc, c) => ({ ...acc, [c.category]: c.cnt }), {})
        };
    }
}

module.exports = new FeedbackRepository();
