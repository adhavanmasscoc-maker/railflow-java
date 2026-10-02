/**
 * RailFlow — Express Server Entry Point
 * Production-grade Node.js REST API for Railway Intelligence
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { getDatabase, getStats } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─── SECURITY MIDDLEWARE ──────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:*"],
        }
    },
    crossOriginEmbedderPolicy: false
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: NODE_ENV === 'production'
        ? [process.env.ALLOWED_ORIGIN || 'https://railflow.vercel.app']
        : ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
}));

// ─── BODY PARSING & COMPRESSION ───────────────────────────────────────────────
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(compression());

// ─── REQUEST LOGGING (Development) ────────────────────────────────────────────
if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
        });
        next();
    });
}

// ─── STATIC FILES (Frontend) ─────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'frontend'), {
    maxAge: NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

// ─── API ROUTES ───────────────────────────────────────────────────────────────
const apiRouter = require('./src/routes');
app.use('/api', apiRouter);

// ─── SPA FALLBACK ─────────────────────────────────────────────────────────────
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        type: 'about:blank',
        title: err.title || 'Internal Server Error',
        status,
        detail: NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
        instance: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

// ─── DATABASE INITIALIZATION ──────────────────────────────────────────────────
try {
    getDatabase();
    const stats = getStats();
    console.log(`[DB] Railway database ready — ${stats.stations} stations, ${stats.trains} trains, ${stats.historical_railway_data} historical records (${stats.db_size_mb} MB)`);
} catch (err) {
    console.error('[DB] Failed to initialize database:', err.message);
}

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🚉 RailFlow API Server v2.0.0                              ║
║  Environment: ${NODE_ENV.padEnd(45)}║
║  Port: ${String(PORT).padEnd(53)}║
║  Frontend: http://localhost:${PORT}/                       ${PORT === 3000 ? '  ' : ' '}║
║  API: http://localhost:${PORT}/api/health                  ${PORT === 3000 ? '  ' : ' '}║
╚══════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
