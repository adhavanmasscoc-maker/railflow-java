import { Link, useLocation } from 'react-router-dom';

const navGroups = [
  {
    label: 'OPERATIONS CONSOLE',
    items: [
      { path: '/', id: 'dashboard', label: 'Dashboard', icon: 'dashboard', badge: 'LIVE', badgeType: 'emerald' },
      { path: '/console', id: 'console', label: 'Terminal Console', icon: 'console', badge: 'JVM 21', badgeType: 'purple' },
      { path: '/network', id: 'network', label: 'RailRadar Network', icon: 'network', badge: 'TOPOLOGY', badgeType: 'cyan' },
      { path: '/journey', id: 'journey', label: 'Journey Planner', icon: 'journey', badge: 'O(log N)', badgeType: 'red' },
      { path: '/analytics', id: 'analytics', label: 'Telemetry Analytics', icon: 'analytics', badge: 'BENCHMARK', badgeType: 'amber' },
    ]
  },
  {
    label: 'NETWORK INTELLIGENCE',
    items: [
      { path: '/stations', id: 'stations', label: 'Station Network', icon: 'stations', badge: '25 HUBS', badgeType: 'cyan' },
      { path: '/trains', id: 'trains', label: 'Train Explorer', icon: 'trains', badge: '6,675+', badgeType: 'blue' },
      { path: '/crowd', id: 'crowd', label: 'Crowd Monitoring', icon: 'crowd', badge: 'SURGE', badgeType: 'amber' },
      { path: '/commuter', id: 'commuter', label: 'Commuter Portal', icon: 'commuter', badge: 'PASSENGER', badgeType: 'cyan' },
      { path: '/voice-command', id: 'voice-command', label: 'Voice Commander', icon: 'voice', badge: '4-TONE PIS', badgeType: 'emerald' },
      { path: '/ai-copilot', id: 'ai-copilot', label: 'AI Copilot Dispatch', icon: 'commander', badge: 'AKNEX', badgeType: 'indigo' },
    ]
  },
  {
    label: 'SYSTEM & ARCHITECTURE',
    items: [
      { path: '#ai', id: 'ai', label: 'RailFlow AI Drawer', icon: 'ai', badge: 'COPILOT', badgeType: 'indigo' },
      { path: '/fleet', id: 'fleet', label: 'Fleet Topology', icon: 'fleet', badge: '16 ZONES', badgeType: 'cyan' },
      { path: '/database', id: 'database', label: 'Database Explorer', icon: 'database', badge: 'SQLITE', badgeType: 'blue' },
      { path: '/quality', id: 'quality', label: 'Data Quality', icon: 'quality', badge: '100% 3NF', badgeType: 'emerald' },
      { path: '/architecture', id: 'architecture', label: 'Architecture Specs', icon: 'architecture', badge: 'TIER-6', badgeType: 'purple' },
      { path: '/feedback', id: 'feedback', label: 'User Feedback', icon: 'feedback', badge: 'ACTIVE', badgeType: 'pink' },
      { path: '/alerts', id: 'alerts', label: 'System Alerts', icon: 'alerts', badge: 'REALTIME', badgeType: 'red' },
      { path: '/settings', id: 'settings', label: 'Settings', icon: 'settings', badge: 'CONFIG', badgeType: 'cyan' },
      { path: '/pbl-spec', id: 'pbl-spec', label: 'PBL Verification', icon: 'pbl', badge: 'CIT PBL', badgeType: 'purple' },
    ]
  }
];

