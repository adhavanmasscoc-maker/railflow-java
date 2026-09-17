/**
 * Platform API Endpoints
 */
const PlatformRepository = require('../repositories/PlatformRepository');

/**
 * GET /api/platforms?status=crowded&limit=100
 */
exports.list = (req, res, next) => {
    try {
        const { status, limit = 100, offset = 0 } = req.query;
        const platforms = PlatformRepository.findAll({
            status: status || null,
            limit: Math.min(parseInt(limit) || 100, 500),
            offset: parseInt(offset) || 0
        });
        res.json({ data: platforms, count: platforms.length });
    } catch (err) { next(err); }
};

/**
 * GET /api/platforms/summary
 */
exports.summary = (req, res, next) => {
    try {
        const summary = PlatformRepository.getSummary();
        res.json({ data: summary });
    } catch (err) { next(err); }
};

/**
 * GET /api/platforms/:stationCode
 */
exports.getByStation = (req, res, next) => {
    try {
        const code = req.params.stationCode;
        const platforms = PlatformRepository.findByStation(code);
        res.json({ data: platforms, station_code: code.toUpperCase(), count: platforms.length });
    } catch (err) { next(err); }
};

/**
 * POST /api/platforms/:stationCode/:platformNumber/crowd
 * Body: { passengers: 250 }
 */
exports.updateCrowd = (req, res, next) => {
    try {
        const { stationCode, platformNumber } = req.params;
        const { passengers } = req.body;

        if (passengers === undefined || typeof passengers !== 'number' || passengers < 0) {
            return res.status(400).json({
                type: 'about:blank', title: 'Bad Request', status: 400,
                detail: '"passengers" must be a non-negative number'
            });
        }

        const result = PlatformRepository.updateCrowd(stationCode, parseInt(platformNumber), passengers);
        if (result.changes === 0) {
            return res.status(404).json({
                type: 'about:blank', title: 'Not Found', status: 404,
                detail: `Platform ${platformNumber} at station ${stationCode.toUpperCase()} not found`
            });
        }

        res.json({ status: 'updated', station_code: stationCode.toUpperCase(), platform: parseInt(platformNumber), passengers });
    } catch (err) { next(err); }
};
