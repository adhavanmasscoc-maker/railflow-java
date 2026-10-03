import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { RailwayDataProvider } from './context/RailwayDataContext';
import DashboardPage from './pages/DashboardPage';
import ConsolePage from './pages/ConsolePage';
import NetworkPage from './pages/NetworkPage';
import JourneyPage from './pages/JourneyPage';
import StationsPage from './pages/StationsPage';
import TrainsPage from './pages/TrainsPage';
import CrowdPage from './pages/CrowdPage';
import CommuterPage from './pages/CommuterPage';
import CommanderPage from './pages/CommanderPage';
import QualityPage from './pages/QualityPage';
import ArchitecturePage from './pages/ArchitecturePage';
import FleetPage from './pages/FleetPage';
import DatabasePage from './pages/DatabasePage';
import FeedbackPage from './pages/FeedbackPage';
import SettingsPage from './pages/SettingsPage';
import AlertsPage from './pages/AlertsPage';
import VoiceCommandPage from './pages/VoiceCommandPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PblSpecPage from './pages/PblSpecPage';

export default function App() {
  return (
    <RailwayDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="console" element={<ConsolePage />} />
            <Route path="network" element={<NetworkPage />} />
            <Route path="journey" element={<JourneyPage />} />
            <Route path="stations" element={<StationsPage />} />
            <Route path="trains" element={<TrainsPage />} />
            <Route path="crowd" element={<CrowdPage />} />
            <Route path="commuter" element={<CommuterPage />} />
            <Route path="commander" element={<VoiceCommandPage />} />
            <Route path="voice-command" element={<VoiceCommandPage />} />
            <Route path="voice-commander" element={<VoiceCommandPage />} />
            <Route path="voice" element={<VoiceCommandPage />} />
            <Route path="ai-copilot" element={<CommanderPage />} />
            <Route path="quality" element={<QualityPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="fleet" element={<FleetPage />} />
            <Route path="database" element={<DatabasePage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="pbl-spec" element={<PblSpecPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </RailwayDataProvider>
  );
}
