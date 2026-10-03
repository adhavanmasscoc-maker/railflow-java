import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { useRailwayData } from '../context/RailwayDataContext';

const CORRIDORS = [
  { name: 'Northern Trunk', dist: '1,445 km', route: 'NDLS → CNB → ALD → MGS → HWH', color: '#ef4444', from: 'NDLS', to: 'HWH' },
  { name: 'Western Trunk', dist: '1,384 km', route: 'NDLS → MTJ → AGC → JP → ADI → BCT', color: '#3b82f6', from: 'NDLS', to: 'BCT' },
  { name: 'Central Corridor', dist: '1,281 km', route: 'CSMT → PUNE → GR → SC → MAS', color: '#06b6d4', from: 'CSTM', to: 'MAS' },
  { name: 'South Coast', dist: '495 km', route: 'MS → TBM → TPJ → MDU', color: '#10b981', from: 'MAS', to: 'MDU' },
];

const PIPELINE_STEPS = ['DATA SOURCE', 'INGESTION', 'VALIDATION', 'JDBC', 'SQLITE', 'NETWORK GRAPH', 'ANALYTICS', 'LIVE UI'];

const INITIAL_ALERTS = [
  { id: 1, sev: 'CRITICAL', msg: 'Pandian Express (12638) — 25m delay on PF-2. Heuristic reallocation: PF-3 (24% load).', time: '14:23:45' },
  { id: 2, sev: 'WARNING',  msg: 'FOB-2 Staircase crush load 2.1 pax/m² (threshold: 2.5). Crowd dispersal advisory issued.', time: '14:21:10' },
  { id: 3, sev: 'INFO',     msg: 'DataIngestionEngine: 13,849 records validated. WAL checkpoint complete. 0 corrupt rows.', time: '14:18:33' },
  { id: 4, sev: 'WARNING',  msg: 'Schedule overlap at BZA: 12622 Tamil Nadu Exp vs 12634 Vaigai Exp on PF-3 (07:10–07:15).', time: '14:15:22' },
  { id: 5, sev: 'INFO',     msg: 'Vande Bharat 20951 NDLS→BSB departed on time. PF-1 cleared. Next: Rajdhani 12302 @ 16:55.', time: '14:05:12' },
];

const FLEET_TELEMETRY = [
  { id: '12301', name: 'Howrah Rajdhani', block: 'NDLS–CNB', speed: '130', signal: '🟢', status: 'ON TIME' },
  { id: '12638', name: 'Pandian Express', block: 'MAS–TBM', speed: '85', signal: '🔴', status: 'DELAYED 25m' },
  { id: '20951', name: 'Vande Bharat', block: 'NDLS–CNB', speed: '160', signal: '🟢', status: 'ON TIME' },
  { id: '12163', name: 'Chennai Express', block: 'PUNE–SC', speed: '110', signal: '🟡', status: 'MINOR DELAY 5m' },
  { id: '22691', name: 'Rajdhani Exp', block: 'HWH–BBS', speed: '120', signal: '🟢', status: 'ON TIME' },
];

const PLATFORM_LOADS = [
  { code: 'MAS', name: 'Chennai Central', pf: 'PF-1', load: 68, status: 'MODERATE' },
  { code: 'NDLS', name: 'New Delhi', pf: 'PF-4', load: 82, status: 'HIGH' },
  { code: 'HWH', name: 'Howrah', pf: 'PF-2', load: 44, status: 'NORMAL' },
  { code: 'BCT', name: 'Mumbai CSMT', pf: 'PF-6', load: 91, status: 'CRITICAL' },
  { code: 'MS', name: 'Chennai Egmore', pf: 'PF-3', load: 35, status: 'NORMAL' },
];

const MAP_MODE_SRC = {
  openrailway: 'https://www.openrailwaymap.org/?style=standard&lat=21.0&lon=78.5&zoom=5',
  radar: 'https://railradar.in/railradar',
};

