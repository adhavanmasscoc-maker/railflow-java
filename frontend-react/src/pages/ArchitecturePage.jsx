import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const ARCH_LAYERS = [
  {
    stage: 'DATA SOURCES', color: '#3b82f6', icon: '🗂️',
    items: ['trainroutes.json (5,208 trains)', 'stations.csv (8,990 records)', 'station_name.pdf (616 records)', 'special_trains.pdf (228 records)', 'ALL_DATA.csv (13,849 master rows)'],
  },
  {
    stage: 'INGESTION ENGINE', color: '#8b5cf6', icon: '⚙️',
    items: ['DataIngestionEngine.java', 'DataScanner.java', 'PdfExtractor.java (PDFBox)', 'CsvParser.java', 'JsonMapper.java'],
  },
  {
    stage: 'VALIDATION', color: '#f59e0b', icon: '🔍',
    items: ['Schema verification', 'Duplicate detection', 'FK integrity check', 'Coordinate validation', '0 corrupt rows'],
  },
  {
    stage: 'JDBC + SQLITE', color: '#10b981', icon: '🗄️',
    items: ['PreparedStatements (0 SQL injection)', 'WAL mode: PRAGMA journal_mode=WAL', 'Batch inserts (1000/tx)', '21 performance indexes', 'HikariCP max pool: 5'],
  },
  {
    stage: 'JAVA SERVICES', color: '#06b6d4', icon: '☕',
    items: ['RouteSearchService (BFS/Dijkstra)', 'CrowdSimulationService', 'JourneyServiceImpl', 'NetworkServiceImpl', 'ScheduledExecutorService daemon'],
  },
  {
    stage: 'API LAYER', color: '#ec4899', icon: '🌐',
    items: ['Spring Boot REST MVC', 'Node.js Express Proxy', 'Vercel Serverless Functions', 'Gemini AI Gateway (AKNEX)', 'CORS + RFC 7807 errors'],
  },
  {
    stage: 'REACT SPA', color: '#ef4444', icon: '⚛️',
    items: ['Vite 8 + React 19', 'Tailwind CSS 4', 'React Router v7', 'Web Audio API (Chimes)', '19 Telemetry Dashboard Views'],
  },
];

const TECH_STACK = [
  { title: 'Java Backend', version: 'OpenJDK 21 LTS', detail: 'Maven, JDBC, SQLite, PreparedStatements, Batch Processing', icon: '☕', color: '#f59e0b' },
  { title: 'Node.js Proxy', version: 'Node.js 24 + Express', detail: 'PNR Provider, Gemini AI Proxy, Atlas Telemetry, CORS Gateway', icon: '🟢', color: '#10b981' },
  { title: 'React Frontend', version: 'React 19 + Vite 8', detail: 'React Router v7, Chart.js, Tailwind CSS 4, Web Audio API', icon: '⚛️', color: '#38bdf8' },
  { title: 'Database', version: 'SQLite 3 (WAL Mode)', detail: '862K+ total records, 21 indexes, 9 tables, sub-ms queries', icon: '🗄️', color: '#8b5cf6' },
  { title: 'Deployment', version: 'Vercel + GitHub', detail: 'Serverless Functions, Edge Network, CI/CD via push-to-github.bat', icon: '🚀', color: '#ec4899' },
  { title: 'AI Integration', version: 'Gemini API (AKNEX)', detail: 'Natural language dispatch queries, copilot drawer, intent classification', icon: '🤖', color: '#06b6d4' },
];

