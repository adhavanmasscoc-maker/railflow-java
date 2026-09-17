const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const start = Date.now();
const trainroutesPath = path.join(ROOT_DIR, 'DATA', 'trainroutes.json');
const trnHeritagePath = path.join(ROOT_DIR, 'DATA', 'train_heritage.json');
const outDir = path.join(ROOT_DIR, 'DATA', 'trains');

if (!fs.existsSync(trainroutesPath)) {
    console.error('trainroutes.json not found');
    process.exit(1);
}

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const raw = JSON.parse(fs.readFileSync(trainroutesPath, 'utf8'));
const trnH = fs.existsSync(trnHeritagePath) ? JSON.parse(fs.readFileSync(trnHeritagePath, 'utf8')) : {};

let count = 0;
const catalog = [];

for (const t of raw) {
    const num = String(t.trainNumber).trim();
    const h = trnH[num] || {};
    const route = t.completeOrderedRoute || [];
    const stops = route.map((s, idx) => ({
        sequence: s.sequence || (idx + 1),
        stationCode: (s.stationCode || '').trim().toUpperCase(),
        stationName: (s.stationName || s.stationCode || '').trim(),
        arrivalTime: s.arrivalTime || (idx === 0 ? 'START' : 'Pass'),
        departureTime: s.departureTime || (idx === route.length - 1 ? 'ENDS' : 'Pass'),
        haltMinutes: 0,
        distanceKm: s.distance || 0,
        journeyDay: s.journeyDay || 1,
        platformNumber: ((parseInt(num, 10) + idx) % 6) + 1
    }));

    const trainObj = {
        trainNumber: num,
        trainName: (t.trainName || 'Express').trim(),
        type: (t.type || 'EXP').trim(),
        source: t.source ? t.source.code : (stops[0] ? stops[0].stationCode : ''),
        destination: t.destination ? t.destination.code : (stops[stops.length - 1] ? stops[stops.length - 1].stationCode : ''),
        overallDistanceKm: t.overallDistanceKm || 0,
        frequency: 'Daily',
        introducedYear: h.introducedYear || 1980,
        inauguratedDate: h.inauguratedDate || '1980-01-01',
        historicalDetails: h.historicalDetails || 'Indian Railways scheduled express service.',
        stops
    };

    fs.writeFileSync(path.join(outDir, `${num}.json`), JSON.stringify(trainObj));
    catalog.push({
        trainNumber: num,
        trainName: trainObj.trainName,
        type: trainObj.type,
        source: trainObj.source,
        destination: trainObj.destination,
        overallDistanceKm: trainObj.overallDistanceKm,
        frequency: trainObj.frequency,
        introducedYear: trainObj.introducedYear,
        inauguratedDate: trainObj.inauguratedDate,
        stopsCount: stops.length,
        platform: `PF ${((parseInt(num, 10) % 8) + 1)}`
    });
    count++;
}

// Write train catalog for fast search (only ~600KB)
fs.writeFileSync(path.join(ROOT_DIR, 'DATA', 'train_catalog.json'), JSON.stringify(catalog));

console.log(`Successfully exported ${count} train files and train_catalog.json in ${Date.now() - start} ms`);
