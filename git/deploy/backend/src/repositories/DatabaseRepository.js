/**
 * DatabaseRepository — Schema and Query Inspector for SQLite
 * Provides real database structure, statistics, and record browsing
 */
const { getDatabase, getStats, DB_PATH } = require('../../database/db');
const fs = require('fs');

class DatabaseRepository {
    constructor() {
        this._db = null;
    }

    get db() {
        if (!this._db) this._db = getDatabase();
        return this._db;
    }

    /**
     * List all database tables with column counts, record counts, and schema definitions
     */
    getTablesOverview() {
        const tableNames = this.db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name ASC
        `).all().map(t => t.name);

        const overview = [];

        for (const name of tableNames) {
            let rowCount = 0;
            try {
                rowCount = this.db.prepare(`SELECT COUNT(*) as count FROM "${name}"`).get().count;
            } catch (err) {
                rowCount = 0;
            }

            const columns = this.db.prepare(`PRAGMA table_info("${name}")`).all();
            const indexes = this.db.prepare(`PRAGMA index_list("${name}")`).all();

            overview.push({
                table_name: name,
                row_count: rowCount,
                column_count: columns.length,
                columns: columns.map(c => ({
                    cid: c.cid,
                    name: c.name,
                    type: c.type,
                    notnull: c.notnull === 1,
                    dflt_value: c.dflt_value,
                    pk: c.pk === 1
                })),
                indexes: indexes.map(i => ({
                    name: i.name,
                    unique: i.unique === 1
                }))
            });
        }

        return {
            database_file: 'railway.db',
            storage_engine: 'SQLite 3 (WAL mode)',
            table_count: overview.length,
            total_rows: overview.reduce((acc, t) => acc + t.row_count, 0),
            stats: getStats(),
            tables: overview
        };
    }

    /**
     * Browse real records from any table safely with pagination
     */
    getTableRecords(tableName, { limit = 25, offset = 0, orderBy = null, orderDir = 'ASC' } = {}) {
        // Validate table name against sqlite_master
        const validTable = this.db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name = ?
        `).get(tableName);

        if (!validTable) {
            throw new Error(`Table "${tableName}" does not exist in railway.db`);
        }

        const total = this.db.prepare(`SELECT COUNT(*) as cnt FROM "${tableName}"`).get().cnt;
        const columns = this.db.prepare(`PRAGMA table_info("${tableName}")`).all();

        let query = `SELECT * FROM "${tableName}"`;
        if (orderBy && columns.some(c => c.name === orderBy)) {
            const dir = orderDir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            query += ` ORDER BY "${orderBy}" ${dir}`;
        } else {
            // Default sort by first primary key or rowid
            const pk = columns.find(c => c.pk === 1);
            if (pk) query += ` ORDER BY "${pk.name}" ASC`;
        }

        query += ' LIMIT ? OFFSET ?';
        const rows = this.db.prepare(query).all(limit, offset);

        return {
            table_name: tableName,
            columns: columns.map(c => ({ name: c.name, type: c.type, pk: c.pk === 1 })),
            total_records: total,
            limit,
            offset,
            rows
        };
    }
}

module.exports = new DatabaseRepository();
