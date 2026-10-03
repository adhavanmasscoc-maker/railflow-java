import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';

const INITIAL_ALERTS = [
  { id: 1, type: 'CRITICAL', time: '14:23:45', title: 'Signal Failure at Platform 3 (MAS)', detail: 'Coromandel Express (12842) delayed 15m. Maintenance crew dispatched. ETA restore: 14:40 IST.', source: 'Signal Controller NX-3', acked: false },
  { id: 2, type: 'WARNING',  time: '14:18:22', title: 'High crowd density FOB-2 (NDLS)', detail: 'Occupancy 87% (threshold: 75%). Crowd dispersal advisory issued. Opening alternate FOB-4.', source: 'CrowdSim Engine v2', acked: false },
  { id: 3, type: 'CRITICAL', time: '14:15:00', title: 'Track maintenance block: BPL-ET section', detail: 'Non-interlocked work ongoing. Speed restriction 30 km/h for 8 km stretch. Block until 18:00 IST.', source: 'Engineering Dept WCR', acked: false },
  { id: 4, type: 'WARNING',  time: '14:10:33', title: 'Platform scheduling overlap at BZA', detail: 'Train 12622 (Tamil Nadu Exp ETA 07:15) conflicts with 12634 (Vaigai Exp ETD 07:10) on PF-3.', source: 'PlatformOptimizer', acked: false },
  { id: 5, type: 'INFO',     time: '14:05:12', title: 'Vande Bharat 20951 departed on time', detail: 'NDLS → Varanasi (BSB). Platform 1 cleared. Next: 12302 Rajdhani @ 16:55.', source: 'Dispatch Console', acked: false },
  { id: 6, type: 'INFO',     time: '14:00:00', title: 'Data sync successful', detail: '13,849 records verified across stations, trains, and edges. SQLite WAL checkpoint completed.', source: 'DataIngestionEngine', acked: false },
  { id: 7, type: 'INFO',     time: '13:58:00', title: 'AI Copilot session completed', detail: '12 natural language dispatch queries processed. Avg response time: 340ms.', source: 'AKNEX AI Engine', acked: false },
  { id: 8, type: 'WARNING',  time: '13:45:00', title: 'Diesel loco WDM-3D fleet health alert', detail: '3 units at Ernakulam shed reporting low coolant. Preventive maintenance scheduled tonight.', source: 'FleetHealth Monitor', acked: false },
  { id: 9, type: 'CRITICAL', time: '13:30:00', title: 'FOB staircase chokepoint: 2.5 pax/m²', detail: 'STAMPEDE HAZARD ALERT: FOB-2 Staircase at MS exceeded 2.5 persons/m². Concourse gates HOLD.', source: 'CrowdSim Engine v2', acked: false },
  { id: 10, type: 'INFO',    time: '13:20:00', title: 'Kavach TCAS system heartbeat nominal', detail: 'All 16 Kavach units reporting green. Collision avoidance online. Braking curves computed.', source: 'Kavach TCAS Controller', acked: false },
];

const LIVE_MSGS = [
  { title: 'Telemetry heartbeat nominal', detail: 'All 16 systems reporting green. Latency < 2ms.', type: 'INFO' },
  { title: 'Train position update received', detail: 'Batch update for 247 active services in NR zone.', type: 'INFO' },
  { title: 'Coach allocation confirmed', detail: 'LHB rake allocated for Train 12616 GrandTrunk Express.', type: 'INFO' },
  { title: 'Crowd threshold advisory: SC Platform 2', detail: 'Load: 72% approaching high threshold.', type: 'WARNING' },
];

const typeColors = { CRITICAL: '#ef4444', WARNING: '#f59e0b', INFO: '#10b981' };
const typeBg    = { CRITICAL: 'rgba(239,68,68,0.08)', WARNING: 'rgba(245,158,11,0.08)', INFO: 'rgba(16,185,129,0.06)' };

