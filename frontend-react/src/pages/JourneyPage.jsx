import { useState } from 'react';
import { getDirectCorridorRoute, VERIFIED_TRAINS } from '../data/masterRailwayData';

export default function JourneyPage() {
  const [fromStation, setFromStation] = useState('NDLS');
  const [toStation, setToStation] = useState('MAS');
  const [routeResult, setRouteResult] = useState(null);

  const planRoute = () => {
    // Basic mock of the planner logic for the UI shell.
    // Real implementation would use the masterRailwayData
    const res = getDirectCorridorRoute(fromStation, toStation);
    setRouteResult(res);
  };

  const swapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const setQuickRoute = (from, to) => {
    setFromStation(from);
    setToStation(to);
    // Timeout to let state settle before planning
    setTimeout(() => {
      const res = getDirectCorridorRoute(from, to);
      setRouteResult(res);
    }, 0);
  };

  return (
    <section className="page-view active" id="page-journey">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 04</span> <span className="slash">//</span> JOURNEY ROUTER</div>
          <div className="view-subtitle">CORRIDOR GRAPH ROUTER</div>
          <h1 className="view-title">Railway Journey Planner</h1>
          <p className="view-desc">
            Direct schedule &amp; express frequency between real Indian railway station codes loaded from master dataset.
          </p>
        </div>
        <span className="badge badge-real">JDBC ROUTING ENGINE</span>
      </div>

      <div className="planner-form" style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>From Station / City / Code</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. TPJ, MAS..." 
            value={fromStation}
            onChange={e => setFromStation(e.target.value)}
            style={{ padding: '12px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '16px' }}
          />
        </div>

        <button onClick={swapStations} style={{ padding: '12px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border-subtle)', borderRadius: '50%', cursor: 'pointer', height: '44px', width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Swap Stations">
          🔄
        </button>

        <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>To Station / City / Code</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. ALU, MAS..." 
            value={toStation}
            onChange={e => setToStation(e.target.value)}
            style={{ padding: '12px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '16px' }}
          />
        </div>

        <button className="btn btn-primary" onClick={planRoute} style={{ height: '44px', padding: '0 24px', fontSize: '16px', fontWeight: 600 }}>
          🗺️ Plan Corridor Route
        </button>
      </div>

      <div className="corridor-preset-bar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-cyan-400)', marginRight: '8px', display: 'flex', alignItems: 'center' }}>⚡ QUICK CORRIDORS:</span>
        <button className="btn btn-secondary" onClick={() => setQuickRoute('TPJ', 'ALU')}>🌴 TPJ ➔ ALU</button>
        <button className="btn btn-secondary" onClick={() => setQuickRoute('TPJ', 'MS')}>🚂 TPJ ➔ MS</button>
        <button className="btn btn-secondary" onClick={() => setQuickRoute('ALU', 'MS')}>🏛️ ALU ➔ MS</button>
        <button className="btn btn-secondary" onClick={() => setQuickRoute('NDLS', 'MAS')}>⚡ NDLS ➔ MAS</button>
        <button className="btn btn-secondary" onClick={() => setQuickRoute('BCT', 'NDLS')}>🚄 BCT ➔ NDLS</button>
        <button className="btn btn-secondary" onClick={() => setQuickRoute('MAS', 'HWH')}>🌊 MAS ➔ HWH</button>
      </div>

      {routeResult && (
        <div className="journey-result-card" style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
          {routeResult.success ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-derived">{routeResult.corridorName}</span>
                  <h2 style={{ fontSize: '24px', margin: '12px 0 8px', color: 'var(--color-text-primary)' }}>
                    {routeResult.origin?.name} ({routeResult.origin?.code}) &rarr; {routeResult.destination?.name} ({routeResult.destination?.code})
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {routeResult.distanceKm} km • {routeResult.estimatedTime} estimated
                  </p>
                </div>
                <span className="badge badge-real">{routeResult.directTrains?.length || 0} Direct Trains</span>
              </div>
              
              <div style={{ margin: '24px 0' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>Path Iteration</h3>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {routeResult.path?.map((stn, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ padding: '4px 8px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: '4px', fontSize: '12px' }}>{stn.code}</span>
                      {idx < routeResult.path.length - 1 && <span style={{ margin: '0 8px', color: 'var(--color-text-muted)' }}>&rarr;</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>Direct Express Trains</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
                        <th style={{ padding: '12px 8px' }}>Train #</th>
                        <th style={{ padding: '12px 8px' }}>Name</th>
                        <th style={{ padding: '12px 8px' }}>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routeResult.directTrains?.map(t => (
                        <tr key={t.number} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-400)' }}>{t.number}</td>
                          <td style={{ padding: '12px 8px' }}>{t.name}</td>
                          <td style={{ padding: '12px 8px' }}><span className="badge">{t.type}</span></td>
                        </tr>
                      ))}
                      {(!routeResult.directTrains || routeResult.directTrains.length === 0) && (
                        <tr>
                          <td colSpan="3" style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No direct verified trains found in authoritative dataset.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: '#ef4444' }}>
              <h3>Routing Failed</h3>
              <p>{routeResult.message || routeResult.error}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
