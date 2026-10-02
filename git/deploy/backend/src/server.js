const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { statements } = require('./repositories/db');
const { getPnrStatus } = require('./services/pnrService');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});
app.use('/api/', apiLimiter);

// Endpoints
app.get('/api/trains', (req, res) => {
    try {
        const q = `%${req.query.q || ''}%`;
        res.json(statements.searchTrains.all(q, q));
    } catch (e) { res.status(500).json({ error: "Internal Server Error" }); }
});

app.get('/api/analytics', (req, res) => {
    try {
        res.json(statements.getPlatformAnalytics.all());
    } catch (e) { res.status(500).json({ error: "Internal Server Error" }); }
});

app.get('/api/pnr/:pnr', async (req, res) => {
    try {
        const data = await getPnrStatus(req.params.pnr);
        res.json(data);
    } catch (e) { res.status(500).json({ error: "Internal Server Error" }); }
});

// Anti-leak global error handler
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`); // Log internally
    res.status(500).json({ error: "An unexpected error occurred. Please contact support." }); // Mask from client
});

app.listen(3000, () => console.log('RailFlow Server running on port 3000'));