const JAVA_CLASSES = [
  ['com.railflow.ingestion', 'DataIngestionEngine', 'Orchestrates full CSV/JSON/PDF → SQLite pipeline'],
  ['com.railflow.ingestion', 'PdfExtractor', 'Apache PDFBox extraction for special trains & station metadata'],
  ['com.railflow.database', 'SchemaManager', 'DDL creation, index management, WAL configuration'],
  ['com.railflow.repository.jdbc', 'JdbcStationRepository', 'CRUD + fuzzy search for 8,989 stations'],
  ['com.railflow.repository.jdbc', 'JdbcTrainRepository', 'Train lookup, route fetching with ordered stops'],
  ['com.railflow.repository.jdbc', 'JdbcRouteRepository', 'Direct & transfer route search with graph traversal'],
  ['com.railflow.service', 'RouteSearchService', 'BFS/DFS graph search across 411K edges'],
  ['com.railflow.service', 'CrowdSimulationService', 'O(1) platform density estimation + surge modeling'],
  ['com.railflow.concurrency', 'TelemetryDaemon', 'ScheduledExecutorService fixed 4,000ms tick daemon'],
  ['com.railflow.algorithm', 'DijkstraPathSolver', 'Weighted shortest-path for journey planning'],
  ['com.railflow.model', 'Station / Train / TrainStop', 'Core domain model Java 17 Records & DTOs'],
  ['com.railflow.controller', 'StationController', 'Spring MVC REST: /api/stations endpoints'],
];

const MICROSERVICES = [
  { name: 'API Gateway', status: 'HEALTHY', latency: '2.1ms', requests: '1,240/min', color: '#10b981' },
  { name: 'Route Search Service', status: 'HEALTHY', latency: '0.84ms', requests: '380/min', color: '#10b981' },
  { name: 'Crowd Simulation Daemon', status: 'HEALTHY', latency: '1.8ms', requests: '15/min', color: '#10b981' },
  { name: 'SQLite JDBC Persistence', status: 'HEALTHY', latency: '0.12ms', requests: '2,180/min', color: '#10b981' },
  { name: 'Gemini AI Proxy (AKNEX)', status: 'DEGRADED', latency: '340ms', requests: '12/min', color: '#f59e0b' },
  { name: 'Vercel Serverless Edge', status: 'HEALTHY', latency: '14ms', requests: '890/min', color: '#10b981' },
];

