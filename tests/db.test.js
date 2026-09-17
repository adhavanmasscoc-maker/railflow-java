const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { getDatabase, getStats } = require('../backend/database/db');
const DatabaseRepository = require('../backend/src/repositories/DatabaseRepository');

describe('SQLite Database & Repository Tests', () => {
    const db = getDatabase();

    test('should initialize SQLite with WAL mode enabled', () => {
        const stats = getStats();
        assert.ok(stats.journal_mode === 'wal' || stats.journal_mode === 'WAL', 'WAL mode should be active');
        assert.ok(stats.db_size_bytes > 0, 'Database file should have non-zero size');
    });

    test('should query stations table with expected schema', () => {
        const stations = db.prepare('SELECT * FROM stations LIMIT 5').all();
        assert.ok(Array.isArray(stations), 'Stations should return an array');
        assert.ok(stations.length > 0, 'Stations should have seed rows');
        assert.ok(stations[0].code, 'Station row must have code');
        assert.ok(stations[0].name, 'Station row must have name');
    });

    test('should query historical_railway_data table', () => {
        const records = db.prepare('SELECT * FROM historical_railway_data LIMIT 10').all();
        assert.ok(Array.isArray(records), 'Historical data should return an array');
        assert.ok(records.length > 0, 'Historical data should have imported records');
    });

    test('DatabaseRepository.getTablesOverview() should return all tables and schema', () => {
        const overview = DatabaseRepository.getTablesOverview();
        assert.ok(overview.table_count >= 7, 'Overview should report at least 7 tables');
        assert.ok(overview.tables.some(t => t.table_name === 'stations'), 'stations table must exist');
        assert.ok(overview.tables.some(t => t.table_name === 'trains'), 'trains table must exist');
        assert.ok(overview.tables.some(t => t.table_name === 'historical_railway_data'), 'historical table must exist');
    });

    test('DatabaseRepository.getTableRecords() should paginate rows safely', () => {
        const result = DatabaseRepository.getTableRecords('stations', { limit: 5, offset: 0 });
        assert.equal(result.table_name, 'stations');
        assert.equal(result.rows.length, 5);
        assert.ok(result.total_records >= 50);
    });
});
