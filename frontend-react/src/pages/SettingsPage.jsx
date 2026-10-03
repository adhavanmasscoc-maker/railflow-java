import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import audioEngine from '../services/audioEngine';

const RBAC_ROLES = [
  { role: 'Super Admin', users: 1, perms: ['All Systems', 'RBAC Management', 'Database Export', 'Signal Override'], color: '#ef4444' },
  { role: 'Controller', users: 4, perms: ['Dashboard', 'Commander Dispatch', 'Network View', 'Alerts ACK'], color: '#f59e0b' },
  { role: 'Analyst',    users: 8, perms: ['Dashboard (Read)', 'Analytics', 'Quality', 'Fleet View'], color: '#38bdf8' },
  { role: 'Commuter',   users: 0, perms: ['Journey Planner', 'Commuter PIS', 'Station Search'], color: '#10b981' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/stations', desc: 'Station search & directory', status: 'HEALTHY', latency: '12ms' },
  { method: 'GET', path: '/api/trains', desc: 'Train schedule & route service', status: 'HEALTHY', latency: '18ms' },
  { method: 'POST', path: '/api/journey-plan', desc: 'Dijkstra/BFS journey planner', status: 'HEALTHY', latency: '84ms' },
  { method: 'GET', path: '/api/database', desc: 'SQLite read-only query runner', status: 'HEALTHY', latency: '4ms' },
  { method: 'POST', path: '/api/ask-railflow-ai', desc: 'AKNEX AI copilot handler', status: 'DEGRADED', latency: '340ms' },
  { method: 'GET', path: '/api/atlas-proxy', desc: 'OpenRailwayMap tile proxy', status: 'HEALTHY', latency: '65ms' },
];

const NOTIFICATION_CHANNELS = [
  { channel: 'Critical Alerts (CRITICAL)', icon: '🚨', enabled: true },
  { channel: 'Warning Alerts (WARNING)', icon: '⚠️', enabled: true },
  { channel: 'Crowd Surge Notifications', icon: '👥', enabled: true },
  { channel: 'Platform Conflict Events', icon: '🚉', enabled: true },
  { channel: 'System Health Heartbeat', icon: '💚', enabled: false },
  { channel: 'AI Copilot Session Logs', icon: '🤖', enabled: false },
];

const methodColor = { GET: '#10b981', POST: '#38bdf8', PUT: '#f59e0b', DELETE: '#ef4444' };

export default function SettingsPage() {
  const [audioEnabled, setAudioEnabled] = useState(!audioEngine.muted);
  const [polling, setPolling] = useState(3000);
  const [dataMode, setDataMode] = useState('simulation');
  const [notifications, setNotifications] = useState(NOTIFICATION_CHANNELS);
  const [theme, setTheme] = useState('dark');
  const [compactMode, setCompactMode] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const toggleAudio = () => {
    const muted = audioEngine.toggleMute();
    setAudioEnabled(!muted);
    if (!muted) audioEngine.playBeep();
  };

  const toggleNotif = (i) => {
    setNotifications(prev => prev.map((n, idx) => idx === i ? { ...n, enabled: !n.enabled } : n));
  };

  return (
    <section className="page-view active" id="page-settings">
      <PageHeader
        systemCode="SYSTEM 16 // SETTINGS & CONFIGURATION"
        title="System Preferences & Configuration"
        subtitle="Audio, RBAC, API Endpoints, and Telemetry Polling"
        description="Configure global audio FX, telemetry polling intervals, notification channels, role-based access control, and API endpoint health monitoring."
        extra={<span className="badge badge-derived">CONFIG</span>}
      />

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(14,20,36,0.8)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(148,163,184,0.08)', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { k: 'general', label: '⚙️ General' },
          { k: 'notifications', label: '🔔 Notifications' },
          { k: 'rbac', label: '👥 Access Control' },
          { k: 'api', label: '🌐 API Endpoints' },
        ].map(t => (
          <button key={t.k} onClick={() => setActiveTab(t.k)}
            style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === t.k ? '#38bdf8' : 'transparent', color: activeTab === t.k ? '#000' : 'var(--color-text-secondary)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {[
            {
              title: 'Global Audio & Sound FX',
              desc: 'Toggle system chimes, platform announcement bells, and station TTS alerts.',
              action: (
                <button onClick={toggleAudio} className={`btn ${audioEnabled ? 'btn-primary' : 'btn-secondary'}`} style={{ minWidth: '100px' }}>
                  Audio: {audioEnabled ? '🔊 ON' : '🔇 OFF'}
                </button>
              ),
            },
            {
              title: 'Telemetry Polling Interval',
              desc: 'Set the background crowd simulation and data fetch rate.',
              action: (
                <select value={polling} onChange={e => setPolling(Number(e.target.value))}
                  style={{ padding: '8px 12px', background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 'var(--radius-md)', color: '#e2e8f0', fontSize: '12px' }}>
                  <option value={1000}>Aggressive (1,000ms)</option>
                  <option value={3000}>Standard (3,000ms)</option>
                  <option value={4000}>Simulation (4,000ms)</option>
                  <option value={5000}>Relaxed (5,000ms)</option>
                </select>
              ),
            },
            {
              title: 'Data Mode',
              desc: 'Toggle between live Spring Boot backend API and local simulation fallback.',
              action: (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className={`btn ${dataMode === 'simulation' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDataMode('simulation')} style={{ fontSize: '11px' }}>Simulation</button>
                  <button className={`btn ${dataMode === 'live' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDataMode('live')} style={{ fontSize: '11px' }}>Live API</button>
                </div>
              ),
            },
            {
              title: 'UI Display Mode',
              desc: 'Switch between full-width telemetry and compact condensed view.',
              action: (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className={`btn ${!compactMode ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCompactMode(false)} style={{ fontSize: '11px' }}>Full View</button>
                  <button className={`btn ${compactMode ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCompactMode(true)} style={{ fontSize: '11px' }}>Compact</button>
                </div>
              ),
            },
          ].map((row, i, arr) => (
            <div key={row.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: i < arr.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#e2e8f0', marginBottom: '3px' }}>{row.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{row.desc}</div>
              </div>
              {row.action}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {notifications.map((n, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: i < notifications.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '18px' }}>{n.icon}</span>
                <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 600 }}>{n.channel}</span>
              </div>
              <button onClick={() => toggleNotif(i)}
                style={{ width: '46px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: n.enabled ? '#10b981' : 'rgba(148,163,184,0.2)', transition: 'background 0.3s', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '3px', left: n.enabled ? '24px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left 0.3s' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rbac' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {RBAC_ROLES.map(r => (
            <div key={r.role} style={{ padding: '18px', background: 'rgba(14,20,36,0.9)', border: `1px solid ${r.color}22`, borderRadius: 'var(--radius-lg)', borderTop: `3px solid ${r.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: r.color }}>{r.role}</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{r.users} user{r.users !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {r.perms.map(p => (
                  <div key={p} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    <span style={{ color: r.color }}>✓</span> {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'api' && (
        <div style={{ background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                {['METHOD', 'ENDPOINT', 'DESCRIPTION', 'LATENCY', 'STATUS'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {API_ENDPOINTS.map((ep, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.04)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: `${methodColor[ep.method] || '#94a3b8'}22`, color: methodColor[ep.method] || '#94a3b8', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 800, padding: '2px 7px', borderRadius: '3px' }}>{ep.method}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>{ep.path}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{ep.desc}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: ep.status === 'HEALTHY' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{ep.latency}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: ep.status === 'HEALTHY' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: ep.status === 'HEALTHY' ? '#10b981' : '#f59e0b', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>{ep.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
