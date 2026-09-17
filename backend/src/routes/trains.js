/**
 * Train API Endpoints
 */
const TrainRepository = require('../repositories/TrainRepository');

/**
 * GET /api/trains?limit=50&offset=0&type=Rajdhani
 */
exports.list = (req, res, next) => {
    try {
        const { limit = 50, offset = 0, type } = req.query;
        const trains = TrainRepository.findAll({
            limit: Math.min(parseInt(limit) || 50, 500),
            offset: parseInt(offset) || 0,
            type: type || null
        });
        const total = TrainRepository.count({ type });
        res.json({ data: trains, total, limit: parseInt(limit) || 50, offset: parseInt(offset) || 0 });
    } catch (err) { next(err); }
};

/**
 * GET /api/trains/search?q=Rajdhani
 */
exports.search = (req, res, next) => {
    try {
        const { q, limit = 25 } = req.query;
        if (!q || q.trim().length < 1) {
            return res.status(400).json({ type: 'about:blank', title: 'Bad Request', status: 400, detail: 'Query parameter "q" is required' });
        }
        const results = TrainRepository.search(q.trim(), Math.min(parseInt(limit) || 25, 100));
        res.json({ data: results, count: results.length, query: q.trim() });
    } catch (err) { next(err); }
};

/**
 * GET /api/trains/:number
 */
exports.getByNumber = (req, res, next) => {
    try {
        const number = req.params.number;
        if (!number || !/^\d{4,5}$/.test(number)) {
            return res.status(400).json({ type: 'about:blank', title: 'Bad Request', status: 400, detail: 'Train number must be 4-5 digits' });
        }
        const train = TrainRepository.findByNumber(number);
        if (!train) {
            return res.status(404).json({ type: 'about:blank', title: 'Not Found', status: 404, detail: `Train #${number} not found` });
        }
        // Also fetch route
        const route = TrainRepository.getRoute(number);
        res.json({ data: { ...train, route } });
    } catch (err) { next(err); }
};

/**
 * GET /api/trains/:number/route
 */
exports.getRoute = (req, res, next) => {
    try {
        const number = req.params.number;
        const route = TrainRepository.getRoute(number);
        if (!route || route.length === 0) {
            return res.status(404).json({ type: 'about:blank', title: 'Not Found', status: 404, detail: `Route for train #${number} not found` });
        }
        res.json({ data: route, train_number: number, stops: route.length });
    } catch (err) { next(err); }
};

/**
 * GET /api/trains/types
 */
exports.types = (req, res, next) => {
    try {
        const types = TrainRepository.getTypes();
        res.json({ data: types });
    } catch (err) { next(err); }
};