const DIR_TREE = `D:\\CS-ML-JAVA\\JAVA\\RailwaySystem
├── .gemini/                    # Antigravity IDE configuration and agents
├── DATA/                       # Master Ingestion Data Repositories
│   ├── aliases.json            # 9,456 Station search synonyms & aliases
│   ├── stations.json           # 8,989 Clean Station Master Profiles
│   ├── train_catalog.json      # 5,208 Train Catalog with services & classes
│   └── trainroutes.json        # 416,637 Ordered stop-by-stop halt sequences
├── api/                        # Serverless REST & AI Endpoints
│   ├── ask-railflow-ai.js      # RailFlow AI ground-truth copilot handler
│   ├── journey-plan.js         # Dijkstra/BFS inter-hub journey planner
│   ├── stations.js             # Station search & directory service
│   └── trains.js               # Train schedule & route service
├── database/                   # Central SQLite Persistence Engine
│   ├── railway.db              # SQLite 3 Database (WAL mode enabled)
│   ├── railway.db-shm          # Shared memory index cache
│   └── railway.db-wal          # Write-Ahead Log journal
├── frontend-react/             # React 19 + Vite 8 SPA
│   └── src/pages/              # 20 Telemetry Dashboard Views
├── src/main/java/com/railflow/
│   ├── algorithm/              # Dijkstra & BFS solvers
│   ├── concurrency/            # ScheduledExecutorService daemons
│   ├── controller/             # Spring Web MVC REST endpoints
│   ├── dao/                    # Data Access Objects
│   ├── model/                  # Java 17 Records & DTOs
│   ├── repository/             # JDBC PreparedStatement repos
│   └── service/                # Business logic & crowd managers
├── pom.xml                     # Java 21 Maven project config
└── vercel.json                 # Vercel routing & cache headers`;

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <section className="page-view active" id="page-architecture">
      <PageHeader
        systemCode="SYSTEM 09 // SYSTEM ARCHITECTURE"
        title="Full-Stack Dataflow & Engineering Blueprint"
        subtitle="Java 21+ JDBC — CSV/JSON/PDF to React SPA"
        description="Complete 7-tier architecture from CSV/JSON/PDF ingestion through JDBC PreparedStatements, SQLite WAL, Java Services, Node.js Proxy, Vercel Edge, to React SPA with AI integration."
        extra={
          <>
            <span className="badge badge-real">JAVA 21+ JDBC</span>
            <span className="badge badge-derived">7-TIER ARCHITECTURE</span>
          </>
        }
      />

      {/* ─── Tab Bar ─── */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(14,20,36,0.8)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(148,163,184,0.08)', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { k: 'pipeline', label: '🔄 Dataflow Pipeline' },
          { k: 'services', label: '⚙️ Microservices' },
          { k: 'stack', label: '📦 Tech Stack' },
          { k: 'classes', label: '☕ Java Classes' },
          { k: 'directory', label: '📁 Directory' },
        ].map(t => (
          <button key={t.k} onClick={() => setActiveTab(t.k)}
            style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === t.k ? '#38bdf8' : 'transparent', color: activeTab === t.k ? '#000' : 'var(--color-text-secondary)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'pipeline' && (
        <>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>End-to-End Dataflow Pipeline (7 Tiers)</div>
          <div style={{ display: 'flex', gap: '0', alignItems: 'stretch', marginBottom: '20px', overflowX: 'auto' }}>
            {ARCH_LAYERS.map((layer, i) => (
              <div key={i} style={{ flex: 1, minWidth: '140px' }}>
                <div style={{
                  padding: '14px 12px', background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(148,163,184,0.07)',
                  borderTop: `3px solid ${layer.color}`,
                  borderRadius: i === 0 ? '8px 0 0 8px' : i === ARCH_LAYERS.length - 1 ? '0 8px 8px 0' : '0',
                  height: '100%',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px' }}>{layer.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '9px', color: layer.color, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>{layer.stage}</span>
                  </div>
                  {layer.items.map((item, j) => (
                    <div key={j} style={{ fontSize: '10px', color: '#94a3b8', padding: '2px 0', fontFamily: 'var(--font-mono)' }}>• {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 'var(--radius-lg)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#38bdf8' }}>
            Score = (0.45 × Occupancy%) + (0.25 × DwellMin) + (0.20 × FOB_Distance) + (0.10 × Turnout) &nbsp;|&nbsp; PriorityQueue Platform Scoring Heuristic
          </div>
        </>
      )}

      {activeTab === 'services' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {MICROSERVICES.map((svc, i) => (
            <div key={i} style={{ padding: '16px', background: 'rgba(14,20,36,0.9)', border: `1px solid ${svc.color}22`, borderRadius: 'var(--radius-lg)', borderLeft: `3px solid ${svc.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#e2e8f0' }}>{svc.name}</span>
                <span style={{ background: `${svc.color}22`, color: svc.color, fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>{svc.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <div>
                  <div style={{ color: 'var(--color-text-muted)', marginBottom: '2px' }}>LATENCY</div>
                  <div style={{ color: '#10b981', fontWeight: 700 }}>{svc.latency}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-muted)', marginBottom: '2px' }}>REQ/MIN</div>
                  <div style={{ color: '#38bdf8', fontWeight: 700 }}>{svc.requests}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stack' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {TECH_STACK.map(t => (
            <div key={t.title} style={{ padding: '16px', background: 'rgba(14,20,36,0.9)', border: `1px solid ${t.color}22`, borderRadius: 'var(--radius-lg)', borderTop: `3px solid ${t.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.title}</span>
                <span style={{ fontSize: '20px' }}>{t.icon}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: t.color, marginBottom: '6px' }}>{t.version}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{t.detail}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'classes' && (
        <div style={{ background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(148,163,184,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>☕ Core Java Class Registry</span>
            <span className="badge badge-real">com.railflow.*</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                  {['Package', 'Class', 'Role'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JAVA_CLASSES.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>{row[0]}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', color: '#38bdf8' }}>{row[1]}</td>
                    <td style={{ padding: '10px 16px', fontSize: '12px', color: '#94a3b8' }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'directory' && (
        <div style={{ background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(148,163,184,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📁 Complete Project Directory Structure</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)' }}>Root: D:\CS-ML-JAVA\JAVA\RailwaySystem</span>
          </div>
          <pre style={{ padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#94a3b8', overflowX: 'auto', lineHeight: 1.7, whiteSpace: 'pre', margin: 0 }}>
            <code>{DIR_TREE}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
