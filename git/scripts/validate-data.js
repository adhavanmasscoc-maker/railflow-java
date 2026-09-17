/**
 * RailFlow Data Validation Script
 * Validates database integrity after CSV import
 *
 * Usage: node scripts/validate-data.js
 */

const path = require('path');
const { getDatabase, getStats } = require(path.join(__dirname, '..', 'backend', 'database', 'db'));

function main() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  🔍 RailFlow Data Validation Suite v2.0                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');

    const db = getDatabase();
    const stats = getStats();
    let passed = 0;
    let failed = 0;
    let warnings = 0;

    function check(name, condition, detail = '') {
        if (condition) {
            console.log(`  ✅ PASS: ${name} ${detail}`);
            passed++;
        } else {
            console.log(`  ❌ FAIL: ${name} ${detail}`);
            failed++;
        }
    }

    function warn(name, detail = '') {
        console.log(`  ⚠️  WARN: ${name} ${detail}`);
        warnings++;
    }

    // ─── Table Existence ─────────────────────────────────────────────
    console.log('[1] Checking table existence...');
    const expectedTables = ['stations', 'trains', 'train_stations', 'routes',
                            'historical_railway_data', 'platforms', 'pnr_queries', 'system_analytics'];
    for (const table of expectedTables) {
        const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
        check(`Table "${table}" exists`, !!exists);
    }

    // ─── Row Counts ──────────────────────────────────────────────────
    console.log('\n[2] Checking row counts...');
    check('Stations count > 0', stats.stations > 0, `(${stats.stations} rows)`);
    check('Trains count > 0', stats.trains > 0, `(${stats.trains} rows)`);
    check('Platforms count > 0', stats.platforms > 0, `(${stats.platforms} rows)`);

    if (stats.historical_railway_data > 0) {
        check('Historical data imported', true, `(${stats.historical_railway_data} records)`);
    } else {
        warn('Historical data is empty — run "node scripts/import-csv.js" to import');
    }

    // ─── Data Integrity ──────────────────────────────────────────────
    console.log('\n[3] Checking data integrity...');

    // Unique station codes
    const dupStations = db.prepare('SELECT code, COUNT(*) as cnt FROM stations GROUP BY code HAVING cnt > 1').all();
    check('No duplicate station codes', dupStations.length === 0, dupStations.length > 0 ? `(${dupStations.length} duplicates)` : '');

    // Unique train numbers
    const dupTrains = db.prepare('SELECT number, COUNT(*) as cnt FROM trains GROUP BY number HAVING cnt > 1').all();
    check('No duplicate train numbers', dupTrains.length === 0, dupTrains.length > 0 ? `(${dupTrains.length} duplicates)` : '');

    // Station codes are non-empty
    const emptyStationCodes = db.prepare("SELECT COUNT(*) as cnt FROM stations WHERE code IS NULL OR code = ''").get();
    check('No empty station codes', emptyStationCodes.cnt === 0);

    // Train numbers are non-empty
    const emptyTrainNumbers = db.prepare("SELECT COUNT(*) as cnt FROM trains WHERE number IS NULL OR number = ''").get();
    check('No empty train numbers', emptyTrainNumbers.cnt === 0);

    // ─── Index Verification ──────────────────────────────────────────
    console.log('\n[4] Checking indexes...');
    const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'").all();
    check('Indexes exist', indexes.length > 0, `(${indexes.length} indexes found)`);

    const criticalIndexes = ['idx_stations_code', 'idx_trains_number', 'idx_historical_year_gauge'];
    for (const idx of criticalIndexes) {
        const exists = indexes.some(i => i.name === idx);
        check(`Index "${idx}" exists`, exists);
    }

    // ─── Referential Integrity ───────────────────────────────────────
    console.log('\n[5] Checking referential integrity...');

    if (stats.train_stations > 0) {
        const orphanStops = db.prepare(`
            SELECT COUNT(*) as cnt FROM train_stations ts
            WHERE NOT EXISTS (SELECT 1 FROM trains t WHERE t.number = ts.train_number)
        `).get();
        check('No orphan train_stations (train reference)', orphanStops.cnt === 0, `(${orphanStops.cnt} orphans)`);
    }

    // ─── Platform Data ───────────────────────────────────────────────
    console.log('\n[6] Checking platform data...');
    if (stats.platforms > 0) {
        const negativePassengers = db.prepare('SELECT COUNT(*) as cnt FROM platforms WHERE current_passengers < 0').get();
        check('No negative passenger counts', negativePassengers.cnt === 0);

        const validStatuses = db.prepare("SELECT COUNT(*) as cnt FROM platforms WHERE status NOT IN ('normal', 'crowded', 'critical', 'closed')").get();
        check('All platform statuses are valid', validStatuses.cnt === 0, validStatuses.cnt > 0 ? `(${validStatuses.cnt} invalid)` : '');
    }

    // ─── WAL Mode ────────────────────────────────────────────────────
    console.log('\n[7] Checking database configuration...');
    const journalMode = db.pragma('journal_mode', { simple: true });
    check('WAL mode enabled', journalMode === 'wal', `(current: ${journalMode})`);

    // ─── Summary ─────────────────────────────────────────────────────
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log(`║  📋 Validation Summary                                    ║`);
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║  Passed:   ${String(passed).padEnd(46)}║`);
    console.log(`║  Failed:   ${String(failed).padEnd(46)}║`);
    console.log(`║  Warnings: ${String(warnings).padEnd(46)}║`);
    console.log(`║  DB Size:  ${(stats.db_size_mb + ' MB').padEnd(46)}║`);
    console.log('╚═══════════════════════════════════════════════════════════╝');

    if (failed > 0) {
        console.log('\n⛔ VALIDATION FAILED — Fix errors above before deployment.');
        process.exit(1);
    } else {
        console.log('\n✅ ALL CHECKS PASSED');
        process.exit(0);
    }
}

main();
