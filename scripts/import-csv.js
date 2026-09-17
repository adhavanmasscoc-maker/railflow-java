/**
 * RailFlow CSV Ingestion Pipeline
 * Parses ALL_RAILWAY_DATA.csv (22.1 MB, 13,849 rows) into SQLite
 * 
 * Usage: node scripts/import-csv.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Resolve paths ──────────────────────────────────────────────────────────
const DB_MODULE = path.join(__dirname, '..', 'backend', 'database', 'db');
const { getDatabase, initializeSchema } = require(DB_MODULE);

// Search for CSV file in multiple locations
const CSV_SEARCH_PATHS = [
    path.join(__dirname, '..', 'ALL_RAILWAY_DATA.csv'),
    path.join(__dirname, '..', '..', 'ALL_RAILWAY_DATA.csv'),
    path.join(__dirname, '..', 'data', 'raw', 'ALL_RAILWAY_DATA.csv'),
    path.join(__dirname, '..', 'DATA', 'ALL_RAILWAY_DATA.csv'),
];

function findCsvFile() {
    for (const p of CSV_SEARCH_PATHS) {
        if (fs.existsSync(p)) {
            console.log(`[CSV] Found: ${p}`);
            return p;
        }
    }
    return null;
}

// ─── Indian Railways Station & Train Data ───────────────────────────────────
// Comprehensive seed data extracted from official Indian Railways sources

const MAJOR_STATIONS = [
    { code: 'NDLS', name: 'New Delhi', zone: 'NR', state: 'Delhi', platforms: 16 },
    { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', zone: 'CR', state: 'Maharashtra', platforms: 18 },
    { code: 'HWH', name: 'Howrah Junction', zone: 'ER', state: 'West Bengal', platforms: 23 },
    { code: 'MAS', name: 'Chennai Central', zone: 'SR', state: 'Tamil Nadu', platforms: 17 },
    { code: 'SBC', name: 'Krantivira Sangolli Rayanna (Bengaluru)', zone: 'SWR', state: 'Karnataka', platforms: 10 },
    { code: 'SC', name: 'Secunderabad Junction', zone: 'SCR', state: 'Telangana', platforms: 10 },
    { code: 'LKO', name: 'Lucknow Charbagh', zone: 'NR', state: 'Uttar Pradesh', platforms: 9 },
    { code: 'JP', name: 'Jaipur Junction', zone: 'NWR', state: 'Rajasthan', platforms: 6 },
    { code: 'ADI', name: 'Ahmedabad Junction', zone: 'WR', state: 'Gujarat', platforms: 12 },
    { code: 'PUNE', name: 'Pune Junction', zone: 'CR', state: 'Maharashtra', platforms: 6 },
    { code: 'BPL', name: 'Bhopal Junction', zone: 'WCR', state: 'Madhya Pradesh', platforms: 6 },
    { code: 'GKP', name: 'Gorakhpur Junction', zone: 'NER', state: 'Uttar Pradesh', platforms: 10 },
    { code: 'PNBE', name: 'Patna Junction', zone: 'ECR', state: 'Bihar', platforms: 10 },
    { code: 'CNB', name: 'Kanpur Central', zone: 'NCR', state: 'Uttar Pradesh', platforms: 10 },
    { code: 'AGC', name: 'Agra Cantt', zone: 'NCR', state: 'Uttar Pradesh', platforms: 7 },
    { code: 'ALD', name: 'Prayagraj Junction', zone: 'NCR', state: 'Uttar Pradesh', platforms: 10 },
    { code: 'BSB', name: 'Varanasi Junction', zone: 'NER', state: 'Uttar Pradesh', platforms: 9 },
    { code: 'MMCT', name: 'Mumbai Central', zone: 'WR', state: 'Maharashtra', platforms: 5 },
    { code: 'BCT', name: 'Mumbai Bandra Terminus', zone: 'WR', state: 'Maharashtra', platforms: 10 },
    { code: 'LTT', name: 'Lokmanya Tilak Terminus', zone: 'CR', state: 'Maharashtra', platforms: 9 },
    { code: 'SDAH', name: 'Sealdah', zone: 'ER', state: 'West Bengal', platforms: 20 },
    { code: 'GHY', name: 'Guwahati', zone: 'NFR', state: 'Assam', platforms: 6 },
    { code: 'TVC', name: 'Thiruvananthapuram Central', zone: 'SR', state: 'Kerala', platforms: 5 },
    { code: 'ERS', name: 'Ernakulam Junction', zone: 'SR', state: 'Kerala', platforms: 6 },
    { code: 'CDG', name: 'Chandigarh Junction', zone: 'NR', state: 'Chandigarh', platforms: 5 },
    { code: 'JU', name: 'Jodhpur Junction', zone: 'NWR', state: 'Rajasthan', platforms: 6 },
    { code: 'UDZ', name: 'Udaipur City', zone: 'NWR', state: 'Rajasthan', platforms: 4 },
    { code: 'KOTA', name: 'Kota Junction', zone: 'WCR', state: 'Rajasthan', platforms: 5 },
    { code: 'NGP', name: 'Nagpur Junction', zone: 'CR', state: 'Maharashtra', platforms: 8 },
    { code: 'RJT', name: 'Rajkot Junction', zone: 'WR', state: 'Gujarat', platforms: 5 },
    { code: 'DDN', name: 'Dehradun', zone: 'NR', state: 'Uttarakhand', platforms: 4 },
    { code: 'JAT', name: 'Jammu Tawi', zone: 'NR', state: 'Jammu & Kashmir', platforms: 3 },
    { code: 'DBG', name: 'Darbhanga Junction', zone: 'ECR', state: 'Bihar', platforms: 5 },
    { code: 'RNC', name: 'Ranchi', zone: 'SER', state: 'Jharkhand', platforms: 5 },
    { code: 'TATA', name: 'Tatanagar Junction', zone: 'SER', state: 'Jharkhand', platforms: 5 },
    { code: 'BBS', name: 'Bhubaneswar', zone: 'ECoR', state: 'Odisha', platforms: 6 },
    { code: 'VSKP', name: 'Visakhapatnam Junction', zone: 'ECoR', state: 'Andhra Pradesh', platforms: 8 },
    { code: 'BZA', name: 'Vijayawada Junction', zone: 'SCR', state: 'Andhra Pradesh', platforms: 10 },
    { code: 'GNT', name: 'Guntur Junction', zone: 'SCR', state: 'Andhra Pradesh', platforms: 6 },
    { code: 'MDU', name: 'Madurai Junction', zone: 'SR', state: 'Tamil Nadu', platforms: 6 },
    { code: 'CBE', name: 'Coimbatore Junction', zone: 'SR', state: 'Tamil Nadu', platforms: 6 },
    { code: 'MYS', name: 'Mysuru Junction', zone: 'SWR', state: 'Karnataka', platforms: 6 },
    { code: 'UBL', name: 'Hubli Junction', zone: 'SWR', state: 'Karnataka', platforms: 5 },
    { code: 'RMM', name: 'Rameswaram', zone: 'SR', state: 'Tamil Nadu', platforms: 3 },
    { code: 'DLI', name: 'Delhi Junction (Old Delhi)', zone: 'NR', state: 'Delhi', platforms: 16 },
    { code: 'NZM', name: 'Hazrat Nizamuddin', zone: 'NR', state: 'Delhi', platforms: 7 },
    { code: 'ANVT', name: 'Anand Vihar Terminal', zone: 'NR', state: 'Delhi', platforms: 7 },
    { code: 'KGP', name: 'Kharagpur Junction', zone: 'SER', state: 'West Bengal', platforms: 12 },
    { code: 'DHN', name: 'Dhanbad Junction', zone: 'ECR', state: 'Jharkhand', platforms: 6 },
    { code: 'MGS', name: 'Mughal Sarai Junction', zone: 'ECR', state: 'Uttar Pradesh', platforms: 10 },
];

const MAJOR_TRAINS = [
    { number: '12301', name: 'Howrah Rajdhani Express', type: 'Rajdhani', source: 'NDLS', dest: 'HWH', dist: 1447, classes: '1A,2A,3A' },
    { number: '12302', name: 'New Delhi Rajdhani Express', type: 'Rajdhani', source: 'HWH', dest: 'NDLS', dist: 1447, classes: '1A,2A,3A' },
    { number: '12951', name: 'Mumbai Rajdhani Express', type: 'Rajdhani', source: 'MMCT', dest: 'NDLS', dist: 1384, classes: '1A,2A,3A' },
    { number: '12952', name: 'New Delhi Rajdhani Express', type: 'Rajdhani', source: 'NDLS', dest: 'MMCT', dist: 1384, classes: '1A,2A,3A' },
    { number: '12953', name: 'August Kranti Rajdhani Express', type: 'Rajdhani', source: 'MMCT', dest: 'NZM', dist: 1384, classes: '1A,2A,3A' },
    { number: '12309', name: 'Patna Rajdhani Express', type: 'Rajdhani', source: 'NDLS', dest: 'PNBE', dist: 1001, classes: '1A,2A,3A' },
    { number: '12431', name: 'Thiruvananthapuram Rajdhani', type: 'Rajdhani', source: 'NZM', dest: 'TVC', dist: 2804, classes: '1A,2A,3A' },
    { number: '12001', name: 'Bhopal Shatabdi Express', type: 'Shatabdi', source: 'NDLS', dest: 'BPL', dist: 707, classes: 'EC,CC' },
    { number: '12002', name: 'Bhopal Shatabdi Express', type: 'Shatabdi', source: 'BPL', dest: 'NDLS', dist: 707, classes: 'EC,CC' },
    { number: '12003', name: 'Lucknow Swarna Shatabdi', type: 'Shatabdi', source: 'NDLS', dest: 'LKO', dist: 512, classes: 'EC,CC' },
    { number: '12005', name: 'Kalka Shatabdi Express', type: 'Shatabdi', source: 'NDLS', dest: 'CDG', dist: 262, classes: 'EC,CC' },
    { number: '12627', name: 'Karnataka Express', type: 'Superfast', source: 'NDLS', dest: 'SBC', dist: 2444, classes: '1A,2A,3A,SL,2S' },
    { number: '12621', name: 'Tamil Nadu Express', type: 'Superfast', source: 'NDLS', dest: 'MAS', dist: 2182, classes: '1A,2A,3A,SL,2S' },
    { number: '12723', name: 'Telangana Express', type: 'Superfast', source: 'NDLS', dest: 'SC', dist: 1700, classes: '1A,2A,3A,SL,2S' },
    { number: '12259', name: 'Sealdah Duronto Express', type: 'Duronto', source: 'NDLS', dest: 'SDAH', dist: 1453, classes: '1A,2A,3A,SL' },
    { number: '12213', name: 'Yesvantpur Duronto Express', type: 'Duronto', source: 'NDLS', dest: 'SBC', dist: 2444, classes: '1A,2A,3A,SL' },
    { number: '12123', name: 'Deccan Queen Express', type: 'Superfast', source: 'CSMT', dest: 'PUNE', dist: 192, classes: 'CC,2S' },
    { number: '12049', name: 'Gatiman Express', type: 'Superfast', source: 'NZM', dest: 'AGC', dist: 188, classes: 'EC,CC' },
    { number: '12553', name: 'Vaishali Superfast Express', type: 'Superfast', source: 'NDLS', dest: 'BSB', dist: 764, classes: '2A,3A,SL,2S' },
    { number: '12273', name: 'Howrah Duronto Express', type: 'Duronto', source: 'NDLS', dest: 'HWH', dist: 1447, classes: '1A,2A,3A' },
    { number: '22691', name: 'Bengaluru Rajdhani Express', type: 'Rajdhani', source: 'NZM', dest: 'SBC', dist: 2444, classes: '1A,2A,3A' },
    { number: '12423', name: 'Dibrugarh Rajdhani Express', type: 'Rajdhani', source: 'NDLS', dest: 'GHY', dist: 1900, classes: '1A,2A,3A' },
    { number: '12245', name: 'Howrah Duronto Express', type: 'Duronto', source: 'HWH', dest: 'NDLS', dist: 1447, classes: '1A,2A,3A,SL' },
    { number: '12925', name: 'Paschim Superfast Express', type: 'Superfast', source: 'BCT', dest: 'NDLS', dist: 1544, classes: '1A,2A,3A,SL,2S' },
    { number: '12313', name: 'Sealdah Rajdhani Express', type: 'Rajdhani', source: 'NDLS', dest: 'SDAH', dist: 1453, classes: '1A,2A,3A' },
    { number: '12561', name: 'Swatantrata Senani Superfast', type: 'Superfast', source: 'NDLS', dest: 'PNBE', dist: 1001, classes: '2A,3A,SL' },
    { number: '12381', name: 'Poorva Express', type: 'Superfast', source: 'NDLS', dest: 'HWH', dist: 1447, classes: '1A,2A,3A,SL,2S' },
    { number: '12039', name: 'Kathgodam Shatabdi', type: 'Shatabdi', source: 'NDLS', dest: 'KGM', dist: 282, classes: 'EC,CC' },
    { number: '22109', name: 'Mumbai LTT AC SF Express', type: 'Superfast', source: 'NZM', dest: 'LTT', dist: 1384, classes: '1A,2A,3A' },
    { number: '12155', name: 'Bhopal Express', type: 'Superfast', source: 'NZM', dest: 'BPL', dist: 707, classes: '2A,3A,SL,2S' },
];

// ─── CSV Parsing Logic ──────────────────────────────────────────────────────

/**
 * Parse the complex multi-table CSV format of ALL_RAILWAY_DATA.csv
 * This CSV contains OCR-extracted statistical tables with doubled letters,
 * multiple embedded tables per row, and non-standard formatting.
 */
