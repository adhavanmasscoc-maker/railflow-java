import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="rf-shell">
      {/* Machina HUD Corner Ticks */}
      <div className="hud-frame" aria-hidden="true">
        <span className="ck tl"></span>
        <span className="ck tr"></span>
        <span className="ck bl"></span>
        <span className="ck br"></span>
      </div>

      <Topbar toggleSidebar={toggleSidebar} />
      
      <div className="rf-body">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="rf-workspace main-viewport">
          <Outlet />
        </main>
      </div>

      {/* Floating Telemetry Badge */}
      <div className="telemetry-badge-float" id="telemetryBadgeFloat">
        <span className="pulse-dot"></span>
        <span id="telemetryFloatLabel">LIVE TELEMETRY</span>
      </div>

      <div className="toast-container" id="toastContainer"></div>
    </div>
  );
}
