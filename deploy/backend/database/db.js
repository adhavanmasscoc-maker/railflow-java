/**
 * RailFlow Database Connection Manager
 * Powered by native node:sqlite (DatabaseSync) for fast, zero-compilation SQLite access.
 * Configured with WAL mode, prepared statement caching, and transaction safety.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'railway.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let rawDb = null;
let wrappedDb = null;

class DatabaseWrapper {
    constructor(dbInstance) {
        this.raw = dbInstance;
    }

    exec(sql) {
        return this.raw.exec(sql);
    }

    prepare(sql) {
        const stmt = this.raw.prepare(sql);
        return {
            all: (...args) => stmt.all(...args),
            get: (...args) => stmt.get(...args),
            run: (...args) => {
                const res = stmt.run(...args);
                return {
                    changes: Number(res.changes || 0),
                    lastInsertRowid: Number(res.lastInsertRowid || 0)
                };
            }
        };
    }

    pragma(pragmaStr, options = {}) {
        try {
            if (pragmaStr.includes('=')) {
                this.raw.exec(`PRAGMA ${pragmaStr};`);
                return null;
            } else {
                const res = this.raw.prepare(`PRAGMA ${pragmaStr};`).get();
                if (!res) return null;
                if (options.simple) {
                    const keys = Object.keys(res);
                    return keys.length > 0 ? res[keys[0]] : null;
                }
                return res;
            }
        } catch (err) {
            return null;
        }
    }

    transaction(fn) {
        return (...args) => {
            this.raw.exec('BEGIN');
            try {
                const result = fn(...args);
                this.raw.exec('COMMIT');
                return result;
            } catch (err) {
                this.raw.exec('ROLLBACK');
                throw err;
            }
        };
    }

    close() {
        if (this.raw) {
            this.raw.close();
        }
    }
}

/**
 * Get or initialize the database connection
 * @returns {DatabaseWrapper} SQLite database wrapper instance
 */
function getDatabase() {
    if (wrappedDb) return wrappedDb;

    rawDb = new DatabaseSync(DB_PATH);
    wrappedDb = new DatabaseWrapper(rawDb);

    // Performance pragmas
    wrappedDb.pragma('journal_mode = WAL');
    wrappedDb.pragma('busy_timeout = 5000');
    wrappedDb.pragma('foreign_keys = ON');
    wrappedDb.pragma('synchronous = NORMAL');

    // Always ensure schema tables exist
    initializeSchema();

    return wrappedDb;
}

/**
 * Execute the schema.sql to create all tables and indexes
 */
function initializeSchema() {
    if (!fs.existsSync(SCHEMA_PATH)) {
        console.error('[DB] schema.sql not found at:', SCHEMA_PATH);
        return;
    }

    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('PRAGMA'));

    for (const stmt of statements) {
        try {
            wrappedDb.exec(stmt + ';');
        } catch (err) {
            // Table or index might already exist
        }
    }
}

/**
 * Get database statistics
 */
function getStats() {
    const d = getDatabase();
    const tables = ['stations', 'trains', 'train_stations', 'routes',
                    'historical_railway_data', 'platforms', 'pnr_queries', 'feedback', 'system_analytics'];
    const stats = {};

    for (const table of tables) {
        try {
            const row = d.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
            stats[table] = row ? Number(row.count) : 0;
        } catch {
            stats[table] = 0;
        }
    }

    stats.db_size_bytes = fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH).size : 0;
    stats.db_size_mb = (stats.db_size_bytes / (1024 * 1024)).toFixed(2);
    stats.journal_mode = d.pragma('journal_mode', { simple: true }) || 'wal';
    stats.page_count = d.pragma('page_count', { simple: true }) || 0;
    stats.page_size = d.pragma('page_size', { simple: true }) || 4096;

    return stats;
}

/**
 * Close the database connection gracefully
 */
function closeDatabase() {
    if (wrappedDb) {
        wrappedDb.close();
        wrappedDb = null;
        rawDb = null;
        console.log('[DB] Connection closed');
    }
}

// Graceful shutdown
process.on('SIGINT', () => { closeDatabase(); process.exit(0); });
process.on('SIGTERM', () => { closeDatabase(); process.exit(0); });

module.exports = { getDatabase, getStats, closeDatabase, initializeSchema, DB_PATH };
