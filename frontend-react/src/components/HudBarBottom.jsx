export default function HudBarBottom() {
  return (
    <footer className="rf-ticker" id="hudBarBottom">
      <div className="ticker-left">
        <span className="ticker-brand">RAILFLOW</span>
        <span className="ticker-sep">//</span>
        <span className="ticker-sub">NETWORK INTELLIGENCE</span>
        <span className="ticker-badge">SYS NOMINAL</span>
      </div>
      <div className="ticker-center">
        <span className="ticker-metric">25 HUBS ACTIVE</span>
        <span className="ticker-sep">•</span>
        <span className="ticker-metric">6 TRUNK CORRIDORS</span>
        <span className="ticker-sep">•</span>
        <span className="ticker-metric" id="tickerClockDisplay">LIVE TELEMETRY</span>
      </div>
      <div className="ticker-right">
        <span>&copy; 2026 AKNEX</span>
        <span className="ticker-sep">•</span>
        <span>Java 17+ &bull; SQLite JDBC V2.0</span>
      </div>
    </footer>
  );
}
