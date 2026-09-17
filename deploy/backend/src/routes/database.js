/**
 * Database API Routes
 * Real-time SQLite Inspector: tables, schema, rows, and pragmas
 */
const DatabaseRepository = require('../repositories/DatabaseRepository');

/**
 * GET /api/database/overview
 * Overview of all SQLite tables, columns, indexes, and row counts
 */
exports.overview = (req, res, next) => {
    try {
        const overview = DatabaseRepository.getTablesOverview();
        res.json({ success: true, data: overview });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/database/tables/:table
 * Browse real rows from a specific SQLite table
 */
exports.tableRecords = (req, res, next) => {
    try {
        const tableName = req.params.table;
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
        const offset = Math.max(0, parseInt(req.query.offset) || 0);
        const { orderBy, orderDir } = req.query;

        const data = DatabaseRepository.getTableRecords(tableName, { limit, offset, orderBy, orderDir });
        res.json({ success: true, data });
    } catch (err) {
        if (err.message.includes('does not exist')) {
            return res.status(404).json({ error: err.message });
        }
        next(err);
    }
};
