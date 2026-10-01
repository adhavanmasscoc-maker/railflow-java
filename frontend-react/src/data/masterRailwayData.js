export const CHORD_LINE_STATIONS = [
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

export const WESTERN_TRUNK_STATIONS = [
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

export const SOUTHERN_TRUNK_STATIONS = [
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

export const CORRIDORS = {
  CHORD_LINE:     { id:'CHORD_LINE',     name:'Tiruchirappalli - Chennai Egmore (Chord Line)',     stations:CHORD_LINE_STATIONS,     source:'Southern Railway Track Chart, TPJ Division',    sourceType:'authoritative-local' },
  WESTERN_TRUNK:  { id:'WESTERN_TRUNK',  name:'MGR Chennai Central - Coimbatore Jn',              stations:WESTERN_TRUNK_STATIONS,  source:'Southern Railway Track Chart, MAS Division',    sourceType:'authoritative-local' },
  SOUTHERN_TRUNK: { id:'SOUTHERN_TRUNK', name:'Tiruchirappalli Jn - Kanyakumari',                 stations:SOUTHERN_TRUNK_STATIONS, source:'Southern Railway Track Chart, MDU/TVC Division', sourceType:'authoritative-local' }
};

export const VERIFIED_TRAINS = [
  { number:'12638', name:'Pandian SF Express',      type:'SUPERFAST',   days:'Daily',       origin:'MDU', destination:'MS',
    source:'DATA/train_catalog.json',
    stops:[{code:'MDU',arr:null,dep:'21:35'},{code:'DG',arr:'22:28',dep:'22:30'},{code:'TPJ',arr:'23:45',dep:'23:50'},
           {code:'ALU',arr:'01:14',dep:'01:15'},{code:'VRI',arr:'01:50',dep:'01:52'},{code:'VM',arr:'02:40',dep:'02:45'},
           {code:'CGL',arr:'04:08',dep:'04:10'},{code:'TBM',arr:'04:38',dep:'04:40'},{code:'MS',arr:'05:15',dep:null}],
    rake:['ENG','GEN1','S1','S2','S3','S4','S5','S6','S7','B1','B2','B3','A1','A2','H1','GEN2'], stairRef:{coach:'S4',idx:5} }
];

export function isDirectTrain(train, originCode, destCode) {
  const oIdx = train.stops.findIndex(s => s.code === originCode);
  const dIdx = train.stops.findIndex(s => s.code === destCode);
  return oIdx !== -1 && dIdx !== -1 && oIdx < dIdx;
}

export function getDirectCorridorRoute(originCode, destCode) {
  const origin = (originCode || '').trim().toUpperCase();
  const dest   = (destCode   || '').trim().toUpperCase();
  if (!origin || !dest) return { success:false, error:'INVALID_STATION_CODE' };
  if (origin === dest)  return { success:false, error:'SAME_STATION' };

  const queryingMAS = (dest === 'MAS');
  const effectiveDest = queryingMAS ? 'MS' : dest;

  const corridorOrder = ['CHORD_LINE','WESTERN_TRUNK','SOUTHERN_TRUNK'];
  for (let ci = 0; ci < corridorOrder.length; ci++) {
    const cKey = corridorOrder[ci];
    const corridor = CORRIDORS[cKey];
    const stns = corridor.stations;

    const origIdx = stns.findIndex(s => s.code === origin);
    const destIdx = stns.findIndex(s => s.code === effectiveDest);
    if (origIdx === -1 || destIdx === -1) continue;

    const distKm = Math.abs(stns[destIdx].km - stns[origIdx].km);
    const isDown  = origIdx < destIdx;
    const path    = isDown ? stns.slice(origIdx, destIdx+1)
                         : stns.slice(destIdx, origIdx+1).reverse();

    const directTrains = VERIFIED_TRAINS.filter(t => isDirectTrain(t, origin, effectiveDest));

    const estMins = Math.round((distKm / 75.0) * 60);
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
    message: `No verified corridor found for ${origin} → ${dest}. Check station codes or use the server API for inter-zonal routes.`
  };
}
