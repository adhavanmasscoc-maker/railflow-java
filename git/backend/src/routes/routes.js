/**
 * Route Search API Endpoints
 */
const TrainRepository = require('../repositories/TrainRepository');

/**
 * GET /api/routes/search?from=NDLS&to=CSMT
 */
exports.search = (req, res, next) => {
    try {
        const { from, to, limit = 25 } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                type: 'about:blank', title: 'Bad Request', status: 400,
                detail: 'Both "from" and "to" query parameters are required'
            });
        }

        if (!/^[A-Za-z0-9]{1,6}$/.test(from) || !/^[A-Za-z0-9]{1,6}$/.test(to)) {
            return res.status(400).json({
                type: 'about:blank', title: 'Bad Request', status: 400,
                detail: 'Station codes must be 1-6 alphanumeric characters'
            });
        }

        const trains = TrainRepository.findBetweenStations(from, to, Math.min(parseInt(limit) || 25, 100));
        res.json({
            data: trains,
            count: trains.length,
            from: from.toUpperCase(),
            to: to.toUpperCase()
        });
    } catch (err) { next(err); }
};
