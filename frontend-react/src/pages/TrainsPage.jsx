import { useState } from 'react';
import { VERIFIED_TRAINS } from '../data/masterRailwayData';

export default function TrainsPage() {
  const [filter, setFilter] = useState('');

  const filteredTrains = VERIFIED_TRAINS.filter(t => 
    t.name.toLowerCase().includes(filter.toLowerCase()) || 
    t.number.includes(filter) ||
    t.origin.toLowerCase().includes(filter.toLowerCase()) ||
    t.destination.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="page-view active" id="page-trains">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 06</span> <span className="slash">//</span> TRAIN EXPLORER</div>
          <div className="view-subtitle">EXPRESS TIMETABLE REGISTRY</div>
          <h1 className="view-title">Indian Railways Train Explorer</h1>
          <p className="view-desc">
            Search express trains by number, name, source, or destination, and view complete sequence stop timetable schedules.
          </p>
        </div>
        <span className="badge badge-real">REAL DATA</span>
      </div>

      <div className="planner-form" style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Search Train by Name, Number, or Station</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. 12638, Pandian, MDU..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: '12px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '16px' }}
          />
        </div>
        <button className="btn btn-primary" style={{ height: '44px', padding: '0 24px', fontSize: '14px', fontWeight: 600 }}>
          Search Trains
        </button>
      </div>

      <div className="table-wrapper" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: 'rgba(14,20,36,0.5)' }}>
            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: '16px' }}>Train #</th>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>Type</th>
              <th style={{ padding: '16px' }}>Source</th>
              <th style={{ padding: '16px' }}>Destination</th>
              <th style={{ padding: '16px' }}>Frequency</th>
              <th style={{ padding: '16px' }}>Expected Platform</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrains.map(t => (
              <tr key={t.number} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-400)' }}>{t.number}</td>
                <td style={{ padding: '16px' }}>{t.name}</td>
                <td style={{ padding: '16px' }}><span className="badge">{t.type}</span></td>
                <td style={{ padding: '16px' }}>{t.origin}</td>
                <td style={{ padding: '16px' }}>{t.destination}</td>
                <td style={{ padding: '16px' }}>{t.days}</td>
                <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>PF {t.stairRef?.idx || 1}</td>
              </tr>
            ))}
            {filteredTrains.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No trains found matching the search criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
