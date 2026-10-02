/**
 * Health Check Endpoint
 */
const { getStats } = require('../../database/db');
const os = require('os');

module.exports = (req, res) => {
    try {
        const stats = getStats();
        res.json({
            status: 'healthy',
            version: '2.0.0',
            uptime_seconds: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                size_mb: stats.db_size_mb,
                tables: stats
            },
            system: {
                node_version: process.version,
                platform: os.platform(),
                memory_mb: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024),
                cpus: os.cpus().length
            }
        });
    } catch (err) {
        res.status(503).json({
            status: 'unhealthy',
            detail: 'Database connection failed',
            timestamp: new Date().toISOString()
        });
    }
};