function NavIcon({ type }) {
  switch (type) {
    case 'dashboard':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case 'console':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'network':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case 'journey':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      );
    case 'analytics':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'stations':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" />
        </svg>
      );
    case 'trains':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="15" rx="2" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="12" y1="3" x2="12" y2="11" /><path d="M8 18l-2 3" /><path d="M16 18l2 3" /><circle cx="8" cy="15" r="1" /><circle cx="16" cy="15" r="1" />
        </svg>
      );
    case 'crowd':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'commuter':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    case 'commander':
    case 'ai':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8.01" y2="16" /><line x1="16" y1="16" x2="16.01" y2="16" />
        </svg>
      );
    case 'voice':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      );
    case 'fleet':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" /><polygon points="8 16 12 12 16 16" /><line x1="12" y1="12" x2="12" y2="21" />
        </svg>
      );
    case 'database':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'quality':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case 'architecture':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case 'feedback':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'alerts':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 'settings':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      );
    case 'pbl':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

function getBadgeClasses(type) {
  switch (type) {
    case 'emerald':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
    case 'cyan':
      return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25';
    case 'purple':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/25';
    case 'indigo':
      return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25';
    case 'amber':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
    case 'red':
      return 'text-rose-400 bg-rose-500/10 border-rose-500/25';
    case 'pink':
      return 'text-pink-400 bg-pink-500/10 border-pink-500/25';
    case 'blue':
    default:
      return 'text-sky-400 bg-sky-500/10 border-sky-500/25';
  }
}

export default function Sidebar({ isOpen, toggleSidebar, onOpenAi }) {
  const location = useLocation();

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
      />
      <aside className={`rf-sidebar-container ${isOpen ? 'mobile-open' : ''}`} id="sidebar">
        {/* Fixed Header with Brand & Status */}
        <div className="sidebar-top-branding">
          <Link to="/" className="sidebar-brand-link">
            <div className="sidebar-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="16" rx="2"/>
                <path d="M4 11h16"/>
                <path d="M12 3v8"/>
                <path d="M8 19l-2 3"/>
                <path d="M16 19l2 3"/>
                <circle cx="8" cy="15" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="15" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div className="sidebar-brand-info">
              <span className="sidebar-brand-title">RailFlow</span>
              <span className="sidebar-brand-tagline">CIT PBL • Telemetry Hub</span>
            </div>
          </Link>
          <div className="sidebar-status-pill">
            <span className="status-live-dot animate-pulse"></span>
            <span>LIVE</span>
          </div>
        </div>

        {/* Dedicated Scroll Container (Independent from Header & Footer) */}
        <div className="sidebar-nav-scroll">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="sidebar-group-block">
              <div className="sidebar-group-title">{group.label}</div>
              <div className="sidebar-group-items">
                {group.items.map(item => {
                  const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');
                  
                  if (item.path.startsWith('#')) {
                    return (
                      <a 
                        key={item.id} 
                        href={item.path} 
                        className="sidebar-link-row ai-row" 
                        onClick={(e) => { e.preventDefault(); onOpenAi?.(); }}
                      >
                        <span className="sidebar-link-icon-box">
                          <NavIcon type={item.icon} />
                        </span>
                        <span className="sidebar-link-text">{item.label}</span>
                        <span className={`sidebar-link-badge ${getBadgeClasses(item.badgeType)}`}>
                          {item.badge}
                        </span>
                      </a>
                    );
                  }

                  return (
                    <Link 
                      key={item.id} 
                      to={item.path} 
                      className={`sidebar-link-row ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        if (window.innerWidth <= 768) toggleSidebar();
                      }}
                    >
                      <span className="sidebar-link-icon-box">
                        <NavIcon type={item.icon} />
                      </span>
                      <span className="sidebar-link-text">{item.label}</span>
                      <span className={`sidebar-link-badge ${getBadgeClasses(item.badgeType)}`}>
                        {item.badge}
                      </span>
                      {isActive && <span className="sidebar-active-indicator" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pinned Bottom Operational Footer */}
        <div className="sidebar-pinned-footer">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-semibold">4,000ms TICK</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 font-mono">v3.0</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1 flex justify-between">
            <span>Java 21 • SQLite WAL</span>
            <span className="text-emerald-400/90 font-medium">100% NOMINAL</span>
          </div>
        </div>
      </aside>
    </>
  );
}
