import { useState, useEffect } from 'react';

const INITIAL_ALERTS = [
  { id: 1, type: 'CRITICAL', time: '14:23:45', title: 'Signal Failure at Platform 3 (MAS)', detail: 'Expect 15m delay for Coromandel Express (12842). Maintenance crew dispatched. ETA restore: 14:40 IST.', source: 'Signal Controller NX-3' },
  { id: 2, type: 'WARNING', time: '14:18:22', title: 'High crowd density at FOB 2 (NDLS)', detail: 'Occupancy 87% (threshold: 75%). Crowd dispersal advisory issued. Opening alternate FOB 4.', source: 'CrowdSim Engine v2' },
  { id: 3, type: 'INFO', time: '14:15:00', title: 'Data synchronization successful', detail: '13,849 records verified across stations, trains, and edges. SQLite WAL checkpoint completed.', source: 'DataIngestionEngine' },
  { id: 4, type: 'WARNING', time: '14:10:33', title: 'Platform scheduling overlap at BZA', detail: 'Train 12622 (Tamil Nadu Express ETA 07:15) conflicts with Train 12634 (Vaigai Express ETD 07:10) on Platform 3.', source: 'PlatformOptimizer' },
  { id: 5, type: 'INFO', time: '14:05:12', title: 'Vande Bharat 20951 departed on time', detail: 'NDLS → Varanasi (BSB). Platform 1 cleared. Next scheduled: 12302 Rajdhani at 16:55.', source: 'Dispatch Console' },
  { id: 6, type: 'CRITICAL', time: '13:58:00', title: 'Track maintenance block: BPL-ET section', detail: 'Non-interlocked work ongoing. Speed restriction 30 km/h for 8 km stretch. Block until 18:00 IST.', source: 'Engineering Dept WCR' },
  { id: 7, type: 'INFO', time: '13:45:00', title: 'AI Copilot session completed', detail: 'Processed 12 natural language dispatch queries in current session. Average response time: 340ms.', source: 'AKNEX AI Engine' },
  { id: 8, type: 'WARNING', time: '13:30:15', title: 'Diesel loco WDM-3D fleet health alert', detail: '3 units at Ernakulam shed reporting low coolant. Preventive maintenance scheduled for tonight.', source: 'FleetHealth Monitor' },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState('ALL');

  // Simulate new alerts arriving
  useEffect(() => {
    const timer = setInterval(() => {
      const types = ['INFO', 'WARNING'];
      const messages = [
        { title: 'Telemetry heartbeat nominal', detail: 'All 16 systems reporting green. Latency < 2ms.' },
        { title: 'Train position update received', detail: 'Batch update for 247 active services in NR zone.' },
        { title: 'Coach allocation confirmed', detail: 'LHB rake allocated for Train 12616 GrandTrunk Express.' },
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const newAlert = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        title: msg.title,
        detail: msg.detail,
        source: 'TelemetryCache',
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 20));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.type === filter);
  const typeColors = { CRITICAL: '#ef4444', WARNING: '#f59e0b', INFO: '#10b981' };
  const typeBg = { CRITICAL: 'rgba(239,68,68,0.1)', WARNING: 'rgba(245,158,11,0.1)', INFO: 'rgba(16,185,129,0.1)' };

  return (
    <section className="page-view active" id="page-alerts">
      <div className="view-header" style={{ marginBottom: '24px' }}>
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 15</span> <span className="slash">//</span> SYSTEM ALERTS</div>
          <h1 className="view-title">Real-Time Event Stream</h1>
          <p className="view-desc">Live operational alerts, signal notifications, platform conflicts, and system health events.</p>
        </div>
        <span className="badge nb-red">REAL-TIME</span>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-ai-toggle' : ''}`}
            style={{ fontSize: '11px', padding: '6px 14px' }}>
            {f} {f !== 'ALL' && `(${alerts.filter(a => a.type === f).length})`}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn" onClick={() => setAlerts([])} style={{ fontSize: '11px' }}>Clear All</button>
      </div>

      {/* Alert Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(a => (
          <div key={a.id} style={{
            padding: '14px 18px', background: typeBg[a.type],
            borderLeft: `4px solid ${typeColors[a.type]}`, borderRadius: '4px',
            transition: 'opacity 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ color: typeColors[a.type], fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{a.type}</strong>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{a.title}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{a.time}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{a.detail}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Source: {a.source}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No alerts matching filter.</div>
        )}
      </div>
    </section>
  );
}
