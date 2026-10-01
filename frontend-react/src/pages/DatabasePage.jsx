import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const TABLES = [
  { name: 'stations', rows: 8989, cols: 'code, name, city, zone, lat, lon, division, platforms', icon: '🚉' },
  { name: 'trains', rows: 5208, cols: 'number, name, type, origin, destination, days', icon: '🚆' },
  { name: 'train_stops', rows: 416637, cols: 'train_number, station_code, seq, arrival, departure, distance_km, halt_min', icon: '📍' },
  { name: 'rail_edges', rows: 411426, cols: 'from_station, to_station, distance_km, train_count', icon: '🔗' },
  { name: 'station_aliases', rows: 9341, cols: 'alias, station_code', icon: '🏷️' },
  { name: 'train_running_days', rows: 5208, cols: 'train_number, mon, tue, wed, thu, fri, sat, sun', icon: '📅' },
  { name: 'special_trains', rows: 228, cols: 'number, name, type, route, source_pdf', icon: '⭐' },
  { name: 'data_sources', rows: 5221, cols: 'filename, type, status, records, import_run_id', icon: '📂' },
  { name: 'import_runs', rows: 1, cols: 'run_id, start_time, end_time, duration_ms, status', icon: '⚙️' },
];

const SAMPLE_QUERIES = [
  { label: 'Count stations by zone', sql: "SELECT zone, COUNT(*) AS cnt FROM stations GROUP BY zone ORDER BY cnt DESC LIMIT 10;" },
  { label: 'Find trains from Chennai', sql: "SELECT number, name, type FROM trains WHERE origin = 'MAS' LIMIT 10;" },
  { label: 'Busiest stations by stops', sql: "SELECT station_code, COUNT(*) AS stops FROM train_stops GROUP BY station_code ORDER BY stops DESC LIMIT 10;" },
  { label: 'Longest routes', sql: "SELECT train_number, MAX(distance_km) AS dist FROM train_stops GROUP BY train_number ORDER BY dist DESC LIMIT 5;" },
];

export default function DatabasePage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const runQuery = (sql) => {
    setQuery(sql);
    // Mock result — in production this would hit /api/database/query
    setResult({
      columns: ['zone', 'cnt'],
      rows: [
        ['NR', '764'], ['SR', '682'], ['WR', '598'], ['CR', '625'], ['ER', '512'],
        ['SCR', '538'], ['ECR', '456'], ['SER', '415'], ['SWR', '324'], ['NCR', '298'],
      ],
      duration: '12ms',
      note: 'Mock result — connect backend for live queries',
    });
  };

  return (
    <section className="page-view active" id="page-database">
      <PageHeader
        systemCode="SYSTEM 12 // DATABASE EXPLORER"
        title="SQLite WAL Database Inspector"
        subtitle="JDBC PreparedStatements — railway.db Schema Browser"
        description="Direct schema browser, table statistics, and query interface for the railway.db (JDBC + PreparedStatements)."
        badge="JDBC SQLite"
        badgeColor="emerald"
      />

      {/* Schema Overview */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Schema Overview — {TABLES.length} Tables</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px', marginBottom: '24px' }}>
        {TABLES.map(t => (
          <div key={t.name} style={{
            padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '12px',
          }}>
            <span style={{ fontSize: '20px' }}>{t.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{t.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>{t.rows.toLocaleString()} rows</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{t.cols}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Query Interface */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>SQL Query Console</div>
      <div style={{ padding: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {SAMPLE_QUERIES.map((q, i) => (
            <button key={i} onClick={() => runQuery(q.sql)} className="btn" style={{ fontSize: '11px', padding: '4px 10px' }}>{q.label}</button>
          ))}
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter SQL query..."
          style={{
            width: '100%', height: '80px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
            fontSize: '12px', padding: '12px', resize: 'vertical', outline: 'none',
          }}
        />
        <button className="btn btn-ai-toggle" onClick={() => runQuery(query)} style={{ marginTop: '8px', padding: '8px 20px' }}>Execute</button>
      </div>

      {/* Results */}
      {result && (
        <div className="table-container">
          <div style={{ padding: '8px 16px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
            {result.rows.length} rows · {result.duration} {result.note && `· ${result.note}`}
          </div>
          <table>
            <thead><tr>{result.columns.map(c => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={{ fontFamily: 'var(--font-mono)' }}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
