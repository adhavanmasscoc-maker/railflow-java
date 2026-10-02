/**
 * Station API Endpoints
 */
const StationRepository = require('../repositories/StationRepository');

/**
 * GET /api/stations?limit=50&offset=0&zone=NR&state=Delhi
 */
exports.list = (req, res, next) => {
    try {
        const { limit = 50, offset = 0, zone, state } = req.query;
        const stations = StationRepository.findAll({
            limit: Math.min(parseInt(limit) || 50, 500),
            offset: parseInt(offset) || 0,
            zone: zone || null,
            state: state || null
        });
        const total = StationRepository.count({ zone, state });
        res.json({ data: stations, total, limit: parseInt(limit) || 50, offset: parseInt(offset) || 0 });
    } catch (err) { next(err); }
};

/**
 * GET /api/stations/search?q=DEL
 */
exports.search = (req, res, next) => {
    try {
        const { q, limit = 25 } = req.query;
        if (!q || q.trim().length < 1) {
            return res.status(400).json({ type: 'about:blank', title: 'Bad Request', status: 400, detail: 'Query parameter "q" is required' });
        }
        const results = StationRepository.search(q.trim(), Math.min(parseInt(limit) || 25, 100));
        res.json({ data: results, count: results.length, query: q.trim() });
    } catch (err) { next(err); }
};

/**
 * GET /api/stations/:code
 */
exports.getByCode = (req, res, next) => {
    try {
        const code = req.params.code;
        if (!code || !/^[A-Za-z0-9]{1,6}$/.test(code)) {
            return res.status(400).json({ type: 'about:blank', title: 'Bad Request', status: 400, detail: 'Station code must be 1-6 alphanumeric characters' });
        }
        const station = StationRepository.findByCode(code);
        if (!station) {
            return res.status(404).json({ type: 'about:blank', title: 'Not Found', status: 404, detail: `Station with code "${code.toUpperCase()}" not found` });
        }
        res.json({ data: station });
    } catch (err) { next(err); }
};

/**
 * GET /api/stations/:code/trains
 */
exports.getTrains = (req, res, next) => {
    try {
        const code = req.params.code;
        const { limit = 50 } = req.query;
        const trains = StationRepository.getTrainsAtStation(code, Math.min(parseInt(limit) || 50, 200));
        res.json({ data: trains, count: trains.length, station_code: code.toUpperCase() });
    } catch (err) { next(err); }
};

/**
 * GET /api/stations/zones
 */
exports.zones = (req, res, next) => {
    try {
        const zones = StationRepository.getZones();
        res.json({ data: zones });
    } catch (err) { next(err); }
};

/**
 * GET /api/stations/states
 */
exports.states = (req, res, next) => {
    try {
        const states = StationRepository.getStates();
        res.json({ data: states });
    } catch (err) { next(err); }
};
