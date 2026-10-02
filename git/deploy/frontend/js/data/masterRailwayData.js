/**
 * RailFlow — Master Railway Data Layer (Frontend Authoritative)
 * ─────────────────────────────────────────────────────────────
 * SOURCE HIERARCHY:
 *   PRIMARY:   server.js -> DATA/trainroutes.json (~5200 trains, loaded into memory)
 *   FALLBACK:  This file — used when the server API is unavailable (offline/local file mode)
 *
 * DATA INTEGRITY RULES:
 *   1. Every station km-value is sourced from Southern Railway track charts.
 *   2. Every train number and name is cross-checked against DATA/train_catalog.json.
 *   3. No station is invented. No distance is guessed.
 *   4. VDM (Vadamadurai) is a legitimate station on SOUTHERN_TRUNK — NOT on the Chord Line.
 *   5. ALU -> MS routing ALWAYS uses CHORD_LINE. Never routes through VDM.
 *
 * @version 2.0.0
 */
'use strict';

// CHORD LINE (Chennai Egmore - Tiruchirappalli via Ariyalur)
// km values measured from TPJ (origin=0) upward to MS.
const CHORD_LINE_STATIONS = [
  { code:'TPJ',  name:'Tiruchirappalli Jn',  km:0,   platforms:8,  division:'TPJ', lat:10.7941, lon:78.6854 },
  { code:'SRGM', name:'Srirangam',            km:12,  platforms:2,  division:'TPJ', lat:10.8619, lon:78.6882 },
  { code:'LLI',  name:'Lalgudi',              km:27,  platforms:2,  division:'TPJ', lat:10.8702, lon:78.8196 },
  { code:'ALU',  name:'Ariyalur',             km:70,  platforms:3,  division:'TPJ', lat:11.1500, lon:79.0683 },
  { code:'PNDM', name:'Pennadam',             km:97,  platforms:2,  division:'TPJ', lat:11.3972, lon:79.2281 },
  { code:'VRI',  name:'Vriddhachalam Jn',     km:123, platforms:4,  division:'TPJ', lat:11.5227, lon:79.3479 },
  { code:'VM',   name:'Villupuram Jn',         km:178, platforms:6,  division:'TPJ', lat:11.9401, lon:79.4934 },
  { code:'TMV',  name:'Tindivanam',            km:215, platforms:3,  division:'MAS', lat:12.2462, lon:79.6547 },
  { code:'MLMR', name:'Melmaruvathur',         km:245, platforms:3,  division:'MAS', lat:12.3354, lon:79.8494 },
  { code:'MMK',  name:'Madurantakam',          km:256, platforms:2,  division:'MAS', lat:12.4958, lon:79.8879 },
  { code:'CGL',  name:'Chengalpattu Jn',       km:281, platforms:8,  division:'MAS', lat:12.6941, lon:79.9752 },
  { code:'TBM',  name:'Tambaram',              km:312, platforms:8,  division:'MAS', lat:12.9260, lon:80.1192 },
  { code:'MBM',  name:'Mambalam',              km:330, platforms:4,  division:'MAS', lat:13.0361, lon:80.2098 },
  { code:'MS',   name:'Chennai Egmore',        km:337, platforms:11, division:'MAS', lat:13.0777, lon:80.2602 }
];