const sevColor = { CRITICAL: '#ef4444', WARNING: '#f59e0b', INFO: '#10b981' };
const sevBg =   { CRITICAL: 'rgba(239,68,68,0.08)', WARNING: 'rgba(245,158,11,0.08)', INFO: 'rgba(16,185,129,0.06)' };
const loadColor = (pct) => pct >= 80 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981';

export default function DashboardPage() {
  const { trains, stations, alerts, logs, crowdData } = useRailwayData();
  const [mapMode, setMapMode] = useState('openrailway');
  const [ticker, setTicker] = useState(0);

  // Use the global alerts and logs from Context instead of local state
  const liveAlerts = alerts;
  const dispatchLog = logs.length > 0 ? logs : [
    { t: '14:23:52', msg: '[HEURISTIC] PriorityQueue resolved PF-2 conflict → PF-3 allocated.', c: '#10b981' },
    { t: '14:22:10', msg: '[CROWD] MAS FOB-2: 2.1 pax/m². Advisory: open alternate FOB-4.', c: '#f59e0b' },
    { t: '14:18:00', msg: '[JDBC] WAL checkpoint: 13,849 records committed. Pragma sync: NORMAL.', c: '#38bdf8' },
    { t: '14:15:45', msg: '[SIGNAL] Block clearance: NDLS-AGC section — CLEAR. Speed: 130 km/h.', c: '#10b981' },
  ];

  // Derive aggregate metrics
  const totalFootprint = crowdData.reduce((acc, c) => acc + c.footfall, 0);
  const avgDensity = crowdData.length > 0 ? crowdData.reduce((acc, c) => acc + c.density_pax_sqm, 0) / crowdData.length : 0;
  
  const [footprint, setFootprint] = useState(totalFootprint);
  const [density, setDensity] = useState(avgDensity);

  // Sync derived footprint/density when context updates
  useEffect(() => {
    setFootprint(totalFootprint);
    setDensity(avgDensity);
  }, [totalFootprint, avgDensity]);

  // Live ticker + footprint simulation
  useEffect(() => {
    const iv = setInterval(() => {
      setTicker(t => t + 1);
      setFootprint(f => f + Math.floor(Math.random() * 60 - 20));
      setDensity(d => parseFloat((d + (Math.random() * 0.6 - 0.3)).toFixed(1)));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  // Dispatch log simulation
  useEffect(() => {
    const msgs = [
      { msg: '[TELEMETRY] Heartbeat: all 16 subsystems nominal. Latency < 2ms.', c: '#10b981' },
      { msg: '[ROUTING] BFS shortest-path computed in 0.84ms (21,318 edges).', c: '#38bdf8' },
      { msg: '[CROWD] Concourse inflow: 127 pax/min. FOB load: nominal.', c: '#fbbf24' },
      { msg: '[SQLITE] Connection pool: 4/5 active. WAL journal: 0KB pending.', c: '#38bdf8' },
    ];
    const iv = setInterval(() => {
      const entry = msgs[Math.floor(Math.random() * msgs.length)];
      setDispatchLog(prev => [{ t: new Date().toLocaleTimeString('en-IN', { hour12: false }), ...entry }, ...prev].slice(0, 8));
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="page-view active" id="page-dashboard">
      <PageHeader
        systemCode="SYSTEM 01 // DASHBOARD"
        title="Logical Indian Railways Network Graph"
        subtitle="Real-Time Monitoring & Data Processing"
        description="Inter-hub topology connecting Northern, Western, Central, Eastern and Southern railway networks backed by Core Java 21+, JDBC and SQLite."
        extra={
          <>
            <span className="badge badge-real">REAL DATA: SQLITE</span>
            <span className="badge badge-derived">DERIVED GRAPH</span>
            <span className="badge badge-simulated">SIMULATED TELEMETRY</span>
          </>
        }
      />

      {/* ─── Operational Pipeline ─── */}
      <div style={{ marginBottom: '20px', padding: '14px 18px', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>OPERATIONAL INGESTION PIPELINE LIFECYCLE</span>
          <span style={{ color: '#10b981' }}>● NOMINAL — Tick #{ticker + 1}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {PIPELINE_STEPS.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '72px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(56,189,248,0.12)', border: '1.5px solid rgba(56,189,248,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{idx + 1}</div>
              <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── KPI Metric Cards ─── */}
      <div className="dashboard-grid" style={{ marginBottom: '20px' }}>
        {[
          { title: 'Stations Registered', val: '8,989', sub: '25 High-Density Zonal Hubs Active', badge: 'SQLite', badgeCls: 'badge-real', strip: [{ k: 'STATIONS', v: '8,989' }, { k: 'HUBS', v: '25' }, { k: 'KAVACH', v: 'ACTIVE' }] },
          { title: 'Primary Corridors', val: '6 Trunks', sub: 'Golden Quadrilateral & Grand Trunk', badge: 'Topology', badgeCls: 'badge-derived', strip: [{ k: 'QUADRILATERAL', v: '6' }, { k: 'KM TRUNK', v: '2,410' }, { k: 'STATUS', v: 'NOMINAL' }] },
          { title: 'Monitored Footprint', val: footprint.toLocaleString(), sub: `Platform Density: ${density}%`, badge: '4000ms Loop', badgeCls: 'badge-simulated', strip: [{ k: 'RATE', v: '4,000ms' }, { k: 'PEAK', v: 'MAS PF-1' }, { k: 'EGRESS', v: 'CLEAR' }] },
          { title: 'Empirical Dataset', val: '13,849', sub: '100% Validated • 0 Key Collisions', badge: 'ALL_DATA.csv', badgeCls: 'badge-real', strip: [{ k: 'SCHEMA', v: '3NF' }, { k: 'PRAGMA', v: 'WAL' }, { k: 'CORRUPT', v: '0%' }] },
        ].map((card, i) => (
          <div key={i} className="kpi-card" style={{ background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</span>
              <span className={`badge ${card.badgeCls}`} style={{ fontSize: '9px' }}>{card.badge}</span>
            </div>
            <div className="metric-val" style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#e2e8f0', lineHeight: 1 }}>{card.val}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '6px 0 10px' }}>{card.sub}</div>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px', borderTop: '1px solid rgba(148,163,184,0.06)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
              {card.strip.map(s => (
                <span key={s.k} style={{ color: 'var(--color-text-muted)' }}>{s.k}: <strong style={{ color: '#e2e8f0' }}>{s.v}</strong></span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Map + Corridors ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Map Panel */}
        <div className="panel" style={{ margin: 0, overflow: 'hidden' }}>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="panel-title">🇮🇳 Indian Railways Live Network Atlas</span>
              <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700 }}>LIVE ATLAS</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[{ k: 'openrailway', label: 'IR Live Tracks' }, { k: 'radar', label: 'RailRadar' }].map(b => (
                <button key={b.k} onClick={() => setMapMode(b.k)} className={`btn ${mapMode === b.k ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '11px', padding: '4px 10px' }}>{b.label}</button>
              ))}
              <a href="https://indiarailinfo.com/atlas" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '11px', padding: '4px 10px', textDecoration: 'none' }}>IndiaRailInfo ↗</a>
            </div>
          </div>
          <div style={{ height: '440px', overflow: 'hidden', background: '#0a0a0a' }}>
            <iframe
              key={mapMode}
              src={MAP_MODE_SRC[mapMode]}
              width="100%" height="100%"
              style={{ border: 'none', display: 'block' }}
              allowFullScreen loading="lazy"
              title={`Map: ${mapMode}`}
            />
          </div>
        </div>

        {/* Corridors Panel */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <span className="panel-title">Major National Corridors</span>
            <span className="badge badge-derived">Graph Edges</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CORRIDORS.map((c, i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'rgba(14,20,36,0.8)', border: `1px solid rgba(148,163,184,0.07)`, borderLeft: `3px solid ${c.color}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${c.color}66`}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.07)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: '#e2e8f0' }}>{c.name}</span>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: c.color }}>{c.dist}</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{c.route}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Deck: Fleet Telemetry + Platform Load + Dispatch Log ─── */}
      <div style={{ marginBottom: '4px', paddingBottom: '8px', borderBottom: '1px solid rgba(148,163,184,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="status-indicator live" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NATIONAL RAILWAY DISPATCH & TRACTION SAFETY MATRIX</span>
          <span className="badge badge-real">KAVACH TCAS ACTIVE</span>
          <span className="badge badge-derived">25kV AC TRACTION</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>Signalling: <strong style={{ color: '#10b981' }}>AUTOMATIC BLOCK (100%)</strong></span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr 1fr', gap: '16px', marginTop: '14px' }}>

        {/* Col 1: Live Fleet Telemetry */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header" style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px' }}>🚆</span>
              <span className="panel-title" style={{ fontSize: '12px' }}>Live Express Fleet Telemetry Radar</span>
            </div>
            <span className="badge badge-simulated" style={{ fontSize: '9px' }}>Continuous GPS Radar</span>
          </div>
          <div className="panel-body" style={{ padding: '8px', maxHeight: '240px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.5fr 1fr 0.7fr 1.1fr', gap: '0', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', padding: '4px 8px', borderBottom: '1px solid rgba(148,163,184,0.08)', textTransform: 'uppercase' }}>
              <span>TRAIN / SERVICE</span><span>CURRENT BLOCK</span><span>SPEED</span><span>SIG</span><span>STATUS</span>
            </div>
            {trains.slice(0, 5).map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.5fr 1fr 0.7fr 1.1fr', gap: '0', fontSize: '11px', padding: '6px 8px', borderBottom: '1px solid rgba(148,163,184,0.04)', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8', fontSize: '10px' }}>{t.train_no}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '10px' }}>{t.train_name}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', fontSize: '10px' }}>{t.source}–{t.destination}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#e2e8f0' }}>{t.speed} km/h</span>
                <span>{t.status === 'ON TIME' ? '🟢' : t.status === 'DELAYED' ? '🔴' : '🟡'}</span>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: t.status === 'ON TIME' ? '#10b981' : t.status.includes('MINOR') ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Platform Load */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header" style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px' }}>🚉</span>
              <span className="panel-title" style={{ fontSize: '12px' }}>Zonal Hub Concourse & Platform Load</span>
            </div>
            <span className="badge badge-real" style={{ fontSize: '9px' }}>Real Sensors</span>
          </div>
          <div className="panel-body" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
            {PLATFORM_LOADS.map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11px', color: '#e2e8f0' }}>{p.code}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>{p.pf}</span>
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: loadColor(p.load), fontWeight: 700 }}>{p.load}% {p.status}</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(148,163,184,0.1)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.load}%`, background: loadColor(p.load), borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Autonomous Dispatcher Log */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header" style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px' }}>📡</span>
              <span className="panel-title" style={{ fontSize: '12px' }}>Autonomous Dispatcher Log</span>
            </div>
            <span className="pulse-dot" style={{ background: '#10b981' }} />
          </div>
          <div className="panel-body" style={{ padding: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
            {dispatchLog.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', opacity: 1 - i * 0.1 }}>
                <span style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{d.t}</span>
                <span style={{ color: d.c, lineHeight: 1.4 }}>{d.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Alert Feed ─── */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Real-Time Alert Feed</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {liveAlerts.map(a => (
            <div key={a.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 14px', background: sevBg[a.sev], borderLeft: `3px solid ${sevColor[a.sev]}`, borderRadius: '4px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: sevColor[a.sev], whiteSpace: 'nowrap', marginTop: '1px' }}>{a.sev}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', flex: 1 }}>{a.msg}</span>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
