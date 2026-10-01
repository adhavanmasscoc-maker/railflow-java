import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import audioEngine from '../services/audioEngine';

const PROMPT_CHIPS = [
  'Check Delayed Trains',
  'Platform Conflict Analysis',
  'Optimize Corridor',
  'Draft Passenger Alert',
  'Show Train 12622 Status',
  'Station Crowd Report',
  'Next Train to Chennai',
  'Network Health Summary',
];

const AI_GREETING = {
  sender: 'ai',
  text: 'Welcome to RailFlow AI Copilot (AKNEX). I can help with train scheduling, platform optimization, crowd analysis, and network diagnostics. Ask me anything about the railway system.',
  timestamp: new Date().toISOString(),
};

export default function AiSlideDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([AI_GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Global Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    audioEngine.init();
    audioEngine.playBeep();

    const userMsg = { sender: 'user', text: text.trim(), timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.askAi(text.trim());
      audioEngine.playChime();
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data.response || data.answer || JSON.stringify(data), timestamp: new Date().toISOString() },
      ]);
    } catch {
      // Offline mock fallback
      const mockResponses = {
        'check delayed trains': '🚆 Currently tracking 5,208 scheduled services. 12 trains showing delays > 15 min on the Northern corridor (NDLS-CNB segment). Top delayed: Rajdhani Express (12302) — 23 min late at Kanpur Central.',
        'platform conflict analysis': '⚠️ Platform 3 at MAS has a scheduling overlap between Train 12622 (Tamil Nadu Express, ETA 07:15) and Train 12634 (Vaigai Express, ETD 07:10). Recommend reassigning 12634 to Platform 5.',
        'optimize corridor': '📊 Golden Quadrilateral trunk analysis: NDLS-MAS corridor operating at 87% capacity. Bottleneck detected at Vijayawada Jn (BZA) — 4 trains queued. Suggest staggering departures by 12 min intervals.',
        'draft passenger alert': '📢 Draft Alert: "Attention passengers on Platform 4. Train 12622 Tamil Nadu Express to New Delhi is arriving shortly. Please stand behind the yellow line. This train will depart at 22:30 hrs from Platform 4."',
      };
      const key = text.trim().toLowerCase();
      const fallback = mockResponses[key] || `🤖 [Offline Mode] I received your query: "${text}". The live AI endpoint is currently unreachable. In production, this connects to the Gemini API via /api/ask-railflow-ai. The system maintains 8,989 stations and 5,208 trains in the local SQLite database for offline queries.`;
      audioEngine.playChime();
      setMessages((prev) => [...prev, { sender: 'ai', text: fallback, timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          zIndex: 10004, display: isOpen ? 'block' : 'none', transition: 'opacity 0.3s ease',
          opacity: isOpen ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        style={{
          position: 'fixed', top: 0, right: isOpen ? 0 : '-500px', width: '450px', maxWidth: '95vw',
          height: '100vh', background: 'var(--bg-panel, #111111)', borderLeft: '1px solid var(--border-subtle, #2A2A2A)',
          zIndex: 10005, transition: 'right 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>RailFlow AI Copilot</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AKNEX Dispatch Intelligence</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-success, #10B981)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulse-dot"></span> Online
            </span>
            <button onClick={onClose} className="drawer-close" style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer',
              padding: '4px 8px', borderRadius: '4px',
            }}>✕</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}>
              <div style={{
                padding: '10px 14px', borderRadius: '8px', fontSize: '13px', lineHeight: 1.6,
                background: msg.sender === 'user' ? 'var(--text-secondary, #A1A1AA)' : 'var(--bg-app, #0A0A0A)',
                color: msg.sender === 'user' ? 'var(--bg-app, #0A0A0A)' : 'var(--text-primary, #EDEDED)',
                border: msg.sender === 'ai' ? '1px solid var(--border-subtle)' : 'none',
                borderBottomLeftRadius: msg.sender === 'ai' ? '2px' : '8px',
                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '8px',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span style={{ animation: 'pulse-glow 1s ease-in-out infinite' }}>Thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompt chips */}
        <div style={{ padding: '8px 16px', display: 'flex', flexWrap: 'wrap', gap: '6px', borderTop: '1px solid var(--border-subtle)' }}>
          {PROMPT_CHIPS.map((chip) => (
            <button key={chip} onClick={() => sendMessage(chip)} className="ai-chip" style={{
              fontSize: '11px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
              padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}>
              {chip}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask RailFlow AI anything..."
            style={{
              flex: 1, background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
              padding: '10px 14px', borderRadius: '4px', color: 'var(--text-primary)',
              fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)',
            }}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="btn btn-ai-toggle"
            style={{
              padding: '8px 16px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
              opacity: loading || !input.trim() ? 0.5 : 1,
            }}
          >
            Send
          </button>
        </div>
      </aside>
    </>
  );
}
