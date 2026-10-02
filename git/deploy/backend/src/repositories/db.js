const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../../backend/database/railflow.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('mmap_size = 268435456'); // 256MB memory-mapped I/O
db.pragma('cache_size = -64000');   // 64MB cache
db.pragma('foreign_keys = ON');

// Initialize schema if not exists
const schemaPath = path.resolve(__dirname, '../../../backend/database/schema.sql');
if (fs.existsSync(schemaPath)) {
    db.exec(fs.readFileSync(schemaPath, 'utf8'));
}

// Cached Prepared Statements
const statements = {
    searchTrains: db.prepare(`SELECT * FROM trains WHERE name LIKE ? OR train_number LIKE ? LIMIT 20`),
    getPlatformAnalytics: db.prepare(`
        SELECT p.platform_number, a.crowd_density_percentage, a.timestamp 
        FROM analytics a
        JOIN platforms p ON a.platform_id = p.id
        ORDER BY a.timestamp DESC LIMIT 50
    `),
    getPnr: db.prepare(`SELECT * FROM pnr_status WHERE pnr_number = ?`)
};

module.exports = { db, statements };
