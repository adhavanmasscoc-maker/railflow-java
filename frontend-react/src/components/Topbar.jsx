export default function Topbar({ toggleSidebar }) {
  return (
    <header className="rf-topbar top-header" id="topHeader">
      <div className="header-left">
        <button 
          className="hamburger-btn" 
          id="btnMobileMenu" 
          title="Toggle Navigation"
          aria-label="Toggle sidebar" 
          onClick={toggleSidebar}
        >
          <span></span><span></span><span></span>
        </button>

        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" className="search-input" id="globalSearchInput"
              placeholder="Search trains, stations, codes… (Press /)"
              autoComplete="off" />
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="pipeline-ticker">
          <span className="pulse-dot"></span>
          <span>LIVE</span>
          <strong id="pipelineClock">00:00:00</strong>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn btn-icon-action" title="Check PNR Status">
          <span>🎟️</span>
          <span className="btn-action-label">PNR</span>
        </button>
        <button className="btn btn-icon-action" title="Operations Architecture Guide">
          <span>📖</span>
          <span className="btn-action-label">Guide</span>
        </button>
        <button className="btn btn-ai-toggle" title="Open RailFlow AI Terminal">
          <span>🤖</span>
          <span>AI</span>
          <span className="ai-ready-dot"></span>
        </button>
      </div>
    </header>
  );
}
