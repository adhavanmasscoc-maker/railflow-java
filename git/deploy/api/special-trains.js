// Vercel Serverless Function: Special Trains Registry
// Serves 228 special express trains mined from List_of_Special_Trains_by_Indian_Railways.pdf

const fs = require('fs');
const path = require('path');

let SPECIAL_TRAINS = null;

function loadSpecialTrains() {
  if (SPECIAL_TRAINS) return SPECIAL_TRAINS;
  const possiblePaths = [
    path.join(process.cwd(), 'DATA', 'special_trains.json'),
    path.join(__dirname, '..', 'DATA', 'special_trains.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        SPECIAL_TRAINS = JSON.parse(fs.readFileSync(p, 'utf8'));
        return SPECIAL_TRAINS;
      } catch (e) {}
    }
  }
  return [];
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const q = (url.searchParams.get('q') || '').trim().toUpperCase();

  const all = loadSpecialTrains();
  let filtered = all;
  if (q) {
    filtered = all.filter(t => 
      (t.train_number && t.train_number.includes(q)) || 
      (t.train_name && t.train_name.toUpperCase().includes(q)) || 
      (t.from_station && t.from_station.toUpperCase().includes(q)) || 
      (t.to_station && t.to_station.toUpperCase().includes(q))
    );
  }

  return res.status(200).json({
    count: filtered.length,
    source: 'List_of_Special_Trains_by_Indian_Railways.pdf',
    specialTrains: filtered
  });
};
