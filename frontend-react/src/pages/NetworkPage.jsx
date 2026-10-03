import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import NetworkTopologyGraph from '../components/NetworkTopologyGraph';

export default function NetworkPage() {
  const [activeSubView, setActiveSubView] = useState('radar'); // Default to Radar as requested
  const [activeStation, setActiveStation] = useState('MS');
  const [sandboxLog, setSandboxLog] = useState([
    'System initialization: All 16 zonal tracking nodes connected.',
    'Chord Line (ALU–TPJ–MS) telemetry streaming at 3,000ms nominal frequency.',
    'Turnstile sensors and FOB load balancers calibrated.'
  ]);
  const [concourseLoad, setConcourseLoad] = useState('48.2%');
  const [fobLoad, setFobLoad] = useState('0.9 pax/m²');
  const [gateMetering, setGateMetering] = useState(false);

  const triggerConflict = () => {
    setConcourseLoad('79.4% (SURGE)');
    setFobLoad('1.8 pax/m² (WARNING)');
    setSandboxLog(prev => [
      `[${new Date().toLocaleTimeString()}] ⚠️ SIMULATION CONFLICT: 25-minute signal delay on Platform 2. Headway margin critical.`,
      `[${new Date().toLocaleTimeString()}] 📢 Triggered passenger advisory on Channel 2. PriorityQueue rebalancer armed.`,
      ...prev.slice(0, 8)
    ]);
  };

  const triggerSurge = () => {
    setConcourseLoad('88.7% (CRITICAL)');
    setFobLoad('2.3 pax/m² (STAMPEDE HAZARD)');
    setSandboxLog(prev => [
      `[${new Date().toLocaleTimeString()}] 👥 RUSH HOUR INGRESS: +1,800 commuters detected at main booking concourse.`,
      `[${new Date().toLocaleTimeString()}] 🛡️ Automated recommendation: Engage Concourse Gate Metering & deploy standby clone rake.`,
      ...prev.slice(0, 8)
    ]);
  };

  const executeOptimization = () => {
    setConcourseLoad('52.1% (NORMAL)');
    setFobLoad('1.1 pax/m² (SAFE)');
    setSandboxLog(prev => [
      `[${new Date().toLocaleTimeString()}] 🧠 HEURISTIC PRIORITYQUEUE RESOLVED: Reallocated incoming express from Platform 2 to Platform 3 in 0.84ms.`,
      `[${new Date().toLocaleTimeString()}] ✅ Turnout points locked. Audio announcement dispatched across terminal speakers.`,
      ...prev.slice(0, 8)
    ]);
  };

  const toggleMetering = () => {
    setGateMetering(!gateMetering);
    setSandboxLog(prev => [
      `[${new Date().toLocaleTimeString()}] 🛡️ ${!gateMetering ? 'CONCOURSE GATE METERING ENGAGED: Turnstiles throttled to 25 pax/min.' : 'Gate metering disengaged: Restored nominal inflow (120 pax/min).' }`,
      ...prev.slice(0, 8)
    ]);
  };

  return (
    <section className="page-view active" id="page-network">
      <PageHeader
        systemCode="SYSTEM 03 // RAILRADAR & TOPOLOGY OPS"
        title="Live Satellite RailRadar & Network Topology"
        subtitle="Satellite Telemetry & Inter-Hub Network"
        description="Multi-source geo-referenced satellite radar, logical Indian Railways topology graph, and autonomous platform dispatch sandbox."
        badge="LIVE GPS RADAR"
        badgeColor="emerald"
        extra={
          <>
            <span className="badge badge-derived">NETWORK TOPOLOGY</span>
            <span className="badge">DISPATCH SANDBOX</span>
          </>
        }
      />

      {/* Sub-view Selector Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            className={`btn ${activeSubView === 'radar' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubView('radar')}
          >
            <span>🛰️ Live Satellite RailRadar</span>
          </button>
          <button
            className={`btn ${activeSubView === 'topology' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubView('topology')}
          >
            <span>🌐 Inter-Hub Topology Graph</span>
          </button>
          <button
            className={`btn ${activeSubView === 'dispatch' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubView('dispatch')}
          >
            <span>🎮 Dynamic Dispatch Sandbox</span>
          </button>
          <button
            className={`btn ${activeSubView === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubView('directory')}
          >
            <span>🌲 Project Topology &amp; Dirs</span>
          </button>
          <button
            className={`btn ${activeSubView === 'provenance' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubView('provenance')}
          >
            <span>📚 Data Sources &amp; References</span>
          </button>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot"></span>
          <span>Station: {activeStation} • All Systems Live</span>
        </div>
      </div>

      {/* VIEW 1: LIVE SATELLITE RAILRADAR STREAM */}
      {activeSubView === 'radar' && (
        <div className="network-subview" style={{ height: 'calc(100vh - 250px)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              <span className="pulse-dot"></span>
              <span>Multi-Source Satellite &amp; Station Telemetry Active</span>
              <span className="badge badge-real" style={{ marginLeft: '8px' }}>LIVE SATELLITE RAILRADAR STREAM</span>
            </div>
            <a href="https://railradar.in/railradar" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '4px 8px' }}>
              <span>🛰️ Open Fullscreen Radar ↗</span>
            </a>
          </div>
          <iframe src="https://railradar.in/railradar" title="RailRadar Live Map" loading="lazy" allow="geolocation" style={{ flex: 1, border: 'none', width: '100%' }}></iframe>
        </div>
      )}

      {/* VIEW 2: FULL INTERACTIVE SVG TOPOLOGY GRAPH (ORIGINAL RAILFLOW SPECIFICATION) */}
      {activeSubView === 'topology' && (
        <NetworkTopologyGraph />
      )}

      {/* VIEW 3: AUTONOMOUS TERMINAL DISPATCH & SIMULATION SANDBOX */}
      {activeSubView === 'dispatch' && (
        <div className="panel" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
          <div className="panel-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>CENTRAL OPERATIONS CONTROL (COC) • TERMINAL DISPATCHER</div>
              <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                <span>🚉</span> {activeStation} — Hub Sandbox Simulation
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['MS', 'MAS', 'TPJ', 'NDLS', 'HWH'].map(stn => (
                <button 
                  key={stn}
                  className={`btn ${activeStation === stn ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => setActiveStation(stn)}
                >
                  {stn}
                </button>
              ))}
            </div>
          </div>
          <div className="panel-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn btn-danger" onClick={triggerConflict}>
                <span>⚠️ Simulate 25m Delay (PF 2 Conflict)</span>
              </button>
              <button className="btn btn-secondary" onClick={triggerSurge}>
                <span>👥 Simulate Rush Hour Surge</span>
              </button>
              <button className="btn" style={{ background: 'var(--color-indigo-600)', color: '#fff', border: 'none' }} onClick={executeOptimization}>
                <span>🧠 Execute PriorityQueue Reallocation</span>
              </button>
              <button className={`btn ${gateMetering ? 'btn-primary' : 'btn-secondary'}`} onClick={toggleMetering}>
                <span>🛡️ {gateMetering ? 'Turnstiles Throttled (25 pax/min)' : 'Engage Concourse Gate Metering'}</span>
              </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', background: 'rgba(14,20,36,0.5)' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Overall Concourse Load</div>
                <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                  {concourseLoad}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Turnstile Inflow: {gateMetering ? '25 pax/min' : '120 pax/min'}</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', background: 'rgba(14,20,36,0.5)' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>FOB Staircase Chokepoint</div>
                <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                  {fobLoad}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Stampede Threshold: 2.5 pax/m²</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', background: 'rgba(14,20,36,0.5)' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>PriorityQueue Reallocator</div>
                <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', color: '#10B981' }}>
                  READY (O(log n))
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Evaluation Heap: 6 Candidates</div>
              </div>
            </div>

            {/* Live Audit Log */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '8px' }}>
                CENTRAL OPERATIONS CONTROL (COC) AUDIT STREAM
              </div>
              <div style={{ padding: '12px', background: '#070C18', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                {sandboxLog.map((log, idx) => (
                  <div key={idx} style={{ color: log.includes('⚠️') ? '#F87171' : (log.includes('🧠') ? '#34D399' : '#94A3B8') }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: WHOLE PROJECT DIRECTORY TOPOLOGY (dir.md) */}
      {activeSubView === 'directory' && (
        <div className="panel" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
          <div className="panel-header">
            <div>
              <span className="panel-title">Complete Project Directory Structure &amp; Repository Hierarchy</span>
              <span className="badge badge-real" style={{ marginLeft: '10px' }}>dir.md AUDIT</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              Root: D:\CS-ML-JAVA\JAVA\RailwaySystem
            </span>
          </div>
          <div className="panel-body" style={{ padding: '24px' }}>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>
              Authoritative directory hierarchy of the entire RailFlow enterprise platform, covering Java source packages, native Node/Express servers, SQLite databases, datasets, and static web distributions.
            </p>
            <pre style={{ background: '#070C18', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', color: '#67E8F9', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6, overflowX: 'auto', maxHeight: '500px' }}>
{`D:\\CS-ML-JAVA\\JAVA\\RailwaySystem
├── .gemini/                       # Antigravity IDE configuration and agents
├── .git/                          # Git version control metadata & history
├── .vercel/                       # Vercel deployment link & project cache
├── DATA/                          # Master Ingestion Data Repositories
│   ├── aliases.json               # 9,456 Station search synonyms & aliases
│   ├── stations.json              # 8,989 Clean Station Master Profiles
│   ├── train_catalog.json         # 5,208 Train Catalog with services & classes
│   ├── trainroutes.json           # 416,637 Ordered stop-by-stop halt sequences
│   ├── station_heritage.json      # Heritage opening years & footfall profiles
│   ├── train_heritage.json        # Historical livery & inaugural profiles
│   └── trains/                    # 5,208 Individual per-train JSON route files
├── api/                           # Serverless REST & AI Endpoints
│   ├── ask-railflow-ai.js         # RailFlow AI ground-truth copilot handler
│   ├── atlas-proxy.js             # OpenRailwayMap tile proxy
│   ├── database.js                # SQLite read-only query runner
│   ├── journey-plan.js            # Dijkstra/BFS inter-hub journey planner
│   ├── stations.js                # Station search & directory service
│   └── trains.js                  # Train schedule & route service
├── backend/                       # Native Node.js Express Application Server
│   ├── server.js                  # Standalone Express HTTP server
│   └── src/                       # Express route controllers & repositories
├── frontend-react/                # Modern React 19 + Vite SPA Distribution
│   ├── src/pages/                 # 19 Enterprise Operations views
│   ├── src/components/            # Design system, Topbar, Sidebar, PIS Studio
│   └── src/services/              # Multi-tier resilient Gemini AI client
├── src/main/java/com/railflow/    # Java 17+ Enterprise Core & Concurrency
│   ├── algorithm/                 # Shortest-path Dijkstra & BFS solvers
│   ├── concurrency/               # ScheduledExecutorService daemons
│   ├── controller/                # Spring Web MVC REST endpoints
│   ├── dao/                       # Data Access Objects (Zero SQL injection)
│   └── service/                   # Business logic & crowd managers
├── railway.db                     # Root SQLite 3 database file (WAL mode)
├── server.js                      # Root local development server
└── README.md                      # Official project documentation`}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 5: DATA PROVENANCE & OFFICIAL REFERENCES */}
      {activeSubView === 'provenance' && (
        <div className="panel" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
          <div className="panel-header">
            <div>
              <span className="panel-title">Data Provenance, Ingestion Methodology &amp; Official References</span>
              <span className="badge badge-real" style={{ marginLeft: '10px' }}>EMPIRICAL SOURCES</span>
            </div>
          </div>
          <div className="panel-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(14,20,36,0.6)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '6px' }}>🚆 Indian Railways (IRCTC / CRIS)</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
                  Authoritative train schedules, 5,208 train services, and 416,637 halt records ingested from official National Train Enquiry System (NTES) schedules.
                </div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(14,20,36,0.6)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '6px' }}>🗺️ OpenRailwayMap &amp; OpenStreetMap</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
                  Geo-referenced railway topology with 8,989 stations, 21,318 track edges, and 25kV AC electrification infrastructure.
                </div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(14,20,36,0.6)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '6px' }}>🛡️ Kavach (TCAS) Specifications</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
                  RDSO specification for Indian Railways Automatic Train Protection (ATP), continuous cab-signalling, and automatic braking supervision.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