const SEVERITY_ORDER = { CRITICAL: 0, WARNING: 1, INFO: 2 };

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showAcked, setShowAcked] = useState(true);
  const [sortBy, setSortBy] = useState('severity');

  useEffect(() => {
    const iv = setInterval(() => {
      const msg = LIVE_MSGS[Math.floor(Math.random() * LIVE_MSGS.length)];
      setAlerts(prev => [{
        id: Date.now(),
        type: msg.type,
        time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        title: msg.title,
        detail: msg.detail,
        source: 'TelemetryCache',
        acked: false,
      }, ...prev].slice(0, 30));
    }, 20000);
    return () => clearInterval(iv);
  }, []);

  const acknowledge = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, acked: true } : a));
  const dismiss = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
  const ackAll = () => setAlerts(prev => prev.map(a => ({ ...a, acked: true })));
  const clearAll = () => setAlerts([]);

  const filtered = alerts
    .filter(a => (filter === 'ALL' || a.type === filter))
    .filter(a => showAcked || !a.acked)
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.detail.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'severity' ? SEVERITY_ORDER[a.type] - SEVERITY_ORDER[b.type] : 0);

  const counts = { CRITICAL: alerts.filter(a => a.type === 'CRITICAL').length, WARNING: alerts.filter(a => a.type === 'WARNING').length, INFO: alerts.filter(a => a.type === 'INFO').length };

  return (
    <section className="page-view active" id="page-alerts">
      <PageHeader
        systemCode="SYSTEM 15 // SYSTEM ALERTS"
        title="Real-Time Event Stream & Alert Center"
        subtitle="Live Operational Alerts — Signal & Platform Events"
        description="Comprehensive alert center with severity categorization, acknowledgment tracking, and real-time event stream from all 16 monitored subsystems."
        extra={
          <>
            <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
              {counts.CRITICAL} CRITICAL
            </span>
            <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
              {counts.WARNING} WARNING
            </span>
          </>
        }
      />

      {/* ─── Severity Summary KPIs ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Critical', count: counts.CRITICAL, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: '🚨' },
          { label: 'Warning',  count: counts.WARNING, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '⚠️' },
          { label: 'Info',     count: counts.INFO,   color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: 'ℹ️' },
          { label: 'Total',    count: alerts.length, color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', icon: '📊' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 16px', background: s.bg, border: `1px solid ${s.color}22`, borderRadius: 'var(--radius-lg)', borderLeft: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: '16px' }}>{s.icon}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '28px', color: s.color, lineHeight: 1.1, marginTop: '4px' }}>{s.count}</div>
          </div>
        ))}
      </div>

      {/* ─── Toolbar ─── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(14,20,36,0.8)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(148,163,184,0.08)' }}>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-mono)', background: filter === f ? typeColors[f] || '#38bdf8' : 'transparent', color: filter === f ? '#000' : 'var(--color-text-secondary)' }}>
              {f} {f !== 'ALL' && `(${counts[f] || 0})`}
            </button>
          ))}
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search alerts…" 
          style={{ flex: 1, minWidth: '180px', padding: '7px 12px', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 'var(--radius-md)', color: '#e2e8f0', fontSize: '12px', outline: 'none' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={showAcked} onChange={e => setShowAcked(e.target.checked)} />
          Show Acknowledged
        </label>
        <div style={{ flex: 1 }} />
        <button className="btn btn-secondary" onClick={ackAll} style={{ fontSize: '11px' }}>✓ Ack All</button>
        <button className="btn btn-secondary" onClick={clearAll} style={{ fontSize: '11px' }}>🗑 Clear All</button>
      </div>

      {/* ─── Alert Stream ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filtered.map(a => (
          <div key={a.id} style={{
            padding: '14px 18px', background: typeBg[a.type],
            borderLeft: `4px solid ${typeColors[a.type]}`, borderRadius: '4px',
            opacity: a.acked ? 0.55 : 1, transition: 'opacity 0.3s',
            border: `1px solid ${typeColors[a.type]}18`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: `${typeColors[a.type]}22`, color: typeColors[a.type], fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 7px', borderRadius: '3px', whiteSpace: 'nowrap' }}>{a.type}</span>
                <strong style={{ fontSize: '13px', color: '#e2e8f0' }}>{a.title}</strong>
                {a.acked && <span style={{ fontSize: '10px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>✓ ACK</span>}
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{a.time}</span>
                {!a.acked && (
                  <button onClick={() => acknowledge(a.id)} className="btn btn-secondary" style={{ fontSize: '10px', padding: '3px 8px' }}>ACK</button>
                )}
                <button onClick={() => dismiss(a.id)} className="btn btn-secondary" style={{ fontSize: '10px', padding: '3px 8px' }}>✕</button>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{a.detail}</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>SOURCE: {a.source}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)', background: 'rgba(14,20,36,0.5)', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(148,163,184,0.1)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>No alerts matching current filter</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>System operating nominally</div>
          </div>
        )}
      </div>
    </section>
  );
}
