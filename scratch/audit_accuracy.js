const fs = require('fs');
// Mock window object
global.window = {};
// Load master data
const code = fs.readFileSync('js/data/masterRailwayData.js', 'utf8');
eval(code);

console.log("TESTING ALU -> MS:");
const res1 = window.MASTER_RAILWAY_DATA.getDirectCorridorRoute('ALU', 'MS');
console.log(JSON.stringify(res1, null, 2));

console.log("\nTESTING MAS -> CBE:");
const res2 = window.MASTER_RAILWAY_DATA.getDirectCorridorRoute('MAS', 'CBE');
console.log(JSON.stringify(res2, null, 2));
