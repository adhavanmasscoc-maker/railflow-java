export default function ArchitecturePage() {
  return (
    <section className="page-view active" id="page-architecture">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 09</span> <span className="slash">//</span> SYSTEM ARCHITECTURE</div>
          <div className="view-subtitle">ENGINEERING BLUEPRINT</div>
          <h1 className="view-title">System &amp; Core Java Architecture</h1>
          <p className="view-desc">
            Complete dataflow from CSV Ingestion to JDBC PreparedStatements, SQLite, Services, and Concurrency Telemetry.
          </p>
        </div>
        <span className="badge badge-real">JAVA 17+ JDBC</span>
      </div>
      <div className="panel" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
        <span style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</span>
        <h3>Architecture Diagram</h3>
        <p>Vite + React UI &rarr; Node.js Proxy &rarr; Java Spring Boot / SQLite</p>
      </div>
    </section>
  );
}
