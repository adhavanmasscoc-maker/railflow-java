export default function DatabasePage() {
  return (
    <section className="page-view active" id="page-database">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 11</span> <span className="slash">//</span> DATABASE EXPLORER</div>
          <h1 className="view-title">SQLite Active Connection</h1>
        </div>
      </div>
      <div className="panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Direct database queries interface.
      </div>
    </section>
  );
}