// WESTERN TRUNK (MGR Chennai Central - Coimbatore Jn)
const WESTERN_TRUNK_STATIONS = [
  { code:'MAS', name:'MGR Chennai Central', km:0,   platforms:17, division:'MAS', lat:13.0848, lon:80.2749 },
  { code:'PER', name:'Perambur',            km:6,   platforms:4,  division:'MAS', lat:13.1168, lon:80.2361 },
  { code:'TRL', name:'Tiruvallur',          km:42,  platforms:6,  division:'MAS', lat:13.1478, lon:79.9099 },
  { code:'AJJ', name:'Arakkonam Jn',        km:69,  platforms:8,  division:'MAS', lat:13.0796, lon:79.6713 },
  { code:'KPD', name:'Katpadi Jn',          km:130, platforms:5,  division:'MAS', lat:12.9701, lon:79.1412 },
  { code:'JTJ', name:'Jolarpettai Jn',      km:214, platforms:5,  division:'MAS', lat:12.5741, lon:78.5737 },
  { code:'SA',  name:'Salem Jn',            km:334, platforms:6,  division:'SA',  lat:11.6539, lon:78.1533 },
  { code:'ED',  name:'Erode Jn',            km:394, platforms:4,  division:'SA',  lat:11.3411, lon:77.7172 },
  { code:'TUP', name:'Tiruppur',            km:444, platforms:2,  division:'SA',  lat:11.1085, lon:77.3411 },
  { code:'CBE', name:'Coimbatore Jn',       km:495, platforms:6,  division:'SA',  lat:10.9976, lon:76.9663 }
];

// SOUTHERN TRUNK (Tiruchirappalli - Kanyakumari)
// VDM is LEGITIMATE here. It is NOT on the Chord Line.
const SOUTHERN_TRUNK_STATIONS = [
  { code:'TPJ',  name:'Tiruchirappalli Jn',     km:0,   platforms:8,  division:'TPJ', lat:10.7941, lon:78.6854 },
  { code:'MPA',  name:'Manaparai',              km:36,  platforms:3,  division:'MDU', lat:10.6064, lon:78.4200 },
  { code:'VDM',  name:'Vadamadurai',            km:72,  platforms:2,  division:'MDU', lat:10.4390, lon:78.1320 },
  { code:'DG',   name:'Dindigul Jn',            km:94,  platforms:5,  division:'MDU', lat:10.3673, lon:77.9803 },
  { code:'KQN',  name:'Kodaikanal Road',        km:116, platforms:2,  division:'MDU', lat:10.2255, lon:77.8049 },
  { code:'MDU',  name:'Madurai Jn',             km:157, platforms:8,  division:'MDU', lat:9.9199,  lon:78.1103 },
  { code:'VPT',  name:'Virudhunagar Jn',        km:200, platforms:4,  division:'MDU', lat:9.5811,  lon:77.9618 },
  { code:'CVP',  name:'Kovilpatti',             km:249, platforms:2,  division:'MDU', lat:9.1693,  lon:77.8687 },
  { code:'MEJ',  name:'Vanchi Maniyachchi Jn',  km:285, platforms:3,  division:'MDU', lat:8.9178,  lon:77.8252 },
  { code:'TEN',  name:'Tirunelveli Jn',         km:314, platforms:5,  division:'MDU', lat:8.7291,  lon:77.6882 },
  { code:'VLY',  name:'Valliyur',              km:350, platforms:2,  division:'TVC', lat:8.3838,  lon:77.6313 },
  { code:'NCJ',  name:'Nagercoil Jn',          km:388, platforms:4,  division:'TVC', lat:8.1785,  lon:77.4337 },
  { code:'CAPE', name:'Kanyakumari',            km:404, platforms:4,  division:'TVC', lat:8.0883,  lon:77.5385 }
];

const CORRIDORS = {
  CHORD_LINE:     { id:'CHORD_LINE',     name:'Tiruchirappalli - Chennai Egmore (Chord Line)',     stations:CHORD_LINE_STATIONS,     source:'Southern Railway Track Chart, TPJ Division',    sourceType:'authoritative-local' },
  WESTERN_TRUNK:  { id:'WESTERN_TRUNK',  name:'MGR Chennai Central - Coimbatore Jn',              stations:WESTERN_TRUNK_STATIONS,  source:'Southern Railway Track Chart, MAS Division',    sourceType:'authoritative-local' },
  SOUTHERN_TRUNK: { id:'SOUTHERN_TRUNK', name:'Tiruchirappalli Jn - Kanyakumari',                 stations:SOUTHERN_TRUNK_STATIONS, source:'Southern Railway Track Chart, MDU/TVC Division', sourceType:'authoritative-local' }
};

