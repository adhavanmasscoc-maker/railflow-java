import { useState } from 'react';
import audioEngine from '../services/audioEngine';
import PageHeader from '../components/PageHeader';

export default function SettingsPage() {
  const [audioEnabled, setAudioEnabled] = useState(!audioEngine.muted);
  const [polling, setPolling] = useState(3000);
  const [mode, setMode] = useState('simulation');

  const toggleAudio = () => {
    const muted = audioEngine.toggleMute();
    setAudioEnabled(!muted);
    if (!muted) audioEngine.playBeep();
  };

  return (
    <section className="page-view active" id="page-settings">
      <PageHeader
        systemCode="SYSTEM 16 // SETTINGS & CONFIGURATION"
        title="System Preferences"
        subtitle="Audio, Polling, and Operational Mode Configuration"
        description="Configure global audio FX, telemetry polling intervals, and simulation vs live data mode."
        badge="CONFIG"
        badgeColor="indigo"
      />
      
      <div className="panel" style={{ padding: '24px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0 }}>Global Audio &amp; Sound FX</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Toggle system chimes, alarms, and TTS.</p>
            </div>
            <button className={`btn ${audioEnabled ? 'btn-primary' : 'btn-secondary'}`} onClick={toggleAudio}>
              Audio: {audioEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0 }}>Telemetry Polling Interval</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Set the background data fetch rate.</p>
            </div>
            <select value={polling} onChange={e => setPolling(Number(e.target.value))} style={{ padding: '8px 12px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
              <option value={1000}>Aggressive (1000ms)</option>
              <option value={3000}>Standard (3000ms)</option>
              <option value={5000}>Relaxed (5000ms)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>Data Mode</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Toggle between live backend and local simulation.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className={`btn ${mode === 'simulation' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('simulation')}>Simulation (Local)</button>
              <button className={`btn ${mode === 'live' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('live')}>Live API (Backend)</button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
