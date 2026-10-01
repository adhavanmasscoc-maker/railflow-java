import { useEffect } from 'react';

const SHORTCUTS = [
  { keys: ['/', '⌘K'], action: 'Focus Global Search' },
  { keys: ['Alt + A'], action: 'Toggle AI Copilot Drawer' },
  { keys: ['Escape'], action: 'Close active modal / drawer' },
  { keys: ['1-9'], action: 'Console quick-commands' },
  { keys: ['↑ / ↓'], action: 'Navigate search results' },
];

const SYSTEMS = [
  { id: '01', name: 'Dashboard', desc: 'KPI telemetry, pipeline lifecycle, and live network atlas' },
  { id: '02', name: 'Console', desc: 'Interactive Java 21 CLI with 16 executable commands' },
  { id: '03', name: 'RailRadar Network', desc: 'SVG topology graph, dispatch sandbox, and provenance map' },
  { id: '04', name: 'Journey Planner', desc: 'Corridor-aware route search with timetable integration' },
  { id: '05', name: 'Station Network', desc: '8,989 stations across 16 railway zones with heritage data' },
  { id: '06', name: 'Train Explorer', desc: '5,208 trains with full route, schedule, and rake composition' },
  { id: '07', name: 'Crowd Monitoring', desc: 'Platform density estimation, heatmaps, and surge simulation' },
  { id: '08', name: 'Commuter Portal', desc: 'PNR inquiry, berth maps, fare calculator, and timeline' },
  { id: '09', name: 'Voice Command', desc: 'Web Speech API announcements with microphone pulse states' },
  { id: '10', name: 'Fleet Topology', desc: '16 zonal rolling stock inventories and maintenance gauges' },
  { id: '11', name: 'Architecture', desc: 'Full-stack dataflow from CSV to JDBC to React' },
  { id: '12', name: 'Database Explorer', desc: 'Direct SQLite schema viewer and query interface' },
  { id: '13', name: 'Data Quality', desc: 'Automated audit metrics, anomaly detection, and scoring' },
  { id: '14', name: 'User Feedback', desc: 'Structured feedback form with sentiment analytics' },
];

export default function GuideModal({ isOpen, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 10004,
      display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', width: '90%', maxWidth: '700px', maxHeight: '85vh',
        overflow: 'auto', position: 'relative', top: 'auto', left: 'auto', transform: 'none', display: 'block',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📖</span>
            <strong>RailFlow Operations Guide</strong>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            fontSize: '20px', cursor: 'pointer',
          }}>✕</button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Keyboard Shortcuts */}
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⌨️ Keyboard Shortcuts</h3>
          <div style={{ marginBottom: '24px' }}>
            {SHORTCUTS.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{s.action}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {s.keys.map(k => (
                    <kbd key={k} style={{
                      background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
                      borderRadius: '3px', padding: '2px 8px', fontSize: '11px', fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                    }}>{k}</kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* System Directory */}
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🏛️ System Directory ({SYSTEMS.length} modules)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
            {SYSTEMS.map(sys => (
              <div key={sys.id} style={{
                padding: '10px 14px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', fontSize: '12px',
              }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>SYS {sys.id}</span> {sys.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{sys.desc}</div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '24px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔧 Technology Stack</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'var(--font-mono)' }}>
            <div>Frontend: Vite 8 + React 19 + Tailwind CSS 4</div>
            <div>Backend:  Java 21 LTS + SQLite WAL + JDBC PreparedStatements</div>
            <div>Proxy:    Node.js 24 + Express</div>
            <div>API:      REST (Spring Boot) + Serverless (Vercel Functions)</div>
            <div>AI:       Gemini API via /api/ask-railflow-ai</div>
            <div>Audio:    Web Audio API (synthesized, zero external assets)</div>
            <div>Data:     8,989 stations · 5,208 trains · 416,637 stops · 411,426 edges</div>
          </div>
        </div>
      </div>
    </div>
  );
}
