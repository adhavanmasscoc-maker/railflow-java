import { Link, useLocation } from 'react-router-dom';

const navGroups = [
  {
    label: 'OPERATIONS CONSOLE',
    items: [
      { path: '/', id: 'dashboard', label: 'Dashboard', emoji: '📊', badge: 'LIVE', badgeColor: 'nb-green' },
      { path: '/console', id: 'console', label: 'Console', emoji: '🖥️', badge: 'TERMINAL', badgeColor: 'nb-purple' },
      { path: '/network', id: 'network', label: 'RailRadar Network', emoji: '🗺️', badge: 'MAP', badgeColor: 'nb-cyan' },
      { path: '/journey', id: 'journey', label: 'Journey Planner', emoji: '🧭', badge: 'ROUTER', badgeColor: 'nb-red' },
    ]
  },
  {
    label: 'NETWORK INTELLIGENCE',
    items: [
      { path: '/stations', id: 'stations', label: 'Station Network', emoji: '🚉', badge: '25 HUBS', badgeColor: 'nb-cyan' },
      { path: '/trains', id: 'trains', label: 'Train Explorer', emoji: '🚆', badge: 'LIVE DATA', badgeColor: 'nb-blue' },
      { path: '/crowd', id: 'crowd', label: 'Crowd Monitoring', emoji: '👥', badge: 'SIMULATION', badgeColor: 'nb-amber' },
      { path: '/commuter', id: 'commuter', label: 'Commuter Portal', emoji: '📱', badge: 'PASSENGER', badgeColor: 'nb-cyan' },
      { path: '/commander', id: 'commander', label: 'Voice Command', emoji: '🎙️', badge: 'AUDIO', badgeColor: 'nb-green' },
    ]
  },
  {
    label: 'SYSTEM & DATA',
    items: [
      { path: '#ai', id: 'ai', label: 'RailFlow AI', emoji: '🤖', badge: 'AKNEX', badgeColor: 'nb-ai' },
      { path: '/quality', id: 'quality', label: 'Data Quality', emoji: '📈', badge: 'DERIVED', badgeColor: 'nb-blue' },
      { path: '/architecture', id: 'architecture', label: 'Architecture', emoji: '🏛️', badge: 'SPECS', badgeColor: 'nb-purple' },
      { path: '/fleet', id: 'fleet', label: 'Fleet Topology', emoji: '🚂', badge: '16 ZONES', badgeColor: 'nb-cyan' },
      { path: '/database', id: 'database', label: 'Database Explorer', emoji: '🗄️', badge: 'JDBC', badgeColor: 'nb-blue' },
      { path: '/feedback', id: 'feedback', label: 'User Feedback', emoji: '💬', badge: 'ACTIVE', badgeColor: 'nb-pink' },
      { path: '/alerts', id: 'alerts', label: 'System Alerts', emoji: '🔔', badge: 'REAL-TIME', badgeColor: 'nb-red' },
      { path: '/settings', id: 'settings', label: 'Settings', emoji: '⚙️', badge: 'CONFIG', badgeColor: 'nb-cyan' },
    ]
  }
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
      />
      <aside className={`rf-sidebar sidebar ${isOpen ? 'mobile-open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <div className="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="16" rx="2"/>
                <path d="M4 11h16"/>
                <path d="M12 3v8"/>
                <path d="M8 19l-2 3"/>
                <path d="M16 19l2 3"/>
                <circle cx="8" cy="15" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="15" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-main">RailFlow</span>
              <span className="logo-sub">Network Intelligence</span>
            </div>
          </Link>
        </div>

        <nav className="rf-sidebar-nav sidebar-nav" id="sidebarNav">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="nav-section-label">{group.label}</div>
              {group.items.map(item => {
                const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');
                
                // AI drawer is a special case that doesn't navigate
                if (item.path.startsWith('#')) {
                  return (
                    <a key={item.id} href={item.path} className={`nav-item nav-ai-item`} onClick={(e) => e.preventDefault()}>
                      <span className="nav-emoji">{item.emoji}</span>
                      <span className="nav-label">{item.label}</span>
                      <span className={`nav-badge ${item.badgeColor}`}>{item.badge}</span>
                    </a>
                  );
                }

                return (
                  <Link 
                    key={item.id} 
                    to={item.path} 
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (window.innerWidth <= 768) toggleSidebar();
                    }}
                  >
                    <span className="nav-emoji">{item.emoji}</span>
                    <span className="nav-label">{item.label}</span>
                    <span className={`nav-badge ${item.badgeColor}`}>{item.badge}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="rf-sidebar-footer sidebar-footer" id="sidebarFooter">
          <span>Java 21 • Vite + React</span>
          <span className="version-chip">v3.0</span>
        </div>
      </aside>
    </>
  );
}
