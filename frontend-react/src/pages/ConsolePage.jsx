import { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { audioEngine } from '../services/audioEngine';

// Pre-formatted boot banner matching original RailFlow JVM terminal
const INITIAL_OUTPUT = [
  { text: '⚡ RailFlow Interactive Java Console — BASH + JAVA HYBRID', type: 'highlight' },
  { text: 'JVM 21 LTS (ONLINE)', type: 'success' },
  { text: '[BOOT] Initializing RailFlow Runtime Engine (OpenJDK 21 LTS 64-Bit)...', type: 'info' },
  { text: '[BOOT] SQLite JDBC in WAL mode connected (railway.db | HikariCP Pool: 10)', type: 'info' },
  { text: '[BOOT] Master station database indexed: 8,989 stations | 5,208 trains | 416,637 halts', type: 'info' },
  { text: '[BOOT] PriorityQueue Max-Heap initialized for Top-K Platform Optimization', type: 'info' },
  { text: '[BOOT] Southern Railway Chord Line cached: ALU <-> VRI <-> VM <-> CGL <-> TBM <-> MS', type: 'info' },
  { text: '[BOOT] All systems nominal. Type number (1-16) or "help" for available commands.', type: 'success' },
  { text: '────────────────────────────────────────────────────────────────────────────────', type: 'dim' },
  { text: 'railflow@jvm:~$ Ready. Try: 12, trains, stations, alu, 12638, stats, kavach, help', type: 'dim' }
];

export default function ConsolePage() {
  const [output, setOutput] = useState(INITIAL_OUTPUT);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // Execute one of the 16 core operations
  const executeOption = (num) => {
    const lines = [];

    switch (num) {
      case 1:
        lines.push({ text: 'railflow@jvm:~$ 1 (START)', type: 'cmd' });
        lines.push({ text: '═══════════════ INITIALIZING RAILFLOW JVM RUNTIME ENGINE ═══════════════', type: 'highlight' });
        lines.push({ text: '├── Runtime          : OpenJDK 21 LTS 64-Bit Server VM (Temurin-21.0.3+9)', type: 'info' });
        lines.push({ text: '├── HikariCP Pool    : 10 Active JDBC Connections connected to railway.db (WAL mode)', type: 'success' });
        lines.push({ text: '├── Master Stations  : 8,989 Stations Indexed │ 416,637 Halt Records Loaded', type: 'success' });
        lines.push({ text: '├── Concurrency      : ScheduledExecutorService active @4000ms fixed-rate intervals', type: 'info' });
        lines.push({ text: '├── Project Loom     : 1,024 Virtual Fiber Tasks Mounted & Ready', type: 'success' });
        lines.push({ text: '└── STATUS           : ⚡ JVM RUNTIME OPERATIONAL & DAEMON ONLINE', type: 'success' });
        break;

      case 2:
        lines.push({ text: 'railflow@jvm:~$ 2 (TRAINS)', type: 'cmd' });
        lines.push({ text: '═════════════ INDIAN RAILWAYS PREMIER EXPRESS DIRECTORY ═════════════', type: 'highlight' });
        lines.push({ text: '  12638 Pandian Superfast Express    MDU ➔ MS    Daily   PF 1   [ON-TIME]', type: 'info' });
        lines.push({ text: '  12636 Vaigai Superfast Express     MDU ➔ MS    Daily   PF 3   [ON-TIME]', type: 'info' });
        lines.push({ text: '  12606 Pallavan Superfast Express   KKDI ➔ MS   Daily   PF 2   [+4m DELAY]', type: 'warn' });
        lines.push({ text: '  12654 Rockfort Superfast Express   TPJ ➔ MS    Daily   PF 3   [ON-TIME]', type: 'info' });
        lines.push({ text: '  12621 Tamil Nadu Express           MAS ➔ NDLS  Daily   PF 7   [ON-TIME]', type: 'info' });
        lines.push({ text: '  12622 Tamil Nadu Express           NDLS ➔ MAS  Daily   PF 8   [+12m DELAY]', type: 'warn' });
        lines.push({ text: '  12301 Howrah Rajdhani Express      HWH ➔ NDLS  Daily   PF 9   [ON-TIME]', type: 'info' });
        lines.push({ text: '  12951 Mumbai Rajdhani Express      MMCT ➔ NDLS Daily   PF 1   [ON-TIME]', type: 'info' });
        lines.push({ text: '  20607 Vande Bharat Express         MAS ➔ MYS   6d/Wk   PF 2A  [ON-TIME]', type: 'success' });
        lines.push({ text: '  Type 5-digit train number (e.g. "12638", "12636") for halt sequence & live telemetry.', type: 'dim' });
        break;

      case 3:
        lines.push({ text: 'railflow@jvm:~$ 3 (STATIONS)', type: 'cmd' });
        lines.push({ text: '═════════════ STRATEGIC ZONAL TERMINAL HUBS & OCCUPANCY ═════════════', type: 'highlight' });
        lines.push({ text: '  MAS   │ Chennai Central       │ 17 PFs │ Footfall: 520k/day │ Occupancy: 80.0% [CRITICAL]', type: 'error' });
        lines.push({ text: '  MS    │ Chennai Egmore        │ 11 PFs │ Footfall: 380k/day │ Occupancy: 64.0% [ELEVATED]', type: 'warn' });
        lines.push({ text: '  NDLS  │ New Delhi             │ 16 PFs │ Footfall: 450k/day │ Occupancy: 35.0% [NORMAL]', type: 'success' });
        lines.push({ text: '  HWH   │ Howrah Junction       │ 23 PFs │ Footfall: 510k/day │ Occupancy: 62.0% [ELEVATED]', type: 'warn' });
        lines.push({ text: '  CSMT  │ Mumbai CST            │ 18 PFs │ Footfall: 480k/day │ Occupancy: 58.0% [ELEVATED]', type: 'warn' });
        lines.push({ text: '  SBC   │ Bangalore City        │ 10 PFs │ Footfall: 250k/day │ Occupancy: 55.0% [ELEVATED]', type: 'warn' });
        lines.push({ text: '  TPJ   │ Tiruchchirappalli Jn  │  6 PFs │ Footfall: 120k/day │ Occupancy: 28.0% [NORMAL]', type: 'success' });
        lines.push({ text: '  ALU   │ Ariyalur (Chord Line) │  3 PFs │ Footfall:  12k/day │ Occupancy: 18.0% [NORMAL]', type: 'success' });
        lines.push({ text: '  Type station code (e.g. "alu", "tpj", "ms", "mas", "ndls") for detailed platform inventory.', type: 'dim' });
        break;

      case 4:
        lines.push({ text: 'railflow@jvm:~$ 4 (CROWD)', type: 'cmd' });
        lines.push({ text: '═════════════ REAL-TIME CONCOURSE INFLUX & HAZARD ESTIMATOR ═════════════', type: 'highlight' });
        lines.push({ text: '├── Monitored Station : Chennai Central (MAS) — Main Concourse & FOB 1/2', type: 'info' });
        lines.push({ text: '├── Passenger Influx  : 184 commuters/min (Surging during evening rush peak)', type: 'warn' });
        lines.push({ text: '├── Platform 5 Density: 2.18 persons/m² [LEVEL 3 HIGH DENSITY — Stampede Risk]', type: 'error' });
        lines.push({ text: '├── Platform 3 Density: 0.45 persons/m² [LEVEL 1 NORMAL DENSITY]', type: 'success' });
        lines.push({ text: '├── Foot Overbridge   : 1.62 persons/m² [STAIRWAY CONGESTION ELEVATED]', type: 'warn' });
        lines.push({ text: '├── Stampede Hazard   : 42.4 / 100 (Threshold 65.0 triggers Strobe Hold)', type: 'highlight' });
        lines.push({ text: '└── Flow Mitigation   : Route overflow via South Subway corridor to PF 3.', type: 'success' });
        break;

      case 5:
        lines.push({ text: 'railflow@jvm:~$ 5 (SOLVER)', type: 'cmd' });
        lines.push({ text: '═══════════ PLATFORM HEURISTIC OPTIMIZER (PriorityQueue Max-Heap) ═══════════', type: 'highlight' });
        lines.push({ text: '[CONFLICT DETECTED] Train 12638 Pandian Express delayed 25m on Platform 2.', type: 'error' });
        lines.push({ text: '├── Current PF 2 Occupancy : 80.0% [CRITICAL OVERLAP DETECTED]', type: 'warn' });
        lines.push({ text: '├── Evaluated Candidates   : PF 1 (Penalty: 34.2), PF 3 (Penalty: 18.2), PF 4 (Penalty: 42.0)', type: 'info' });
        lines.push({ text: '├── Selected Strategy      : Polymorphic Action "ChangePlatformStrategy"', type: 'success' });
        lines.push({ text: '├── Heuristic Assignment   : REALLOCATE 12638 ➔ PLATFORM 3 (Current Occupancy: 24.0% NORMAL)', type: 'success' });
        lines.push({ text: '└── Resolution Latency     : Heuristic solved in 1.4 ms.', type: 'highlight' });
        break;

      case 6:
        lines.push({ text: 'railflow@jvm:~$ 6 (RADAR)', type: 'cmd' });
        lines.push({ text: '═══════════ SATELLITE RAILRADAR TELEMETRY STREAM ═══════════', type: 'highlight' });
        lines.push({ text: '├── GPS Transponder : Multi-source Indian Railways satellite telemetry linked', type: 'info' });
        lines.push({ text: '├── Active Trains   : 5,208 Trains track-monitored via RTIS / ISRO NAVIC receivers', type: 'info' });
        lines.push({ text: '├── Speed Vectors   : 12638 Pandian SF @ 94 km/h | 12636 Vaigai SF @ 105 km/h', type: 'success' });
        lines.push({ text: '└── Track Geometry  : Broad Gauge 1,676 mm electrified inter-hub corridors nominal', type: 'success' });
        break;

      case 7:
        lines.push({ text: 'railflow@jvm:~$ 7 (VOICE)', type: 'cmd' });
        lines.push({ text: '═══════════ MULTI-LINGUAL STATION PA ANNOUNCEMENT SOUNDBOARD ═══════════', type: 'highlight' });
        lines.push({ text: '├── Available Languages : English (en-IN), Tamil (தமிழ்), Hindi (हिन्दी), +6 Regional', type: 'info' });
        lines.push({ text: '├── Audio Synthesizer   : 4-Tone Authentic IR Acoustic Chime (D5-F#5-A5-D6)', type: 'info' });
        lines.push({ text: '├── Vocal Persona       : 👩 Female PIS Announcer / 👨 Male Station PA (Modulated Pitch)', type: 'success' });
        lines.push({ text: '├── Cloud HD Stream     : Native Tamil Pronunciation Active via /api/tts', type: 'success' });
        lines.push({ text: '└── Action Triggered    : Synthesizing genuine 4-tone IR station chime...', type: 'highlight' });
        audioEngine.playIRChime();
        break;

      case 8:
        lines.push({ text: 'railflow@jvm:~$ 8 (PNR)', type: 'cmd' });
        lines.push({ text: '═══════════ IRCTC 10-DIGIT GATEWAY PNR VERIFICATION ═══════════', type: 'highlight' });
        lines.push({ text: '├── Gateway Interface : Connected to CRIS PRS Core Database Adapter', type: 'info' });
        lines.push({ text: '├── PNR Verification  : 10-Digit Algorithmic Checksum Validation Active', type: 'info' });
        lines.push({ text: '├── Sample PNR Query  : pnr 4234567890 ➔ 12638 Pandian SF (Coach B2, Berth 42 LB - CNF)', type: 'success' });
        lines.push({ text: '└── Usage             : Type "pnr <10-digit-number>" for full passenger manifest verification.', type: 'dim' });
        break;

      case 9:
        lines.push({ text: 'railflow@jvm:~$ 9 (ROUTING)', type: 'cmd' });
        lines.push({ text: '═══════════ BFS SHORTEST PATH ROUTING TRAVERSAL: MAS ➔ NDLS ═══════════', type: 'highlight' });
        lines.push({ text: '├── Source Station    : MAS (Chennai Central — Southern Railway)', type: 'info' });
        lines.push({ text: '├── Destination       : NDLS (New Delhi — Northern Railway)', type: 'info' });
        lines.push({ text: '├── Traversal Route   : MAS ➔ AJJ ➔ KPD ➔ JTJ ➔ RU ➔ GDR ➔ BZA ➔ WL ➔ NGP ➔ ET ➔ BPL ➔ JHS ➔ AGC ➔ MTJ ➔ NDLS', type: 'success' });
        lines.push({ text: '├── Corridor Details  : Grand Trunk Corridor • 15 Major Strategic Hubs • ~2,186 km', type: 'info' });
        lines.push({ text: '└── Graph Traversal   : 4.2 ms execution • 342 visited nodes in memory', type: 'highlight' });
        break;

      case 10:
        lines.push({ text: 'railflow@jvm:~$ 10 (SCHEMA)', type: 'cmd' });
        lines.push({ text: '═════════════ SQLITE WAL RELATIONAL SCHEMA (railway.db) ═════════════', type: 'highlight' });
        lines.push({ text: '  TABLE stations        │ 8,989 rows │ (code TEXT PK, name, state, zone, lat, lon, platforms, footfall)', type: 'info' });
        lines.push({ text: '  TABLE trains          │ 5,208 rows │ (number TEXT PK, name, type, source, destination, frequency)', type: 'info' });
        lines.push({ text: '  TABLE train_routes    │ 416,637 rows │ (train_number FK, station_code FK, sequence, arr, dep, km)', type: 'info' });
        lines.push({ text: '  TABLE crowd_telemetry │ 13,849 rows │ (station_code, platform, occupancy, density, timestamp)', type: 'info' });
        lines.push({ text: '  TABLE pnr_records     │ 50,000 rows │ (pnr TEXT PK, train_num, doj, booking_status, coach, berth)', type: 'info' });
        lines.push({ text: '  PRAGMA journal_mode   │ WAL (Write-Ahead Log) • PRAGMA synchronous = NORMAL', type: 'success' });
        lines.push({ text: '  PRAGMA cache_size     │ -8000 (8 MB) • foreign_keys = ON', type: 'success' });
        break;

      case 11:
        lines.push({ text: 'railflow@jvm:~$ 11 (METERING)', type: 'cmd' });
        lines.push({ text: '═══════════ CONCOURSE TURNSTILE GATE METERING VALVE ═══════════', type: 'highlight' });
        lines.push({ text: '[FLOW CONTROLLER ENGAGED] Concourse Turnstile Inflow Metered', type: 'warn' });
        lines.push({ text: '├── Gate Throttling   : 45 passengers / minute (-55% reduction against surge)', type: 'info' });
        lines.push({ text: '├── Platform Access   : Turnstile barrier hold active on Entry Gates 3 & 4', type: 'warn' });
        lines.push({ text: '├── Hazard Mitigation : Stampede index reduced from 42.4 ➔ 18.0 (Normal Level)', type: 'success' });
        lines.push({ text: '└── Status            : Concourse inflow throttled to prevent platform overcrowding.', type: 'success' });
        break;

      case 12:
        lines.push({ text: 'railflow@jvm:~$ 12 (CLONE)', type: 'cmd' });
        lines.push({ text: '═══════════ STANDBY RELIEF CLONE RAKE DEPLOYMENT ═══════════', type: 'highlight' });
        lines.push({ text: '[DISPATCH ORDER ISSUED] Standby Relief Clone Train 02638 Commissioned', type: 'success' });
        lines.push({ text: '├── Clone Train No.   : 02638 (Pandian Express Relief Special)', type: 'info' });
        lines.push({ text: '├── Home Shed         : Golden Rock (GOC) & Basin Bridge (BBQ)', type: 'info' });
        lines.push({ text: '├── Rake Composition  : 22 LHB Coaches (2SL + 12 3E + 4 3A + 2 2A + 1 1A + EOG)', type: 'info' });
        lines.push({ text: '├── Traction          : WAP-7 #30452 (Royapuram Electric Loco Shed)', type: 'info' });
        lines.push({ text: '└── Line Clearance    : GREEN CORRIDOR authorized on Southern Main Chord Line.', type: 'success' });
        break;

      case 13:
        lines.push({ text: 'railflow@jvm:~$ 13 (SIGNALS)', type: 'cmd' });
        lines.push({ text: '═══════════ RDSO KAVACH TCAS SIGNALS & HEADWAY MATRIX ═══════════', type: 'highlight' });
        lines.push({ text: '├── Specification     : RDSO/SPN/196/2020 v4.0 (Autonomous ATP System)', type: 'info' });
        lines.push({ text: '├── Station TCAS      : DUAL-REDUNDANT ACTIVE (Electronic Interlocking Optical Link)', type: 'success' });
        lines.push({ text: '├── Loco Cab Signals  : 4,200+ WAP-7, WAP-5, WAG-9, Vande Bharat T18 cabs armed', type: 'success' });
        lines.push({ text: '├── Radio Link        : UHF 433 MHz Duplex Packet Telemetry (2,000 ms heartbeat)', type: 'info' });
        lines.push({ text: '├── Movement Authority: MA Curve supervision active (AEB armed for SPAD prevention)', type: 'success' });
        lines.push({ text: '└── Sector Status     : Villupuram–Ariyalur–Trichy Chord Line 100% Kavach protected.', type: 'success' });
        break;

      case 14:
        lines.push({ text: 'railflow@jvm:~$ 14 (ANALYTICS)', type: 'cmd' });
        lines.push({ text: '═══════════ 40-YEAR HISTORICAL OPERATIONS & PUNCTUALITY ═══════════', type: 'highlight' });
        lines.push({ text: '├── Time Horizon      : 1986 – 2026 (40 Years Longitudinal Operation)', type: 'info' });
        lines.push({ text: '├── Route Network     : Expanded from 61,813 km ➔ 68,000+ km (95% Electrified)', type: 'info' });
        lines.push({ text: '├── Annual Passengers : Grew from 3.7 Billion ➔ 8.5 Billion passengers/year', type: 'info' });
        lines.push({ text: '├── Punctuality Avg   : Superfast Express: 88.4% │ Vande Bharat / Rajdhani: 94.8%', type: 'success' });
        lines.push({ text: '└── Safety Metric     : Zero signal overshoot collisions on Kavach-commissioned sections.', type: 'success' });
        break;

      case 15:
        lines.push({ text: 'railflow@jvm:~$ 15 (SPECS)', type: 'cmd' });
        lines.push({ text: '═══════════ SYSTEM DIAGNOSTICS & JVM NEOFETCH ═══════════', type: 'highlight' });
        lines.push({ text: '       /\\_/\\         OS: RailFlow IR Network Intelligence 2.0 (Alpine Linux / Windows)', type: 'info' });
        lines.push({ text: '      ( o.o )        Host: Enterprise Rail Operations Controller (AKNEX Core)', type: 'info' });
        lines.push({ text: '       > ^ <         Kernel: Linux 6.6 LTS / Windows NT 10.0 x64', type: 'info' });
        lines.push({ text: '                     Uptime: 48 days, 14 hours, 22 mins', type: 'info' });
        lines.push({ text: '                     Packages: 12 (Maven / Java 21 LTS Modules)', type: 'info' });
        lines.push({ text: '                     Shell: RailFlow JVM Bash Shell 2.1', type: 'info' });
        lines.push({ text: '                     JVM: OpenJDK 21.0.3 LTS (Eclipse Temurin 64-Bit Server VM)', type: 'success' });
        lines.push({ text: '                     Heap: 218.4 MB / 2048.0 MB (ZGC Sub-millisecond)', type: 'success' });
        lines.push({ text: '                     Database: SQLite 3.50.3 WAL (8,989 stations, 5,208 trains)', type: 'success' });
        lines.push({ text: '                     Kavach TCAS: RDSO/SPN/196/2020 v4.0 ACTIVE', type: 'success' });
        break;

      case 16:
        lines.push({ text: 'railflow@jvm:~$ 16 (STOP)', type: 'cmd' });
        lines.push({ text: '═══════════ RAILFLOW ENGINE STANDBY PROCEDURE ═══════════', type: 'highlight' });
        lines.push({ text: '├── Committing pending SQLite WAL journal transactions... [DONE]', type: 'info' });
        lines.push({ text: '├── Idle HikariCP JDBC connection pool parked... [DONE]', type: 'info' });
        lines.push({ text: '├── Telemetry ScheduledExecutorService transitioned to STANDBY... [DONE]', type: 'info' });
        lines.push({ text: '└── STATUS: RAILFLOW ENGINE IN STANDBY MODE (Enter 1 or "start" to resume)', type: 'warn' });
        break;

      default:
        lines.push({ text: `Unknown command option: ${num}. Try 1-16 or "help".`, type: 'error' });
        break;
    }

    return lines;
  };

  // Main command processing engine
  const handleCommand = (rawInput) => {
    const trimmed = (rawInput || '').trim();
    if (!trimmed) return;

    // Add to history
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Echo input
    setOutput(prev => [...prev, { text: `railflow@jvm:~$ ${trimmed}`, type: 'cmd' }]);

    // Clean brackets / dots: e.g. "[12]", "12.", "#12" -> "12"
    const cleaned = trimmed.replace(/[\[\]#.]/g, '').trim();
    const lower = cleaned.toLowerCase();
    const upper = cleaned.toUpperCase();

    // Clear command
    if (lower === 'clear' || lower === 'cls') {
      setOutput([]);
      return;
    }

    // Check if numeric choice 1-16
    const numChoice = parseInt(cleaned, 10);
    if (!isNaN(numChoice) && numChoice >= 1 && numChoice <= 16 && /^\d{1,2}$/.test(cleaned)) {
      const resp = executeOption(numChoice);
      setOutput(prev => [...prev, ...resp]);
      return;
    }

    // Command word alias map
    const aliasMap = {
      'start': 1, 'init': 1, 'boot': 1, '1': 1,
      'trains': 2, 'train': 2, 'trains list': 2, '2': 2,
      'stations': 3, 'station': 3, 'hubs': 3, '3': 3,
      'crowd': 4, 'density': 4, 'influx': 4, '4': 4,
      'solver': 5, 'optimize': 5, 'heap': 5, 'solve': 5, '5': 5,
      'radar': 6, 'railradar': 6, 'gps': 6, '6': 6,
      'voice': 7, 'audio': 7, 'chime': 7, 'pa': 7, 'soundboard': 7, '7': 7,
      'pnr': 8, 'prs': 8, 'ticket': 8, '8': 8,
      'routing': 9, 'route': 9, 'bfs': 9, 'dijkstra': 9, 'path': 9, '9': 9,
      'schema': 10, 'tables': 10, 'sqlite': 10, 'ddl': 10, '10': 10,
      'metering': 11, 'turnstile': 11, 'gate': 11, 'throttle': 11, '11': 11,
      'clone': 12, 'relief': 12, 'special': 12, 'rake': 12, '12': 12,
      'signals': 13, 'kavach': 13, 'tcas': 13, 'signal': 13, '13': 13,
      'analytics': 14, 'stats': 14, 'history': 14, 'punctuality': 14, '14': 14,
      'specs': 15, 'neofetch': 15, 'jvm': 15, 'java': 15, 'version': 15, '15': 15,
      'stop': 16, 'halt': 16, 'shutdown': 16, 'standby': 16, '16': 16
    };

    if (aliasMap[lower]) {
      const resp = executeOption(aliasMap[lower]);
      setOutput(prev => [...prev, ...resp]);
      return;
    }

    // Special standalone commands:
    const lines = [];

    if (lower === 'help') {
      lines.push({ text: '═════════════ RAILFLOW HYBRID JAVA 21 LTS JVM & BASH COMMANDS ═════════════', type: 'highlight' });
      lines.push({ text: '  [1] ⚡ START      : Initialize JVM, HikariCP pool & Loom virtual threads', type: 'info' });
      lines.push({ text: '  [2] 🚆 TRAINS     : Express schedules, daily routes & status', type: 'info' });
      lines.push({ text: '  [3] 🚉 STATIONS   : Zonal hub platform capacity & daily footfall', type: 'info' });
      lines.push({ text: '  [4] 👥 CROWD      : Concourse influx estimator & stampede hazard indices', type: 'info' });
      lines.push({ text: '  [5] 🧠 SOLVER     : PriorityQueue Max-Heap platform conflict optimizer', type: 'info' });
      lines.push({ text: '  [6] 🛰️ RADAR      : Satellite GPS telemetry & live track vectors', type: 'info' });
      lines.push({ text: '  [7] 📢 VOICE      : Multi-lingual station PA announcements with 4-tone chime', type: 'info' });
      lines.push({ text: '  [8] 🎫 PNR        : 10-Digit CRIS PRS verification & ticket manifest', type: 'info' });
      lines.push({ text: '  [9] 🧭 ROUTING    : BFS/Dijkstra shortest-path corridor solver', type: 'info' });
      lines.push({ text: ' [10] 🗄️ SCHEMA     : SQLite 3 WAL relational tables and B-Tree indexes', type: 'info' });
      lines.push({ text: ' [11] 🚪 METERING   : Concourse turnstile gate throttle (-55% crowd surge)', type: 'info' });
      lines.push({ text: ' [12] 🚆 CLONE      : Standby relief clone rake dispatch (Train 02638)', type: 'info' });
      lines.push({ text: ' [13] 🚦 SIGNALS    : RDSO Kavach TCAS braking supervision curves', type: 'info' });
      lines.push({ text: ' [14] 📊 ANALYTICS  : 40-Year longitudinal punctuality & network stats', type: 'info' });
      lines.push({ text: ' [15] ⚙️ SPECS      : JVM Neofetch, memory footprint & thread daemons', type: 'info' });
      lines.push({ text: ' [16] ⏹️ STOP       : Park JDBC pools & enter low-power standby mode', type: 'info' });
      lines.push({ text: '────────────────────────────────────────────────────────────────────────', type: 'dim' });
      lines.push({ text: 'Direct Queries: Try "alu", "tpj", "ms", "12638", "12636", "jvm", "kavach"', type: 'dim' });
      setOutput(prev => [...prev, ...lines]);
      return;
    }

    if (lower === 'java -version' || lower === 'java') {
      lines.push({ text: 'openjdk version "21.0.3" 2024-04-16 LTS', type: 'success' });
      lines.push({ text: 'OpenJDK Runtime Environment Temurin-21.0.3+9 (build 21.0.3+9-LTS)', type: 'info' });
      lines.push({ text: 'OpenJDK 64-Bit Server VM Temurin-21.0.3+9 (build 21.0.3+9-LTS, mixed mode, sharing)', type: 'info' });
      lines.push({ text: 'RailFlow Engine: Pure Java 17+ Enterprise Core with Loom Virtual Threads Active', type: 'highlight' });
      setOutput(prev => [...prev, ...lines]);
      return;
    }

    if (lower === 'threads') {
      lines.push({ text: '═══ JVM ACTIVE THREAD POOL & DAEMON INVENTORY ═══', type: 'highlight' });
      lines.push({ text: '├── [T-01] main                       │ State: RUNNABLE │ Priority: 5 (App Dispatcher)', type: 'info' });
      lines.push({ text: '├── [T-02] RailFlow-Crowd-Daemon-1    │ State: TIMED_WAITING (4000ms Loop) │ Daemon: TRUE', type: 'success' });
      lines.push({ text: '├── [T-03] Kavach-Signal-Supervisor-1 │ State: RUNNABLE │ Safety Distance Curve Monitor', type: 'success' });
      lines.push({ text: '├── [T-04] SQLite-WAL-Sync-Worker     │ State: TIMED_WAITING │ fsync Checkpoint Worker', type: 'info' });
      lines.push({ text: '├── [T-05] Netty-EventLoopGroup-1-1   │ State: RUNNABLE │ Non-blocking I/O Dispatcher', type: 'info' });
      lines.push({ text: '└── Total Threads: 6 Platform Threads │ 1,024 Loom Virtual Fiber Tasks Nominal', type: 'highlight' });
      setOutput(prev => [...prev, ...lines]);
      return;
    }

    // Direct Train queries (e.g. "12638", "12636", "12606", "train 12638")
    const trainNum = trimmed.replace(/^train\s+/i, '');
    if (/^\d{5}$/.test(trainNum)) {
      lines.push({ text: `[TRAIN ROUTE ENGINE] Querying Train #${trainNum}...`, type: 'highlight' });
      if (trainNum === '12638') {
        lines.push({ text: 'Train #12638 — Pandian Superfast Express', type: 'success' });
        lines.push({ text: '├── Route Corridor : Madurai Jn (MDU) ➔ Chennai Egmore (MS) via Chord Line', type: 'info' });
        lines.push({ text: '├── Distance/Speed : 497 km │ Average Speed: 58 km/h │ Rake: 22 LHB Coaches', type: 'info' });
        lines.push({ text: '├── Halt Sequence  : MDU (21:20) ➔ DG (22:08) ➔ TPJ (23:15) ➔ ALU (01:14) ➔ VRI (01:58) ➔ VM (02:40) ➔ CGL (03:58) ➔ TBM (04:28) ➔ MS (05:15)', type: 'info' });
        lines.push({ text: '├── Ariyalur Halt  : Arr: 01:14 │ Dep: 01:15 │ Halt: 1 min │ Platform: 3 assigned', type: 'success' });
        lines.push({ text: '└── Telemetry      : Delay: +0m (ON TIME) │ Kavach TCAS: ACTIVE │ Headway: CLEAR', type: 'success' });
      } else if (trainNum === '12636') {
        lines.push({ text: 'Train #12636 — Vaigai Superfast Express', type: 'success' });
        lines.push({ text: '├── Route Corridor : Madurai Jn (MDU) ➔ Chennai Egmore (MS) via Chord Line (Day SF)', type: 'info' });
        lines.push({ text: '├── Distance/Speed : 497 km │ Average Speed: 62 km/h │ Intercity Rake', type: 'info' });
        lines.push({ text: '├── Halt Sequence  : MDU (07:10) ➔ DG (07:58) ➔ TPJ (09:05) ➔ ALU (10:14) ➔ VRI (11:00) ➔ VM (11:45) ➔ MS (14:15)', type: 'info' });
        lines.push({ text: '└── Status         : Nominal (On Time │ Signal Clearance: GREEN)', type: 'success' });
      } else {
        lines.push({ text: `Train #${trainNum} verified in SQLite Master Registry (5,208 active trains).`, type: 'success' });
        lines.push({ text: 'Schedule: Ground Truth Active │ Status: Operational │ Safety: Kavach Verified', type: 'info' });
      }
      setOutput(prev => [...prev, ...lines]);
      return;
    }

    // Direct Station queries (e.g. "alu", "tpj", "ms", "mas", "ndls")
    const stationCode = upper.replace(/^STATION\s+/i, '');
    const stationTelemetry = {
      'ALU': {
        name: 'Ariyalur',
        zone: 'Southern Railway (SR)',
        pfs: 3,
        desc: 'Southern Railway Main Chord Line (Villupuram–Trichy)',
        trains: '12638 Pandian SF, 12636 Vaigai SF, 12606 Pallavan SF, 12654 Rockfort SF',
        footfall: '3.8 Million Commuters/Year │ Station Category: NSG-5'
      },
      'TPJ': {
        name: 'Tiruchchirappalli Junction',
        zone: 'Southern Railway (SR)',
        pfs: 6,
        desc: 'Delta & Golden Rock Coaching Hub │ Chord Line Bifurcation',
        trains: '12636 Vaigai SF, 12654 Rockfort SF, 12606 Pallavan SF, 20605 Vande Bharat',
        footfall: '18.2 Million Commuters/Year │ Strategic Division Hub'
      },
      'MS': {
        name: 'Chennai Egmore',
        zone: 'Southern Railway (SR)',
        pfs: 11,
        desc: 'Southern Terminal Hub for South Tamil Nadu Chord Line Expresses',
        trains: '12638 Pandian SF, 12636 Vaigai SF, 12654 Rockfort SF, 12606 Pallavan SF',
        footfall: '42.5 Million Commuters/Year │ UNESCO Heritage Terminal'
      },
      'MAS': {
        name: 'Chennai Central',
        zone: 'Southern Railway (SR)',
        pfs: 17,
        desc: 'Grand Trunk Terminal for Delhi, Mumbai, Howrah & Bangalore Trunks',
        trains: '12621 TN Express, 12007 Shatabdi Express, 20607 Vande Bharat',
        footfall: '65.0 Million Commuters/Year │ Category: NSG-1'
      },
      'NDLS': {
        name: 'New Delhi Railway Station',
        zone: 'Northern Railway (NR)',
        pfs: 16,
        desc: 'Apex Northern Trunk Hub │ Grand Trunk & Taj Corridor Terminal',
        trains: '12622 Tamil Nadu Express, 12302 Howrah Rajdhani, 22436 Vande Bharat',
        footfall: '85.0 Million Commuters/Year │ Category: NSG-1'
      }
    };

    if (stationTelemetry[stationCode]) {
      const s = stationTelemetry[stationCode];
      lines.push({ text: `[STATION TELEMETRY] ${stationCode} │ ${s.name}`, type: 'highlight' });
      lines.push({ text: `├── Operational Zone : ${s.zone} │ 25kV AC Electrified`, type: 'info' });
      lines.push({ text: `├── Platform Tracks  : ${s.pfs} Broad-Gauge Platforms (LHB 24-Coach Compliant)`, type: 'info' });
      lines.push({ text: `├── Line Alignment   : ${s.desc}`, type: 'success' });
      lines.push({ text: `├── Active Expresses : ${s.trains}`, type: 'info' });
      lines.push({ text: `├── Annual Footfall  : ${s.footfall}`, type: 'info' });
      lines.push({ text: `├── Kavach TCAS      : ACTIVE (Braking Curve Supervision: 130 km/h)`, type: 'success' });
      lines.push({ text: `└── Concourse Status : GREEN (Density: 0.48 persons/m² │ Turnstile Inflow Nominal)`, type: 'success' });
      setOutput(prev => [...prev, ...lines]);
      return;
    }

    // Fallback error with clear actionable suggestion
    lines.push({
      text: `Command not recognized: "${trimmed}".`,
      type: 'error'
    });
    lines.push({
      text: '👉 Enter a number between 1 and 16 (e.g. 12 for Clone, 2 for Trains, 7 for Voice), or type "help".',
      type: 'dim'
    });
    setOutput(prev => [...prev, ...lines]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length > 0 && historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIdx);
          setInput(history[nextIdx] || '');
        }
      }
    }
  };

  const clearConsole = () => setOutput([]);

  const getLineColor = (type) => {
    switch (type) {
      case 'highlight': return '#38bdf8'; // light cyan
      case 'success':   return '#34d399'; // emerald
      case 'warn':      return '#fbbf24'; // amber
      case 'error':     return '#f87171'; // red
      case 'cmd':       return '#94a3b8'; // slate
      case 'dim':       return '#64748b'; // muted slate
      case 'info':
      default:          return '#e2e8f0'; // bright text
    }
  };

  const quickChips = [
    { num: 1, label: '[1] ⚡ START' },
    { num: 2, label: '[2] 🚆 TRAINS' },
    { num: 3, label: '[3] 🚉 STATIONS' },
    { num: 4, label: '[4] 👥 CROWD' },
    { num: 5, label: '[5] 🧠 SOLVER' },
    { num: 6, label: '[6] 🛰️ RADAR' },
    { num: 7, label: '[7] 📢 VOICE' },
    { num: 8, label: '[8] 🎫 PNR' },
    { num: 9, label: '[9] 🧭 ROUTING' },
    { num: 10, label: '[10] 🗄️ SCHEMA' },
    { num: 11, label: '[11] 🚪 METERING' },
    { num: 12, label: '[12] 🚆 CLONE' },
    { num: 13, label: '[13] 🚦 SIGNALS' },
    { num: 14, label: '[14] 📊 ANALYTICS' },
    { num: 15, label: '[15] ⚙️ SPECS' },
    { num: 16, label: '[16] ⏹️ STOP' }
  ];

  return (
    <section className="page-view active" id="page-console">
      <PageHeader
        systemCode="SYSTEM 02 // OPERATIONS CONSOLE"
        title="RailFlow Interactive Java Console"
        subtitle="Bash + Java Hybrid — JVM 21 LTS"
        description="Enterprise Java 21 LTS Interactive Operations Terminal (RailFlowConsole.java). Simulates direct JVM runtime interaction, SQLite WAL batch querying, PriorityQueue platform conflict optimization, and real-time station soundboard."
        badge="JVM ONLINE"
        badgeColor="emerald"
        extra={
          <>
            <span className="badge badge-real">BASH + JAVA HYBRID</span>
            <span className="badge">16 COMMANDS ACTIVE</span>
            <button className="btn btn-secondary" onClick={clearConsole}>Clear Console</button>
          </>
        }
      />

      <div
        className="console-terminal-window"
        id="consoleTerminalWindow"
        style={{
          background: '#070b14',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          marginTop: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        {/* Terminal Titlebar */}
        <div
          className="console-titlebar"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            borderBottom: '1px solid #1e293b',
            background: '#0d1527'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span style={{ marginLeft: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
              ⚡ RailFlow Interactive Java Console — BASH + JAVA HYBRID
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#34d399' }}>
            <span className="pulse-dot"></span> JVM 21 LTS (ONLINE)
          </span>
        </div>
        
        {/* Terminal Output Area */}
        <div
          className="console-output-area"
          style={{
            padding: '16px',
            height: '420px',
            overflowY: 'auto',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '12px',
            color: '#e2e8f0',
            lineHeight: 1.6,
            background: '#070b14'
          }}
        >
          {output.map((line, idx) => (
            <div
              key={idx}
              style={{
                color: getLineColor(line.type),
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'inherit'
              }}
            >
              {line.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        
        {/* Terminal Input Row */}
        <div
          className="console-input-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            background: '#0b1325',
            borderTop: '1px solid #1e293b'
          }}
        >
          <span
            className="console-prompt"
            style={{
              color: '#38bdf8',
              marginRight: '10px',
              fontFamily: 'monospace',
              fontSize: '13px',
              fontWeight: 700,
              userSelect: 'none'
            }}
          >
            railflow@jvm:~$
          </span>
          <input 
            ref={inputRef}
            type="text" 
            className="console-input" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command (e.g. 12, 1, 2, trains, stations, alu, 12638, help, cls)..." 
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '13px'
            }}
            autoComplete="off" 
            spellCheck="false" 
          />
        </div>
      </div>

      {/* 16 Interactive Clickable Command Chips */}
      <div style={{ marginTop: '16px', spaceY: '8px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ⚡ 16 Direct Execution Command Chips (Click to execute or type number):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {quickChips.map((chip) => (
            <button 
              key={chip.num} 
              onClick={() => handleCommand(String(chip.num))}
              style={{
                padding: '7px 13px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#cbd5e1',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.color = '#34d399';
                e.currentTarget.style.background = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.background = '#0f172a';
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
