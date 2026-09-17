const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simulated Data Bank
const mockDataBank = {
    stations: [
        { id: crypto.randomUUID(), code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi' },
        { id: crypto.randomUUID(), code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' }
    ],
    trains: [] // Generated below
};

// Generate Mock Trains and Routes
const trainId = crypto.randomUUID();
mockDataBank.trains.push({
    id: trainId, train_number: '12952', name: 'Mumbai Rajdhani',
    type: 'Rajdhani', source: mockDataBank.stations[0].id, dest: mockDataBank.stations[1].id, days: 'Daily'
});

const mockRoutes = [
    { id: crypto.randomUUID(), train_id: trainId, station_id: mockDataBank.stations[0].id, seq: 1, arr: null, dep: '16:55' },
    { id: crypto.randomUUID(), train_id: trainId, station_id: mockDataBank.stations[1].id, seq: 2, arr: '08:35', dep: null }
];

const dbPath = path.resolve(__dirname, '../backend/database/railflow.db');
// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

console.log('[Extractor] Initializing database & PRAGMAs...');
db.exec(fs.readFileSync(path.resolve(__dirname, '../backend/database/schema.sql'), 'utf8'));

// Prepare statements
const insertStation = db.prepare('INSERT OR IGNORE INTO stations (id, code, name, city, state) VALUES (?, ?, ?, ?, ?)');
const insertTrain = db.prepare('INSERT OR IGNORE INTO trains (id, train_number, name, type, source_station_id, dest_station_id, running_days) VALUES (?, ?, ?, ?, ?, ?, ?)');
const insertRoute = db.prepare('INSERT OR IGNORE INTO routes (id, train_id, station_id, stop_sequence, arrival_time, departure_time) VALUES (?, ?, ?, ?, ?, ?)');

console.log('[Extractor] Beginning Transactional Ingestion...');
const ingestData = db.transaction((data) => {
    // 1. Ingest Stations
    for (const st of data.stations) {
        insertStation.run(st.id, st.code, st.name, st.city, st.state);
    }
    // 2. Ingest Trains
    for (const tr of data.trains) {
        insertTrain.run(tr.id, tr.train_number, tr.name, tr.type, tr.source, tr.dest, tr.days);
    }
    // 3. Ingest Routes
    for (const rt of mockRoutes) {
        insertRoute.run(rt.id, rt.train_id, rt.station_id, rt.seq, rt.arr, rt.dep);
    }
});

const start = performance.now();
ingestData(mockDataBank);
const end = performance.now();

console.log(`[Extractor] Successfully ingested Data Bank in ${(end - start).toFixed(2)}ms.`);
