import { useState } from 'react';
import { WESTERN_TRUNK_STATIONS, CHORD_LINE_STATIONS, SOUTHERN_TRUNK_STATIONS } from '../data/masterRailwayData';
import PageHeader from '../components/PageHeader';

export default function StationsPage() {
  const [filter, setFilter] = useState('');

  const allStations = [
    ...CHORD_LINE_STATIONS.map(s => ({ ...s, corridor: 'Chord Line' })),
    ...WESTERN_TRUNK_STATIONS.map(s => ({ ...s, corridor: 'Western Trunk' })),
    ...SOUTHERN_TRUNK_STATIONS.map(s => ({ ...s, corridor: 'Southern Trunk' }))
  ];

  // Simple deduplication based on code
  const uniqueStationsMap = new Map();
  allStations.forEach(s => uniqueStationsMap.set(s.code, s));
  const uniqueStations = Array.from(uniqueStationsMap.values());

  const filteredStations = uniqueStations.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) || 
    s.code.toLowerCase().includes(filter.toLowerCase()) ||
    s.division.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="page-view active" id="page-stations">
      <PageHeader
        systemCode="SYSTEM 05 // STATION DIRECTORY"
        title="Station Hierarchy & Network Registry"
        subtitle="Indian Railways Station Network Overview"
        description="Structured operational hierarchy spanning IR apex, Zonal Hubs, Divisional Nodes, and individual Platform tracks with live capacity metrics."
        badge="SQLITE REGISTRY"
        badgeColor="emerald"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Interactive Tree Mock */}
        <div className="tree-container" style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--color-text-primary)' }}>
              Railway Operational Hierarchy
            </h3>
            <span className="badge badge-real">LIVE ZONES</span>
          </div>
          <input 
            type="text" 
            placeholder="Search zone, hub, or station code..."
            style={{ width: '100%', padding: '8px 12px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '14px', marginBottom: '16px' }}
          />
          <div style={{ paddingLeft: '8px', borderLeft: '1px solid var(--color-border-subtle)' }}>
            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><span>▼</span> 🇮🇳 Indian Railways (IR)</div>
              <div style={{ paddingLeft: '24px', paddingTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}><span>▼</span> Southern Railway (SR)</div>
                <div style={{ paddingLeft: '24px' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '4px 0' }}>Chennai Division (MAS)</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '4px 0' }}>Tiruchirappalli Division (TPJ)</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '4px 0' }}>Madurai Division (MDU)</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '4px 0' }}>Salem Division (SA)</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '4px 0' }}>Thiruvananthapuram Div (TVC)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stations Data Table */}
        <div className="panel" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden' }}>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span className="panel-title" style={{ fontWeight: 600 }}>Station Master Directory</span>
            <input 
              type="text" 
              placeholder="Filter by name, code, zone..." 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ padding: '4px 8px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '12px', width: '200px' }}
            />
          </div>
          <div className="table-wrapper" style={{ overflowX: 'auto', maxHeight: '600px' }}>
            <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--color-surface)' }}>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
                  <th style={{ padding: '12px 16px' }}>Code</th>
                  <th style={{ padding: '12px 16px' }}>Station Name</th>
                  <th style={{ padding: '12px 16px' }}>Division</th>
                  <th style={{ padding: '12px 16px' }}>Platforms</th>
                  <th style={{ padding: '12px 16px' }}>Corridor</th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.map(s => (
                  <tr key={s.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-400)' }}>{s.code}</td>
                    <td style={{ padding: '12px 16px' }}>{s.name}</td>
                    <td style={{ padding: '12px 16px' }}><span className="badge badge-derived">{s.division}</span></td>
                    <td style={{ padding: '12px 16px' }}>{s.platforms}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{s.corridor}</td>
                  </tr>
                ))}
                {filteredStations.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No stations match the filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
