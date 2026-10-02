/**
 * Feedback API Routes
 * Structured, click-based feedback stored directly in SQLite
 */
const FeedbackRepository = require('../repositories/FeedbackRepository');

/**
 * POST /api/feedback
 * Submit structured user feedback
 */
exports.create = (req, res, next) => {
    try {
        const {
            rating = 5,
            category = 'General',
            sentiment = 'Positive',
            quick_tags = [],
            journey_rating = 5,
            feature_request = null,
            source_view = 'web'
        } = req.body;

        const ipHash = require('crypto')
            .createHash('sha256')
            .update(req.ip || 'unknown')
            .digest('hex')
            .substring(0, 16);

        const record = FeedbackRepository.create({
            rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
            category: String(category),
            sentiment: String(sentiment),
            quick_tags: Array.isArray(quick_tags) ? quick_tags : [],
            journey_rating: Math.min(5, Math.max(1, parseInt(journey_rating) || 5)),
            feature_request: feature_request ? String(feature_request) : null,
            source_view: String(source_view),
            ip_hash: ipHash
        });

        res.status(201).json({
            success: true,
            message: 'Feedback recorded successfully in SQLite database',
            data: record
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/feedback
 * List feedback submissions
 */
exports.list = (req, res, next) => {
    try {
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
        const offset = Math.max(0, parseInt(req.query.offset) || 0);
        const { category, sentiment } = req.query;

        const result = FeedbackRepository.findAll({ limit, offset, category, sentiment });
        res.json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/feedback/stats
 * Aggregate metrics and sentiment distribution
 */
exports.stats = (req, res, next) => {
    try {
        const stats = FeedbackRepository.getStats();
        res.json({ data: stats });
    } catch (err) {
        next(err);
    }
};
