export default function PlaceholderPage({ title, id }) {
  return (
    <section className="page-view active" id={`page-${id}`}>
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM</span> <span className="slash">//</span> {title.toUpperCase()}</div>
          <div className="view-subtitle">
            <span className="pulse-dot"></span>
            <span>COMPONENT MIGRATION IN PROGRESS</span>
          </div>
        </div>
      </div>
      <div className="view-content" style={{ padding: '2rem' }}>
        <p>This view is currently being ported to React. Data and telemetry will be re-connected in the upcoming phases.</p>
      </div>
    </section>
  );
}
