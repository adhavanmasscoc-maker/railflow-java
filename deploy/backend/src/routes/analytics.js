/**
 * Analytics API Endpoints
 */
const AnalyticsRepository = require('../repositories/AnalyticsRepository');

/**
 * GET /api/analytics/historical?year=1990-91&gauge=BG&category=Route&limit=100&offset=0
 */
exports.historical = (req, res, next) => {
    try {
        const { year, gauge, category, metric_name, limit = 100, offset = 0 } = req.query;
        const data = AnalyticsRepository.findHistorical({
            year, gauge, category, metric_name,
            limit: Math.min(parseInt(limit) || 100, 1000),
            offset: parseInt(offset) || 0
        });
        const total = AnalyticsRepository.countHistorical({ year, gauge, category });
        res.json({ data, total, limit: parseInt(limit) || 100, offset: parseInt(offset) || 0 });
    } catch (err) { next(err); }
};

/**
 * GET /api/analytics/summary
 */
exports.summary = (req, res, next) => {
    try {
        const summary = AnalyticsRepository.getSummary();
        res.json({ data: summary });
    } catch (err) { next(err); }
};

/**
 * GET /api/analytics/years
 */
exports.years = (req, res, next) => {
    try {
        res.json({ data: AnalyticsRepository.getYears() });
    } catch (err) { next(err); }
};

/**
 * GET /api/analytics/gauges
 */
exports.gauges = (req, res, next) => {
    try {
        res.json({ data: AnalyticsRepository.getGauges() });
    } catch (err) { next(err); }
};

/**
 * GET /api/analytics/categories
 */
exports.categories = (req, res, next) => {
    try {
        res.json({ data: AnalyticsRepository.getCategories() });
    } catch (err) { next(err); }
};

/**
 * GET /api/analytics/timeseries?metric=Route Kms&gauge=BG
 */
exports.timeseries = (req, res, next) => {
    try {
        const { metric, gauge } = req.query;
        if (!metric) {
            return res.status(400).json({
                type: 'about:blank', title: 'Bad Request', status: 400,
                detail: 'Query parameter "metric" is required'
            });
        }
        const data = AnalyticsRepository.getTimeSeries(metric, gauge);
        res.json({ data, metric, gauge: gauge || 'ALL' });
    } catch (err) { next(err); }
};
