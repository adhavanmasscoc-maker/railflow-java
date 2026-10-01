export default function AlertsPage() {
  return (
    <section className="page-view active" id="page-alerts">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 14</span> <span className="slash">//</span> SYSTEM ALERTS</div>
          <h1 className="view-title">Real-Time Event Stream</h1>
        </div>
      </div>
      <div className="panel" style={{ padding: '24px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
            <strong style={{ color: '#ef4444' }}>CRITICAL:</strong> Signal Failure at Platform 3 (MAS). Expect 15m delay for Coromandel Express.
          </li>
          <li style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
            <strong style={{ color: '#f59e0b' }}>WARNING:</strong> High crowd density detected at FOB 2. Dispersal suggested.
          </li>
          <li style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981', borderRadius: '4px' }}>
            <strong style={{ color: '#10b981' }}>INFO:</strong> Data synchronization successful. 13,849 records verified.
          </li>
        </ul>
      </div>
    </section>
  );
}
