import { useState, useRef, useEffect } from 'react';
import { askRailFlowAi } from '../services/api';
import PageHeader from '../components/PageHeader';

const CHIPS = [
  'Simulate PF2 Delay',
  'What is the status of 12638?',
  'Check FOB Density at MAS',
  'Suggest re-routing for Coromandel',
  'Network Health Summary',
  'Check Delayed Trains',
];

export default function CommanderPage() {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Commander AI initialized. Ground truth routing and dispatch connected. AKNEX heuristic engine online.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryOverride) => {
    const query = (queryOverride ?? input).trim();
    if (!query || loading) return;

    // 1. Render user message immediately
    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setInput('');
    setLoading(true);

    try {
      // 2. askRailFlowAi never throws — always returns a string
      const historyPayload = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      const reply = await askRailFlowAi(query, historyPayload);
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    } finally {
      // 3. Guaranteed reset
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="page-view active" id="page-commander">
      <PageHeader
        systemCode="SYSTEM 09 // COMMANDER AI"
        title="RailFlow Commander AI"
        subtitle="Gemini Dispatch Copilot — AKNEX Intelligence"
        description="Autonomous dispatch chat interface hooked into the central routing engine and telemetry systems. Responds instantly with heuristic fallback when live AI is offline."
        badge="AI CONNECTED"
        badgeColor="emerald"
      />

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', minHeight: '400px' }}>
        {/* Chat thread */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? 'var(--color-indigo-600, #4F46E5)' : (m.role === 'system' ? 'rgba(16,185,129,0.1)' : 'rgba(14,20,36,0.8)'),
              border: m.role === 'system' ? '1px solid var(--color-status-emerald, #10B981)' : '1px solid var(--color-border-subtle)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              maxWidth: '80%',
              color: m.role === 'system' ? 'var(--color-status-emerald, #10B981)' : '#fff',
              fontSize: '14px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {m.role === 'ai' && <div style={{ fontSize: '11px', color: '#67E8F9', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.06em' }}>COMMANDER AI</div>}
              {m.text}
            </div>
          ))}

          {/* Animated typing indicator */}
          {loading && (
            <div style={{ alignSelf: 'flex-start', padding: '12px 16px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '5px', alignItems: 'center' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', animation: 'pulse-glow 0.8s ease-in-out infinite' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', animation: 'pulse-glow 0.8s ease-in-out 0.2s infinite' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', animation: 'pulse-glow 0.8s ease-in-out 0.4s infinite' }} />
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
          {/* Quick chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
            {CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                disabled={loading}
                style={{
                  padding: '6px 12px', background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-full, 999px)', color: 'var(--color-text-secondary)', fontSize: '12px',
                  whiteSpace: 'nowrap', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1,
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Text input row */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Commander AI to analyze schedules or reroute trains…"
              disabled={loading}
              style={{
                flex: 1, padding: '12px', background: 'rgba(14,20,36,0.8)',
                border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)',
                color: '#fff', fontSize: '14px', outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '0 24px', opacity: loading || !input.trim() ? 0.5 : 1 }}
            >
              {loading ? '…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
