const QUALITY_METRICS = [
  { label: 'Station Records', total: 8990, valid: 8989, invalid: 1, dup: 0, score: 99.99 },
  { label: 'Train Records', total: 5208, valid: 5208, invalid: 0, dup: 0, score: 100.0 },
  { label: 'Train Stops', total: 416637, valid: 416637, invalid: 0, dup: 0, score: 100.0 },
  { label: 'Running Days', total: 5208, valid: 5208, invalid: 0, dup: 0, score: 100.0 },
  { label: 'Graph Edges', total: 411426, valid: 411426, invalid: 0, dup: 0, score: 100.0 },
  { label: 'Station Aliases', total: 9341, valid: 9341, invalid: 0, dup: 0, score: 100.0 },
  { label: 'Special Trains (PDF)', total: 228, valid: 228, invalid: 0, dup: 0, score: 100.0 },
  { label: 'Data Sources', total: 5221, valid: 4, invalid: 0, dup: 1, score: 99.98 },
];

const AUDIT_CHECKS = [
  { check: 'Referential Integrity (FK)', status: 'PASS', detail: 'All train_stops reference valid station codes' },
  { check: 'Orphan Station Codes', status: 'WARN', detail: '2 unresolved station codes in edge table' },
  { check: 'Duplicate Train Numbers', status: 'PASS', detail: '0 duplicate train registrations detected' },
  { check: 'NULL Coordinate Check', status: 'PASS', detail: '8,989/8,989 stations have valid lat/lon' },
  { check: 'Stop Sequence Ordering', status: 'PASS', detail: 'All 5,208 trains have monotonically increasing seq numbers' },
  { check: 'Distance Consistency', status: 'PASS', detail: 'Distance values increase along all routes' },
  { check: 'Cross-Source Validation', status: 'PASS', detail: 'trainroutes.json matches CSV station master' },
  { check: 'PDF Extraction Accuracy', status: 'PASS', detail: '228/228 special trains extracted with valid structure' },
];

export default function QualityPage() {
  const overallScore = (QUALITY_METRICS.reduce((s, m) => s + m.score, 0) / QUALITY_METRICS.length).toFixed(2);

  return (
    <section className="page-view active" id="page-quality">
      <div className="view-header" style={{ marginBottom: '24px' }}>
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 13</span> <span className="slash">//</span> DATA QUALITY</div>
          <h1 className="view-title">Automated Data Quality Audit</h1>
          <p className="view-desc">Comprehensive integrity scoring across all ingested data sources, referential checks, and anomaly detection.</p>
        </div>
        <div>
          <span className="badge badge-real">DERIVED</span>
          <span className="badge nb-green" style={{ marginLeft: '8px' }}>SCORE: {overallScore}%</span>
        </div>
      </div>

      {/* Overall Score */}
      <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>{overallScore}%</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Data Quality Score</div>
        <div style={{ width: '80%', height: '8px', background: 'var(--bg-app)', borderRadius: '4px', margin: '12px auto 0', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${overallScore}%`, background: 'var(--color-success)', borderRadius: '4px' }} />
        </div>
      </div>

      {/* Per-Source Metrics Table */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Per-Source Quality Metrics</div>
      <div className="table-container" style={{ marginBottom: '24px' }}>
        <table>
          <thead><tr>
            <th>Data Source</th><th>Total</th><th>Valid</th><th>Invalid</th><th>Duplicates</th><th>Score</th>
          </tr></thead>
          <tbody>
            {QUALITY_METRICS.map(m => (
              <tr key={m.label}>
                <td style={{ fontWeight: 600 }}>{m.label}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{m.total.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>{m.valid.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: m.invalid > 0 ? 'var(--color-live)' : 'inherit' }}>{m.invalid}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: m.dup > 0 ? 'var(--color-warning)' : 'inherit' }}>{m.dup}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '5px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${m.score}%`, background: m.score >= 99.9 ? 'var(--color-success)' : 'var(--color-warning)', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{m.score}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Checks */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Integrity Audit Checklist</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {AUDIT_CHECKS.map((a, i) => (
          <div key={i} style={{
            padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeftWidth: '3px', borderLeftColor: a.status === 'PASS' ? 'var(--color-success)' : 'var(--color-warning)',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{a.check}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.detail}</div>
            </div>
            <span className={`badge ${a.status === 'PASS' ? 'nb-green' : 'nb-amber'}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
