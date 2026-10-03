import { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';

const STATIONS = [
  { code: 'MS',   name: 'Chennai Egmore', zone: 'SR', pfs: 11, crowd: 48, status: 'NORMAL',   trains: 142 },
  { code: 'MAS',  name: 'Chennai Central', zone: 'SR', pfs: 16, crowd: 68, status: 'MODERATE', trains: 220 },
  { code: 'TPJ',  name: 'Tiruchirappalli', zone: 'SR', pfs: 8,  crowd: 55, status: 'MODERATE', trains: 118 },
  { code: 'MDU',  name: 'Madurai Junction', zone: 'SR', pfs: 6,  crowd: 42, status: 'NORMAL',   trains: 89 },
  { code: 'CBE',  name: 'Coimbatore', zone: 'SR', pfs: 6,  crowd: 61, status: 'MODERATE', trains: 94 },
  { code: 'SBC',  name: 'Bengaluru City', zone: 'SWR', pfs: 10, crowd: 73, status: 'HIGH',     trains: 172 },
  { code: 'NDLS', name: 'New Delhi', zone: 'NR', pfs: 16, crowd: 82, status: 'HIGH',     trains: 310 },
  { code: 'HWH',  name: 'Howrah Junction', zone: 'ER', pfs: 23, crowd: 58, status: 'MODERATE', trains: 280 },
  { code: 'BCT',  name: 'Mumbai CSMT', zone: 'CR', pfs: 18, crowd: 91, status: 'CRITICAL', trains: 290 },
  { code: 'ADI',  name: 'Ahmedabad', zone: 'WR', pfs: 10, crowd: 54, status: 'MODERATE', trains: 148 },
  { code: 'JP',   name: 'Jaipur', zone: 'NWR', pfs: 6,  crowd: 39, status: 'NORMAL',   trains: 76 },
  { code: 'SC',   name: 'Secunderabad', zone: 'SCR', pfs: 10, crowd: 67, status: 'MODERATE', trains: 164 },
  { code: 'CNB',  name: 'Kanpur Central', zone: 'NCR', pfs: 10, crowd: 44, status: 'NORMAL',   trains: 142 },
  { code: 'ALD',  name: 'Prayagraj (Allahabad)', zone: 'NCR', pfs: 10, crowd: 49, status: 'NORMAL',   trains: 126 },
  { code: 'LKO',  name: 'Lucknow Charbagh', zone: 'NR', pfs: 8,  crowd: 57, status: 'MODERATE', trains: 134 },
  { code: 'AGC',  name: 'Agra Cantt', zone: 'NCR', pfs: 4,  crowd: 36, status: 'NORMAL',   trains: 68 },
  { code: 'PNBE', name: 'Patna Junction', zone: 'ECR', pfs: 9,  crowd: 52, status: 'MODERATE', trains: 112 },
  { code: 'GHY',  name: 'Guwahati', zone: 'NFR', pfs: 7,  crowd: 41, status: 'NORMAL',   trains: 74 },
  { code: 'PUNE', name: 'Pune Junction', zone: 'CR', pfs: 6,  crowd: 63, status: 'MODERATE', trains: 98 },
  { code: 'TVC',  name: 'Thiruvananthapuram', zone: 'SR', pfs: 6,  crowd: 48, status: 'NORMAL',   trains: 84 },
  { code: 'ERN',  name: 'Ernakulam Jn', zone: 'SR', pfs: 6,  crowd: 59, status: 'MODERATE', trains: 92 },
  { code: 'BBS',  name: 'Bhubaneswar', zone: 'ECoR', pfs: 6,  crowd: 46, status: 'NORMAL',   trains: 88 },
  { code: 'BZA',  name: 'Vijayawada Jn', zone: 'SCR', pfs: 9,  crowd: 71, status: 'HIGH',     trains: 156 },
  { code: 'GNT',  name: 'Guntur Junction', zone: 'SCR', pfs: 6,  crowd: 38, status: 'NORMAL',   trains: 62 },
  { code: 'ALU',  name: 'Ariyalur', zone: 'SR', pfs: 2,  crowd: 24, status: 'NORMAL',   trains: 28 },
];

const STATUS_COLORS = { NORMAL: '#10b981', MODERATE: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#ef4444' };
const STATUS_BG =     { NORMAL: 'rgba(16,185,129,0.12)', MODERATE: 'rgba(245,158,11,0.12)', HIGH: 'rgba(239,68,68,0.12)', CRITICAL: 'rgba(239,68,68,0.2)' };

const HIER_TREE = [
  { label: 'Ministry of Railways', level: 0, children: 18 },
  { label: 'Zonal Railways (18 Zones)', level: 1, children: 8989 },
  { label: 'Divisional Railway Managers (68 Divs)', level: 2, children: null },
  { label: 'Station Master (SM) — 8,989 Stations', level: 3, children: null },
  { label: 'Platform Tracks — 25 Hubs · 146 Platforms', level: 4, children: null },
];

export default function StationsPage() {
  const [search, setSearch] = useState('');
  const [filterZone, setFilterZone] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('crowd');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const zones = ['ALL', ...new Set(STATIONS.map(s => s.zone))];
  const statuses = ['ALL', 'NORMAL', 'MODERATE', 'HIGH', 'CRITICAL'];

  const filtered = STATIONS
    .filter(s => filterZone === 'ALL' || s.zone === filterZone)
    .filter(s => filterStatus === 'ALL' || s.status === filterStatus)
    .filter(s => !search || s.code.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'crowd') return b.crowd - a.crowd;
      if (sortBy === 'trains') return b.trains - a.trains;
      return a.name.localeCompare(b.name);
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className="page-view active" id="page-stations">
      <PageHeader
        systemCode="SYSTEM 05 // STATION DIRECTORY"
        title="Indian Railways Station Network Overview"
        subtitle="Station Hierarchy & Directory — 8,989 Registered Stations"
        description="Structured hierarchy from Indian Railways apex to Zonal Hubs, Stations, and individual Platform tracks with live capacity and crowd telemetry."
        extra={<span className="badge badge-real">SQLITE REGISTRY</span>}
      />

      {/* ─── Hierarchy Tree ─── */}
      <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Railway Operational Hierarchy</div>
        {HIER_TREE.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', paddingLeft: `${h.level * 20}px` }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: h.level === 0 ? '#e2e8f0' : h.level <= 2 ? '#94a3b8' : 'var(--color-text-muted)' }}>{h.label}</span>
            {h.children && <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>{h.children.toLocaleString()}</span>}
          </div>
        ))}
      </div>

      {/* ─── KPI Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Stations', val: '8,989', color: '#38bdf8' },
          { label: 'Zonal Hubs (25)', val: '25', color: '#10b981' },
          { label: 'Active Platforms', val: '146', color: '#f59e0b' },
          { label: 'Monitored (Live)', val: STATIONS.length.toString(), color: '#8b5cf6' },
        ].map(k => (
          <div key={k.label} style={{ padding: '14px', background: 'rgba(14,20,36,0.9)', border: `1px solid ${k.color}22`, borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '26px', color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* ─── Controls ─── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search station code or name…"
          style={{ flex: 1, minWidth: '200px', padding: '8px 12px', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 'var(--radius-md)', color: '#e2e8f0', fontSize: '12px', outline: 'none' }} />
        <select value={filterZone} onChange={e => { setFilterZone(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 'var(--radius-md)', color: '#e2e8f0', fontSize: '12px' }}>
          {zones.map(z => <option key={z} value={z}>{z === 'ALL' ? 'All Zones' : z}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 'var(--radius-md)', color: '#e2e8f0', fontSize: '12px' }}>
          {statuses.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: '8px 12px', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 'var(--radius-md)', color: '#e2e8f0', fontSize: '12px' }}>
          <option value="crowd">Sort: Crowd Load</option>
          <option value="trains">Sort: Train Count</option>
          <option value="name">Sort: Name</option>
        </select>
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{filtered.length} stations</span>
      </div>

      {/* ─── Station Table ─── */}
      <div style={{ background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'rgba(14,20,36,0.9)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                {['CODE', 'STATION NAME', 'ZONE', 'PLATFORMS', 'CROWD LOAD', 'ACTIVE TRAINS', 'STATUS', 'ACTIONS'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((s, i) => (
                <tr key={s.code} style={{ borderBottom: '1px solid rgba(148,163,184,0.04)', background: selected === s.code ? 'rgba(56,189,248,0.05)' : 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}
                  onClick={() => setSelected(selected === s.code ? null : s.code)}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#38bdf8', fontSize: '12px' }}>{s.code}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#e2e8f0' }}>{s.name}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#94a3b8' }}>{s.zone}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#e2e8f0', textAlign: 'center' }}>{s.pfs}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'rgba(148,163,184,0.1)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                        <div style={{ height: '100%', width: `${s.crowd}%`, background: STATUS_COLORS[s.status], borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: STATUS_COLORS[s.status], fontWeight: 700 }}>{s.crowd}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#e2e8f0', textAlign: 'center' }}>{s.trains}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: STATUS_BG[s.status], color: STATUS_COLORS[s.status], fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '3px 8px', borderRadius: '3px', whiteSpace: 'nowrap' }}>{s.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button className="btn btn-secondary" style={{ fontSize: '10px', padding: '3px 10px' }}>Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Pagination ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>
          Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ fontSize: '11px', padding: '5px 12px' }}>← Prev</button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const p = i + 1;
            return <button key={p} onClick={() => setPage(p)} className={`btn ${page === p ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '11px', padding: '5px 10px' }}>{p}</button>;
          })}
          <button className="btn btn-secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ fontSize: '11px', padding: '5px 12px' }}>Next →</button>
        </div>
      </div>
    </section>
  );
}
