import { useState } from 'react';

export default function NetworkPage() {
  const [activeSubView, setActiveSubView] = useState('radar');
  const [activeStation, setActiveStation] = useState('MS');

  return (
    <section className="page-view active" id="page-network">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 03</span> <span className="slash">//</span> RAILRADAR &amp; TOPOLOGY OPS</div>
          <div className="view-subtitle">
            <span className="pulse-dot"></span>
            SATELLITE TELEMETRY &amp; INTER-HUB NETWORK
          </div>
          <h1 className="view-title">Live Satellite RailRadar &amp; Network Topology</h1>
          <p className="view-desc">
            Multi-source geo-referenced satellite radar, logical Indian Railways topology graph, and autonomous platform dispatch sandbox.
          </p>
        </div>
        <div>
          <span className="badge badge-real">LIVE GPS RADAR</span>
          <span className="badge badge-derived" style={{ margin: '0 8px' }}>NETWORK TOPOLOGY</span>
          <span className="badge">DISPATCH SANDBOX</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          <button className={`btn ${activeSubView === 'radar' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSubView('radar')}>
            <span>🛰️ Live Satellite RailRadar</span>
          </button>
          <button className={`btn ${activeSubView === 'topology' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSubView('topology')}>
            <span>🌐 Inter-Hub Topology Graph</span>
          </button>
          <button className={`btn ${activeSubView === 'dispatch' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveSubView('dispatch')}>
            <span>🎮 Dynamic Dispatch Sandbox</span>
          </button>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot"></span>
          <span>Station: {activeStation} • All Systems Live</span>
        </div>
      </div>

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

      {activeSubView === 'topology' && (
        <div className="panel" style={{ height: 'calc(100vh - 250px)' }}>
          <div className="panel-header">
            <div>
              <span className="panel-title">Logical Topology Graph (SVG)</span>
            </div>
            <span className="badge badge-derived">O(1) Memory Hydration</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
            <p>Topology graph porting in progress...</p>
          </div>
        </div>
      )}

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
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn btn-danger"><span>⚠️ Simulate 25m Delay (PF 2 Conflict)</span></button>
              <button className="btn btn-secondary"><span>👥 Simulate Rush Hour Surge</span></button>
              <button className="btn" style={{ background: 'var(--color-indigo-600)', color: '#fff', border: 'none' }}><span>🧠 Execute PriorityQueue Reallocation</span></button>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, padding: '16px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', background: 'rgba(14,20,36,0.5)' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Overall Concourse Load</div>
                <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>48.2% <span style={{ fontSize: '12px', color: 'var(--color-status-emerald)' }}>NORMAL</span></div>
              </div>
              <div style={{ flex: 1, padding: '16px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', background: 'rgba(14,20,36,0.5)' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>FOB Staircase Chokepoint</div>
                <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>0.9 pax/m² <span style={{ fontSize: '12px', color: 'var(--color-status-emerald)' }}>SAFE</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