function parseHistoricalData(csvPath) {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n');
    const records = [];

    console.log(`[CSV] Total lines in file: ${lines.length}`);

    // Category definitions based on table structure
    const CATEGORIES = {
        'Route': ['Total Route Kms', 'Route Kilometres'],
        'Double/Multiple Route': ['Double', 'Multiple Route Length'],
        'Running Track': ['Running Track Kilometres'],
        'Total Track': ['Total Track Kilometres'],
        'Electrified Route': ['Electrified Route Kilometres'],
        'Stations': ['Number of Stations'],
        'Locomotives': ['Number of Locomotives', 'Locomotive'],
        'Coaching Vehicles': ['Coaching Vehicles', 'coaching vehicle'],
        'Wagons': ['Number of wagons', 'wagons in service'],
        'Earnings': ['Details of Earnings', 'Earnings'],
        'Financial Results': ['Financial Results'],
        'Passenger Traffic': ['Passenger Traffic', 'passengers originating'],
        'Suburban Traffic': ['Suburban Passenger', 'Monthly Season'],
        'Freight Traffic': ['FREIGHT', 'Tonnes Originating', 'Tonne Kilom'],
        'Working Expenses': ['Working Expenses', 'Ordinary Working'],
    };

    // Extract year-value pairs from the messy CSV content
    const yearPattern = /(\d{4}-\d{2})\s+([\d,.]+)/g;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];
        if (!line || line.trim().length < 10) continue;

        // Determine category from surrounding context
        let category = 'General';
        for (const [cat, keywords] of Object.entries(CATEGORIES)) {
            if (keywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()))) {
                category = cat;
                break;
            }
        }

        // Extract gauge info
        let gauge = 'Total';
        if (/\bBG\b|Broad\s*Gauge/i.test(line)) gauge = 'BG';
        else if (/\bMG\b|Metre\s*Gauge/i.test(line)) gauge = 'MG';
        else if (/\bNG\b|Narrow\s*Gauge/i.test(line)) gauge = 'NG';

        // Extract year-value pairs
        let match;
        const yearRegex = /(\d{4}-\d{2,4})\s+([\d,.]+)/g;
        while ((match = yearRegex.exec(line)) !== null) {
            const year = match[1];
            const rawVal = match[2].replace(/,/g, '');
            const value = parseFloat(rawVal);

            if (!isNaN(value) && year.match(/^(19|20)\d{2}-/)) {
                // Determine metric name from column position and context
                let metricName = category;

                // Try to extract more specific metric names from headers
                const headerMatch = line.match(/-(\d+)-?\s*(.+?)(?:Year|$)/);
                if (headerMatch) {
                    metricName = headerMatch[2].replace(/[^a-zA-Z\s]/g, '').trim().substring(0, 100) || category;
                }

                records.push({
                    year,
                    category,
                    gauge,
                    metric_name: metricName,
                    metric_value: value,
                    unit: detectUnit(line, value),
                    source_page: extractSourcePage(line),
                    source_table: extractSourceTable(line),
                    source_reference: `ALL_RAILWAY_DATA.csv:${lineIdx + 1}`
                });
            }
        }
    }

    return records;
}

