import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AiSlideDrawer from './AiSlideDrawer';
import PnrModal from './PnrModal';
import GuideModal from './GuideModal';
import HudBarTop from './HudBarTop';
import HudBarBottom from './HudBarBottom';
import MobileBottomNav from './MobileBottomNav';
import FloatingHelpWidget from './FloatingHelpWidget';
import StationDrawer from './StationDrawer';
import SoundboardModal from './SoundboardModal';
import TrainTimetableModal from './TrainTimetableModal';
import audioEngine from '../services/audioEngine';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isPnrOpen, setIsPnrOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isStationOpen, setIsStationOpen] = useState(false);
  const [isSoundboardOpen, setIsSoundboardOpen] = useState(false);
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const openAi = useCallback(() => setIsAiOpen(true), []);
  const closeAi = useCallback(() => setIsAiOpen(false), []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Alt+A or Ctrl+Shift+A → toggle AI drawer
      if ((e.altKey && e.key === 'a') || (e.ctrlKey && e.shiftKey && e.key === 'A')) {
        e.preventDefault();
        audioEngine.init();
        audioEngine.playBeep();
        setIsAiOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="rf-shell">
      {/* Machina HUD Corner Ticks */}
      <div className="hud-frame" aria-hidden="true">
        <span className="ck tl"></span>
        <span className="ck tr"></span>
        <span className="ck bl"></span>
        <span className="ck br"></span>
      </div>

      <HudBarTop />

      <Topbar
        toggleSidebar={toggleSidebar}
        onOpenAi={openAi}
        onOpenPnr={() => setIsPnrOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <div className="rf-body">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onOpenAi={openAi} />

        <main className="rf-workspace main-viewport">
          <Outlet context={{ setIsStationOpen, setIsSoundboardOpen, setIsTimetableOpen }} />
        </main>
      </div>

      <HudBarBottom />
      <MobileBottomNav />
      <FloatingHelpWidget />

      {/* Global AI Slide Drawer */}
      <AiSlideDrawer isOpen={isAiOpen} onClose={closeAi} />

      {/* PNR Modal */}
      <PnrModal isOpen={isPnrOpen} onClose={() => setIsPnrOpen(false)} />

      {/* Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Additional Modals */}
      <StationDrawer isOpen={isStationOpen} onClose={() => setIsStationOpen(false)} />
      <SoundboardModal isOpen={isSoundboardOpen} onClose={() => setIsSoundboardOpen(false)} />
      <TrainTimetableModal isOpen={isTimetableOpen} onClose={() => setIsTimetableOpen(false)} />

      <div className="toast-container" id="toastContainer"></div>
    </div>
  );
}