// VERIFIED TRAINS — cross-referenced with DATA/train_catalog.json
const VERIFIED_TRAINS = [
  { number:'12638', name:'Pandian SF Express',      type:'SUPERFAST',   days:'Daily',       origin:'MDU', destination:'MS',
    source:'DATA/train_catalog.json',
    stops:[{code:'MDU',arr:null,dep:'21:35'},{code:'DG',arr:'22:28',dep:'22:30'},{code:'TPJ',arr:'23:45',dep:'23:50'},
           {code:'ALU',arr:'01:14',dep:'01:15'},{code:'VRI',arr:'01:50',dep:'01:52'},{code:'VM',arr:'02:40',dep:'02:45'},
           {code:'CGL',arr:'04:08',dep:'04:10'},{code:'TBM',arr:'04:38',dep:'04:40'},{code:'MS',arr:'05:15',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','S7','B1','B2','B3','A1','A2','H1','GEN2'], stairRef:{coach:'S4',idx:5} },
  { number:'12637', name:'Pandian SF Express',      type:'SUPERFAST',   days:'Daily',       origin:'MS', destination:'MDU',
    source:'DATA/train_catalog.json',
    stops:[{code:'MS',arr:null,dep:'21:40'},{code:'TBM',arr:'22:08',dep:'22:10'},{code:'CGL',arr:'22:38',dep:'22:40'},
           {code:'VM',arr:'00:02',dep:'00:05'},{code:'VRI',arr:'00:55',dep:'00:57'},{code:'ALU',arr:'01:38',dep:'01:39'},
           {code:'TPJ',arr:'02:55',dep:'03:00'},{code:'DG',arr:'04:28',dep:'04:30'},{code:'MDU',arr:'05:25',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','S7','B1','B2','B3','A1','A2','H1','GEN2'], stairRef:{coach:'S4',idx:5} },
  { number:'12636', name:'Vaigai SF Express',       type:'SUPERFAST',   days:'Daily',       origin:'MDU', destination:'MS',
    source:'DATA/train_catalog.json',
    stops:[{code:'MDU',arr:null,dep:'07:10'},{code:'DG',arr:'07:58',dep:'08:00'},{code:'TPJ',arr:'09:05',dep:'09:10'},
           {code:'ALU',arr:'10:14',dep:'10:15'},{code:'VRI',arr:'10:48',dep:'10:50'},{code:'VM',arr:'11:40',dep:'11:45'},
           {code:'CGL',arr:'13:08',dep:'13:10'},{code:'TBM',arr:'13:38',dep:'13:40'},{code:'MS',arr:'14:15',dep:null}],
    rake:['ENG','GEN1','D1','D2','D3','D4','D5','D6','C1','C2','GEN2'], stairRef:{coach:'D3',idx:3} },
  { number:'12635', name:'Vaigai SF Express',       type:'SUPERFAST',   days:'Daily',       origin:'MS', destination:'MDU',
    source:'DATA/train_catalog.json',
    stops:[{code:'MS',arr:null,dep:'13:50'},{code:'TBM',arr:'14:18',dep:'14:20'},{code:'CGL',arr:'14:48',dep:'14:50'},
           {code:'VM',arr:'16:08',dep:'16:12'},{code:'VRI',arr:'17:02',dep:'17:05'},{code:'ALU',arr:'17:44',dep:'17:45'},
           {code:'TPJ',arr:'18:55',dep:'19:00'},{code:'DG',arr:'20:22',dep:'20:25'},{code:'MDU',arr:'21:15',dep:null}],
    rake:['ENG','GEN1','D1','D2','D3','D4','D5','D6','C1','C2','GEN2'], stairRef:{coach:'D3',idx:3} },
  { number:'12606', name:'Pallavan SF Express',     type:'SUPERFAST',   days:'Daily',       origin:'TPJ', destination:'MS',
    source:'DATA/train_catalog.json',
    stops:[{code:'TPJ',arr:'06:50',dep:'06:55'},{code:'LLI',arr:'07:27',dep:'07:28'},
           {code:'ALU',arr:'08:11',dep:'08:12'},{code:'PNDM',arr:'08:32',dep:'08:33'},{code:'VRI',arr:'08:48',dep:'08:50'},
           {code:'VM',arr:'09:40',dep:'09:45'},{code:'MLMR',arr:'10:33',dep:'10:35'},{code:'CGL',arr:'11:03',dep:'11:05'},
           {code:'TBM',arr:'11:33',dep:'11:35'},{code:'MS',arr:'12:10',dep:null}],
    rake:['ENG','GEN1','D1','D2','D3','D4','D5','D6','C1','C2','GEN2'], stairRef:{coach:'D3',idx:3} },
  { number:'12654', name:'Rockfort SF Express',     type:'SUPERFAST',   days:'Daily',       origin:'TPJ', destination:'MS',
    source:'DATA/train_catalog.json',
    stops:[{code:'TPJ',arr:null,dep:'22:50'},{code:'LLI',arr:'23:23',dep:'23:24'},
           {code:'ALU',arr:'23:54',dep:'23:55'},{code:'PNDM',arr:'00:09',dep:'00:10'},{code:'VRI',arr:'00:33',dep:'00:35'},
           {code:'VM',arr:'01:20',dep:'01:25'},{code:'TMV',arr:'01:53',dep:'01:55'},{code:'MLMR',arr:'02:13',dep:'02:15'},
           {code:'CGL',arr:'02:53',dep:'02:55'},{code:'TBM',arr:'03:23',dep:'03:25'},{code:'MS',arr:'04:00',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','S7','B1','B2','A1','GEN2'], stairRef:{coach:'S4',idx:4} },
  { number:'12653', name:'Rockfort SF Express',     type:'SUPERFAST',   days:'Daily',       origin:'MS', destination:'TPJ',
    source:'DATA/train_catalog.json',
    stops:[{code:'MS',arr:null,dep:'23:35'},{code:'TBM',arr:'00:03',dep:'00:05'},{code:'CGL',arr:'00:33',dep:'00:35'},
           {code:'VM',arr:'01:58',dep:'02:02'},{code:'VRI',arr:'02:55',dep:'02:58'},{code:'ALU',arr:'03:30',dep:'03:31'},
           {code:'LLI',arr:'04:05',dep:'04:07'},{code:'TPJ',arr:'04:55',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','S7','B1','B2','A1','GEN2'], stairRef:{coach:'S4',idx:4} },
  { number:'16128', name:'Guruvayur Chennai Egmore Express', type:'EXPRESS', days:'Daily',  origin:'GUV', destination:'MS',
    source:'DATA/train_catalog.json',
    stops:[{code:'MDU',arr:'12:30',dep:'12:35'},{code:'DG',arr:'13:30',dep:'13:35'},{code:'TPJ',arr:'15:10',dep:'15:15'},
           {code:'ALU',arr:'16:44',dep:'16:45'},{code:'VRI',arr:'17:33',dep:'17:35'},{code:'VM',arr:'18:35',dep:'18:40'},
           {code:'CGL',arr:'20:08',dep:'20:10'},{code:'TBM',arr:'20:38',dep:'20:40'},{code:'MS',arr:'21:25',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','B1','B2','GEN2'], stairRef:{coach:'S3',idx:3} },
  { number:'12634', name:'Kanyakumari SF Express',  type:'SUPERFAST',   days:'Daily',       origin:'CAPE', destination:'MS',
    source:'DATA/train_catalog.json',
    stops:[{code:'TEN',arr:'19:10',dep:'19:15'},{code:'MDU',arr:'22:00',dep:'22:05'},
           {code:'TPJ',arr:'00:30',dep:'00:35'},{code:'ALU',arr:'02:39',dep:'02:40'},{code:'VRI',arr:'03:18',dep:'03:20'},
           {code:'VM',arr:'04:10',dep:'04:15'},{code:'CGL',arr:'05:28',dep:'05:30'},{code:'TBM',arr:'05:58',dep:'06:00'},
           {code:'MS',arr:'06:30',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','B1','B2','A1','GEN2'], stairRef:{coach:'S3',idx:3} },
  { number:'12694', name:'Pearl City SF Express',   type:'SUPERFAST',   days:'Daily',       origin:'TN', destination:'MS',
    source:'DATA/train_catalog.json',
    stops:[{code:'TPJ',arr:'01:30',dep:'01:35'},{code:'ALU',arr:'02:45',dep:'02:50'},{code:'VRI',arr:'03:28',dep:'03:30'},
           {code:'VM',arr:'04:18',dep:'04:22'},{code:'CGL',arr:'05:38',dep:'05:40'},{code:'TBM',arr:'06:08',dep:'06:10'},
           {code:'MS',arr:'06:50',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','B1','B2','A1','GEN2'], stairRef:{coach:'S4',idx:4} },
  { number:'12673', name:'Cheran SF Express',       type:'SUPERFAST',   days:'Daily',       origin:'MAS', destination:'CBE',
    source:'DATA/train_catalog.json',
    stops:[{code:'MAS',arr:null,dep:'22:00'},{code:'AJJ',arr:'22:58',dep:'23:00'},{code:'KPD',arr:'23:48',dep:'23:50'},
           {code:'JTJ',arr:'00:58',dep:'01:00'},{code:'SA',arr:'02:32',dep:'02:35'},{code:'ED',arr:'03:35',dep:'03:40'},
           {code:'TUP',arr:'04:28',dep:'04:30'},{code:'CBE',arr:'06:00',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','B1','B2','B3','A1','A2','H1','GEN2'], stairRef:{coach:'S4',idx:4} },
  { number:'12674', name:'Cheran SF Express',       type:'SUPERFAST',   days:'Daily',       origin:'CBE', destination:'MAS',
    source:'DATA/train_catalog.json',
    stops:[{code:'CBE',arr:null,dep:'21:00'},{code:'TUP',arr:'21:32',dep:'21:35'},{code:'ED',arr:'22:25',dep:'22:30'},
           {code:'SA',arr:'23:30',dep:'23:35'},{code:'JTJ',arr:'01:08',dep:'01:10'},{code:'KPD',arr:'01:58',dep:'02:00'},
           {code:'AJJ',arr:'02:48',dep:'02:50'},{code:'MAS',arr:'03:45',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','B1','B2','B3','A1','A2','H1','GEN2'], stairRef:{coach:'S4',idx:4} },
  { number:'20643', name:'Coimbatore Vande Bharat', type:'VANDE BHARAT','days':'Except Wed', origin:'MAS', destination:'CBE',
    source:'DATA/train_catalog.json',
    stops:[{code:'MAS',arr:null,dep:'14:15'},{code:'KPD',arr:'15:48',dep:'15:50'},{code:'SA',arr:'17:58',dep:'18:00'},
           {code:'ED',arr:'18:50',dep:'18:53'},{code:'TUP',arr:'19:33',dep:'19:35'},{code:'CBE',arr:'20:15',dep:null}],
    rake:['EC1','C1','C2','C3','C4','C5','C6','EC2'], stairRef:{coach:'C3',idx:3} },
  { number:'12622', name:'Tamil Nadu Express',      type:'SUPERFAST',   days:'Daily',       origin:'NDLS', destination:'MAS',
    source:'DATA/train_catalog.json',
    stops:[{code:'NDLS',arr:null,dep:'21:05'},{code:'AGC',arr:'23:25',dep:'23:30'},{code:'GWL',arr:'01:13',dep:'01:15'},
           {code:'BPL',arr:'06:45',dep:'06:50'},{code:'NGP',arr:'13:05',dep:'13:10'},{code:'MAS',arr:'07:10',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','S7','S8','S9','B1','B2','B3','A1','A2','H1','GEN2'], stairRef:{coach:'S5',idx:5} }
];

// ─── ROUTING ENGINE ──────────────────────────────────────────────────────────

function isDirectTrain(train, originCode, destCode) {
  var oIdx = train.stops.findIndex(function(s) { return s.code === originCode; });
  var dIdx = train.stops.findIndex(function(s) { return s.code === destCode; });
  return oIdx !== -1 && dIdx !== -1 && oIdx < dIdx;
}

function getDirectCorridorRoute(originCode, destCode) {
  var origin = (originCode || '').trim().toUpperCase();
  var dest   = (destCode   || '').trim().toUpperCase();
  if (!origin || !dest) return { success:false, error:'INVALID_STATION_CODE' };
  if (origin === dest)  return { success:false, error:'SAME_STATION' };

  // MAS normalisation: southern expresses terminate at MS, not MAS
  var queryingMAS = (dest === 'MAS');
  var effectiveDest = queryingMAS ? 'MS' : dest;

  var corridorOrder = ['CHORD_LINE','WESTERN_TRUNK','SOUTHERN_TRUNK'];
  for (var ci = 0; ci < corridorOrder.length; ci++) {
    var cKey = corridorOrder[ci];
    var corridor = CORRIDORS[cKey];
    var stns = corridor.stations;

    var origIdx = stns.findIndex(function(s){ return s.code === origin; });
    var destIdx = stns.findIndex(function(s){ return s.code === effectiveDest; });
    if (origIdx === -1 || destIdx === -1) continue;

    var distKm = Math.abs(stns[destIdx].km - stns[origIdx].km);
    var isDown  = origIdx < destIdx;
    var path    = isDown ? stns.slice(origIdx, destIdx+1)
                         : stns.slice(destIdx, origIdx+1).reverse();

    var directTrains = VERIFIED_TRAINS.filter(function(t){
      return isDirectTrain(t, origin, effectiveDest);
    });

    var estMins = Math.round((distKm / 75.0) * 60);
    return {
      success:      true,
      corridorId:   cKey,
      corridorName: corridor.name,
      origin:       stns[origIdx],
      destination:  queryingMAS
        ? { code:'MAS', name:'MGR Chennai Central',
            note:'Southern broad-gauge expresses terminate at Chennai Egmore (MS). MAS requires a separate suburban/metro connection.' }
        : stns[destIdx],
      distanceKm:       distKm,
      estimatedMinutes: estMins,
      estimatedTime:    Math.floor(estMins/60)+'h '+String(estMins%60).padStart(2,'0')+'m',
      path:             path,
      directTrains:     directTrains,
      note: queryingMAS
        ? 'Southern services terminate at Chennai Egmore (MS). MAS is ~4 km via Chennai suburban/metro.'
        : null,
      source:     corridor.source,
      sourceType: corridor.sourceType
    };
  }

  return {
    success: false,
    error:   'NO_VERIFIED_ROUTE',
    message: 'No verified corridor found for '+origin+' \u2192 '+dest+'. Check station codes or use the server API for inter-zonal routes.'
  };
}

function getStationRecord(code) {
  code = (code||'').trim().toUpperCase();
  for (var k in CORRIDORS) {
    var f = CORRIDORS[k].stations.find(function(s){ return s.code===code; });
    if (f) return f;
  }
  return null;
}

function getStationCorridors(code) {
  code = (code||'').trim().toUpperCase();
  return Object.keys(CORRIDORS).reduce(function(acc,k){
    if (CORRIDORS[k].stations.find(function(s){ return s.code===code; }))
      acc.push({corridorId:k, corridorName:CORRIDORS[k].name});
    return acc;
  },[]);
}

// Browser globals
if (typeof window !== 'undefined') {
  window.MASTER_RAILWAY_DATA = {
    CORRIDORS:CORRIDORS, VERIFIED_TRAINS:VERIFIED_TRAINS,
    CHORD_LINE_STATIONS:CHORD_LINE_STATIONS,
    WESTERN_TRUNK_STATIONS:WESTERN_TRUNK_STATIONS,
    SOUTHERN_TRUNK_STATIONS:SOUTHERN_TRUNK_STATIONS,
    getDirectCorridorRoute:getDirectCorridorRoute,
    isDirectTrain:isDirectTrain,
    getStationRecord:getStationRecord,
    getStationCorridors:getStationCorridors
  };
  console.log('[MasterRailwayData v2] Loaded. Corridors:',Object.keys(CORRIDORS).length,'| Trains:',VERIFIED_TRAINS.length);
}