function detectUnit(line, value) {
    if (/crores?/i.test(line)) return 'Rs. Crores';
    if (/lakhs?/i.test(line)) return 'Rs. Lakhs';
    if (/paise/i.test(line)) return 'Paise';
    if (/million/i.test(line)) return 'Millions';
    if (/thousand/i.test(line)) return 'Thousands';
    if (/kilo?m/i.test(line)) return 'Kilometres';
    if (/tonn/i.test(line)) return 'Tonnes';
    if (/4-wheeler/i.test(line)) return '4-wheelers';
    if (/unit/i.test(line)) return 'Units';
    return 'Number';
}

function extractSourcePage(line) {
    const match = line.match(/PAGE\s*(?:No\.?)?\s*(\d+)/i);
    return match ? match[1] : null;
}

function extractSourceTable(line) {
    const match = line.match(/source_table[,\s]+(.*?)(?:,|$)/);
    return match ? match[1].trim().substring(0, 200) : null;
}

// ─── Main Import Pipeline ───────────────────────────────────────────────────

async function main() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  🚉 RailFlow CSV Ingestion Pipeline v2.0                 ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');

    const startTime = Date.now();
    const db = getDatabase();

    // Ensure schema exists
    initializeSchema();

    // ─── 1. Import Stations ────────────────────────────────────────────
    console.log('[STAGE 1] Importing station registry...');
    const insertStation = db.prepare(`
        INSERT OR IGNORE INTO stations (code, name, zone, state, platforms_count)
        VALUES (?, ?, ?, ?, ?)
    `);

    const stationTx = db.transaction((stations) => {
        let inserted = 0;
        for (const s of stations) {
            const result = insertStation.run(s.code, s.name, s.zone, s.state, s.platforms || 0);
            if (result.changes > 0) inserted++;
        }
        return inserted;
    });

    const stationsInserted = stationTx(MAJOR_STATIONS);
    console.log(`  ✓ ${stationsInserted} stations inserted (${MAJOR_STATIONS.length} attempted)`);

    // ─── 2. Import Trains ──────────────────────────────────────────────
    console.log('[STAGE 2] Importing train registry...');
    const insertTrain = db.prepare(`
        INSERT OR IGNORE INTO trains (number, name, type, source_code, dest_code, source_name, dest_name, total_distance, classes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const trainTx = db.transaction((trains) => {
        let inserted = 0;
        for (const t of trains) {
            const srcStation = MAJOR_STATIONS.find(s => s.code === t.source);
            const dstStation = MAJOR_STATIONS.find(s => s.code === t.dest);
            const result = insertTrain.run(
                t.number, t.name, t.type, t.source, t.dest,
                srcStation?.name || t.source, dstStation?.name || t.dest,
                t.dist || 0, t.classes || ''
            );
            if (result.changes > 0) inserted++;
        }
        return inserted;
    });

    const trainsInserted = trainTx(MAJOR_TRAINS);
    console.log(`  ✓ ${trainsInserted} trains inserted (${MAJOR_TRAINS.length} attempted)`);

    // ─── 3. Seed Platforms ─────────────────────────────────────────────
    console.log('[STAGE 3] Seeding platform data...');
    const insertPlatform = db.prepare(`
        INSERT OR IGNORE INTO platforms (station_code, platform_number, capacity, current_passengers, status)
        VALUES (?, ?, ?, ?, ?)
    `);

    const platformTx = db.transaction(() => {
        let count = 0;
        for (const s of MAJOR_STATIONS) {
            const numPlatforms = s.platforms || 4;
            for (let p = 1; p <= numPlatforms; p++) {
                const capacity = 300 + Math.floor(Math.random() * 400);
                const passengers = Math.floor(Math.random() * capacity * 0.8);
                const ratio = passengers / capacity;
                let status = 'normal';
                if (ratio > 0.9) status = 'critical';
                else if (ratio > 0.7) status = 'crowded';

                const result = insertPlatform.run(s.code, p, capacity, passengers, status);
                if (result.changes > 0) count++;
            }
        }
        return count;
    });

    const platformsInserted = platformTx();
    console.log(`  ✓ ${platformsInserted} platforms created`);

    // ─── 4. Import Historical CSV Data ─────────────────────────────────
    const csvPath = findCsvFile();
    let csvRecords = 0;

    if (csvPath) {
        console.log(`[STAGE 4] Parsing historical CSV data from: ${path.basename(csvPath)}`);
        const fileSizeMB = (fs.statSync(csvPath).size / (1024 * 1024)).toFixed(1);
        console.log(`  File size: ${fileSizeMB} MB`);

        const records = parseHistoricalData(csvPath);
        console.log(`  Parsed ${records.length} metric records from CSV`);

        // Batch insert in 1000-row transactions
        const insertHistorical = db.prepare(`
            INSERT INTO historical_railway_data
            (year, category, gauge, metric_name, metric_value, unit, source_page, source_table, source_reference)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const BATCH_SIZE = 1000;
        const batchTx = db.transaction((batch) => {
            let count = 0;
            for (const r of batch) {
                try {
                    insertHistorical.run(
                        r.year, r.category, r.gauge, r.metric_name,
                        r.metric_value, r.unit, r.source_page, r.source_table, r.source_reference
                    );
                    count++;
                } catch (err) {
                    // Skip duplicate/malformed records silently
                }
            }
            return count;
        });

        for (let i = 0; i < records.length; i += BATCH_SIZE) {
            const batch = records.slice(i, i + BATCH_SIZE);
            const inserted = batchTx(batch);
            csvRecords += inserted;
            const pct = Math.round((Math.min(i + BATCH_SIZE, records.length) / records.length) * 100);
            process.stdout.write(`\r  Importing: ${pct}% (${csvRecords} records)`);
        }
        console.log(`\n  ✓ ${csvRecords} historical records imported`);
    } else {
        console.log('[STAGE 4] ⚠ ALL_RAILWAY_DATA.csv not found, skipping historical data import');
        console.log('  Searched paths:');
        CSV_SEARCH_PATHS.forEach(p => console.log(`    - ${p}`));
    }

    // ─── Summary ───────────────────────────────────────────────────────
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  📊 Import Summary                                       ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║  Stations:    ${String(stationsInserted).padEnd(42)}║`);
    console.log(`║  Trains:      ${String(trainsInserted).padEnd(42)}║`);
    console.log(`║  Platforms:   ${String(platformsInserted).padEnd(42)}║`);
    console.log(`║  Historical:  ${String(csvRecords).padEnd(42)}║`);
    console.log(`║  Duration:    ${(elapsed + 's').padEnd(42)}║`);
    console.log('╚═══════════════════════════════════════════════════════════╝');

    // Record import stats
    try {
        const insertMetric = db.prepare('INSERT INTO system_analytics (metric_key, metric_val) VALUES (?, ?)');
        insertMetric.run('last_import_date', new Date().toISOString());
        insertMetric.run('stations_count', String(stationsInserted));
        insertMetric.run('trains_count', String(trainsInserted));
        insertMetric.run('platforms_count', String(platformsInserted));
        insertMetric.run('historical_records', String(csvRecords));
        insertMetric.run('import_duration_seconds', elapsed);
    } catch {}
}

main().catch(err => {
    console.error('[FATAL]', err);
    process.exit(1);
});
