import { NavLink } from 'react-router-dom';

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav" id="mobileBottomNav" aria-label="Mobile Quick Navigation">
      <NavLink to="/" className={({ isActive }) => `mnav-item ${isActive ? 'active' : ''}`} end>
        <span className="mnav-icon">📊</span>
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/journey" className={({ isActive }) => `mnav-item ${isActive ? 'active' : ''}`}>
        <span className="mnav-icon">🗺️</span>
        <span>Planner</span>
      </NavLink>
      <NavLink to="/network" className={({ isActive }) => `mnav-item ${isActive ? 'active' : ''}`}>
        <span className="mnav-icon">🌐</span>
        <span>Network</span>
      </NavLink>
      <NavLink to="/crowd" className={({ isActive }) => `mnav-item ${isActive ? 'active' : ''}`}>
        <span className="mnav-icon">👥</span>
        <span>Crowd</span>
      </NavLink>
      <NavLink to="/commuter" className={({ isActive }) => `mnav-item ${isActive ? 'active' : ''}`}>
        <span className="mnav-icon">📱</span>
        <span>Commuter</span>
      </NavLink>
    </nav>
  );
}
