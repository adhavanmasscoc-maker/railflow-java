export default function DashboardPage() {
  return (
    <section className="page-view active" id="page-dashboard">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 01</span> <span className="slash">//</span> DASHBOARD</div>
          <div className="view-subtitle">
            <span className="pulse-dot"></span>
            REAL-TIME MONITORING &amp; DATA PROCESSING
          </div>
          <h1 className="view-title">Logical Indian Railways Network Graph</h1>
          <p className="view-desc">
            Inter-hub topology connecting Northern, Western, Central, Eastern and Southern railway networks backed by Core Java 21+, JDBC and SQLite.
          </p>
        </div>
        <div>
          <span className="badge badge-real">REAL DATA: SQLITE</span>
          <span className="badge badge-derived">DERIVED GRAPH</span>
          <span className="badge badge-simulated">SIMULATED TELEMETRY</span>
        </div>
      </div>

      {/* ─── Operational Pipeline Timeline Card ─── */}
      <div className="pipeline-card" style={{ marginBottom: '24px', padding: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)' }}>
        <div className="pipeline-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
          <span>Operational Ingestion Pipeline Lifecycle</span>
          <span style={{ color: 'var(--color-status-emerald)' }}>Status: Nominal (100% Throughput)</span>
        </div>
        <div className="pipeline-flow" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['DATA SOURCE', 'INGESTION', 'VALIDATION', 'JDBC', 'SQLITE', 'NETWORK GRAPH', 'ANALYTICS', 'LIVE UI'].map((step, idx) => (
            <div key={idx} className="pipeline-node active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div className="pipeline-dot" style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-cyan-glow)', border: '1px solid var(--color-cyan-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--color-cyan-400)' }}>{idx + 1}</div>
              <span className="pipeline-label" style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="dashboard-grid">
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-title">Stations Registered</span>
            <span className="badge badge-real">SQLite</span>
          </div>
          <div className="metric-val">8,989</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>25 High-Density Zonal Hubs Active</div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-title">Primary Corridors</span>
            <span className="badge badge-derived">Topology</span>
          </div>
          <div className="metric-val">6 Trunks</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Golden Quadrilateral + Diagonals</div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-title">Active Trains</span>
            <span className="badge badge-simulated">Live</span>
          </div>
          <div className="metric-val">5,200+</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Simulated Daily Operations</div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-title">Telemetry Latency</span>
            <span className="badge badge-real">React</span>
          </div>
          <div className="metric-val">0ms</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Local State Hydration</div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <div className="panel" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden' }}>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div>
              <span className="panel-title" style={{ fontWeight: 600, marginRight: '8px' }}>🇮🇳 Indian Railways Live Network Atlas</span>
              <span className="badge">LIVE ATLAS</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" title="OpenRailwayMap live tracks">IR Live Tracks</button>
              <button className="btn btn-secondary" title="Vector Topology Network Graph">Topology SVG</button>
            </div>
          </div>
          <div className="panel-body" style={{ height: '500px', width: '100%' }}>
            <iframe src="https://www.openrailwaymap.org/?style=standard&lat=21.0&lon=78.5&zoom=5" width="100%" height="100%" frameBorder="0" allowFullScreen loading="lazy" title="OpenRailwayMap Indian Railways Live Network" style={{ border: 'none' }}></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
