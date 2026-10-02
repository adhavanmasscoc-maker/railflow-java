/**
 * RailFlow API Routes — Central Router
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Rate limiters
const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { type: 'about:blank', title: 'Too Many Requests', status: 429, detail: 'Rate limit exceeded. Try again in 1 minute.' }
});

const pnrLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { type: 'about:blank', title: 'Too Many Requests', status: 429, detail: 'PNR query rate limit exceeded. Max 20 per minute.' }
});

// Apply general rate limiter to all API routes
router.use(generalLimiter);

// ─── HEALTH ─────────────────────────────────────────────────────────────
router.get('/health', require('./health'));

// ─── STATIONS ───────────────────────────────────────────────────────────
router.get('/stations', require('./stations').list);
router.get('/stations/search', require('./stations').search);
router.get('/stations/zones', require('./stations').zones);
router.get('/stations/states', require('./stations').states);
router.get('/stations/:code', require('./stations').getByCode);
router.get('/stations/:code/trains', require('./stations').getTrains);

// ─── TRAINS ─────────────────────────────────────────────────────────────
router.get('/trains', require('./trains').list);
router.get('/trains/search', require('./trains').search);
router.get('/trains/types', require('./trains').types);
router.get('/trains/:number', require('./trains').getByNumber);
router.get('/trains/:number/route', require('./trains').getRoute);

// ─── ROUTES ─────────────────────────────────────────────────────────────
router.get('/routes/search', require('./routes').search);

// ─── ANALYTICS ──────────────────────────────────────────────────────────
router.get('/analytics/historical', require('./analytics').historical);
router.get('/analytics/summary', require('./analytics').summary);
router.get('/analytics/years', require('./analytics').years);
router.get('/analytics/gauges', require('./analytics').gauges);
router.get('/analytics/categories', require('./analytics').categories);
router.get('/analytics/timeseries', require('./analytics').timeseries);

// ─── PLATFORMS ──────────────────────────────────────────────────────────
router.get('/platforms', require('./platforms').list);
router.get('/platforms/summary', require('./platforms').summary);
router.get('/platforms/:stationCode', require('./platforms').getByStation);
router.post('/platforms/:stationCode/:platformNumber/crowd', require('./platforms').updateCrowd);

// ─── PNR ────────────────────────────────────────────────────────────────
router.post('/pnr/check', pnrLimiter, require('./pnr').check);

// ─── FEEDBACK (Structured, No Typing) ──────────────────────────────────
router.post('/feedback', require('./feedback').create);
router.get('/feedback', require('./feedback').list);
router.get('/feedback/stats', require('./feedback').stats);

// ─── DATABASE INSPECTOR (Real Database on the site) ────────────────────
router.get('/database/overview', require('./database').overview);
router.get('/database/tables/:table', require('./database').tableRecords);

module.exports = router;
