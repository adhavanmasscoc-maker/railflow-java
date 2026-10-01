import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import audioEngine from '../services/audioEngine';
import { CHORD_LINE_STATIONS, WESTERN_TRUNK_STATIONS, SOUTHERN_TRUNK_STATIONS, VERIFIED_TRAINS } from '../data/masterRailwayData';

const ALL_STATIONS = [...CHORD_LINE_STATIONS, ...WESTERN_TRUNK_STATIONS, ...SOUTHERN_TRUNK_STATIONS]
  .filter((s, i, a) => a.findIndex(x => x.code === s.code) === i);

export default function Topbar({ toggleSidebar, onOpenAi, onOpenPnr, onOpenGuide }) {
  const [clock, setClock] = useState('00:00:00');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Live ticking clock (IST)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Global '/' shortcut to focus search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Debounced search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); setShowSearch(false); return; }
    const q = query.toLowerCase();
    const stationHits = ALL_STATIONS
      .filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
      .slice(0, 5)
      .map(s => ({ type: 'station', label: `🚉 ${s.name} (${s.code})`, code: s.code }));
    const trainHits = VERIFIED_TRAINS
      .filter(t => t.name.toLowerCase().includes(q) || t.number.includes(q))
      .slice(0, 3)
      .map(t => ({ type: 'train', label: `🚆 ${t.number} — ${t.name}`, number: t.number }));
    const systemHits = [
      { term: 'dashboard', path: '/', label: '📊 Dashboard' },
      { term: 'console', path: '/console', label: '🖥️ Console' },
      { term: 'network', path: '/network', label: '🗺️ RailRadar Network' },
      { term: 'journey', path: '/journey', label: '🧭 Journey Planner' },
      { term: 'stations', path: '/stations', label: '🚉 Station Network' },
      { term: 'trains', path: '/trains', label: '🚆 Train Explorer' },
      { term: 'crowd', path: '/crowd', label: '👥 Crowd Monitoring' },
      { term: 'commuter', path: '/commuter', label: '📱 Commuter Portal' },
      { term: 'commander', path: '/commander', label: '🎙️ Voice Command' },
      { term: 'fleet', path: '/fleet', label: '🚂 Fleet Topology' },
      { term: 'architecture', path: '/architecture', label: '🏛️ Architecture' },
      { term: 'database', path: '/database', label: '🗄️ Database Explorer' },
      { term: 'quality', path: '/quality', label: '📈 Data Quality' },
      { term: 'feedback', path: '/feedback', label: '💬 User Feedback' },
      { term: 'settings', path: '/settings', label: '⚙️ Settings' },
      { term: 'alerts', path: '/alerts', label: '🔔 System Alerts' },
    ].filter(s => s.term.includes(q) || s.label.toLowerCase().includes(q))
      .slice(0, 4)
      .map(s => ({ type: 'system', label: s.label, path: s.path }));
    setSearchResults([...systemHits, ...stationHits, ...trainHits]);
    setShowSearch(true);
  }, []);

  const handleResultClick = (result) => {
    audioEngine.init();
    audioEngine.playBeep();
    setShowSearch(false);
    setSearchQuery('');
    if (result.path) navigate(result.path);
    else if (result.type === 'station') navigate('/stations');
    else if (result.type === 'train') navigate('/trains');
  };

  return (
    <header className="rf-header rf-topbar top-header" id="topHeader">
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

        <div className="search-container" style={{ position: 'relative' }}>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={searchRef}
              type="text"
              className="search-input"
              placeholder="Search trains, stations, code… (Press /)"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              onFocus={() => searchQuery && setShowSearch(true)}
            />
            <span className="search-shortcut">/</span>
          </div>

          {/* Autocomplete dropdown */}
          {showSearch && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '4px',
              background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', zIndex: 9999, overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              {searchResults.map((r, idx) => (
                <div key={idx} onClick={() => handleResultClick(r)} style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: '13px',
                  borderBottom: idx < searchResults.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  color: 'var(--text-primary)', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="header-center">
        <div className="pipeline-ticker">
          <span className="pulse-dot"></span>
          <span>LIVE</span>
          <strong id="pipelineClock" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{clock}</strong>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn" title="Check PNR Status" onClick={() => { audioEngine.init(); audioEngine.playBeep(); onOpenPnr?.(); }}>
          <span>🎟️</span>
          <span className="btn-action-label">PNR</span>
        </button>
        <button className="btn" title="Operations Architecture Guide" onClick={() => { audioEngine.init(); audioEngine.playBeep(); onOpenGuide?.(); }}>
          <span>📖</span>
          <span className="btn-action-label">Guide</span>
        </button>
        <button className="btn btn-ai-toggle" title="Open RailFlow AI Terminal" onClick={() => { audioEngine.init(); audioEngine.playBeep(); onOpenAi?.(); }}>
          <span>🤖</span>
          <span>AI</span>
          <span className="ai-ready-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success, #10B981)', display: 'inline-block' }}></span>
        </button>
      </div>
    </header>
  );
}
