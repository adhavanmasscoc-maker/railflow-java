import { useState, useRef, useEffect } from 'react';

export default function CommanderPage() {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Commander AI initialized. Ground truth routing and dispatch connected.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input;
    setInput('');

    // Mock AI response
    setTimeout(() => {
      let response = "I am currently running in simulation mode. Direct API connection to Gemini is required for dynamic responses.";
      if (currentInput.toLowerCase().includes('delay')) {
        response = "**Delay Detected**: Pandian Express is delayed by 25m. Recommended action: Route to PF 3 instead of PF 2 to avoid clash with double decker.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const chips = [
    "Simulate PF2 Delay",
    "What is the status of 12638?",
    "Check FOB Density at MAS",
    "Suggest re-routing for Coromandel"
  ];

  return (
    <section className="page-view active" id="page-commander">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 09</span> <span className="slash">//</span> COMMANDER AI</div>
          <div className="view-subtitle">
            <span className="pulse-dot"></span>
            GEMINI DISPATCH COPILOT
          </div>
          <h1 className="view-title">RailFlow Commander AI</h1>
          <p className="view-desc">
            Autonomous dispatch chat interface hooked into the central routing engine and telemetry systems.
          </p>
        </div>
        <span className="badge badge-real">AI CONNECTED</span>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)' }}>
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ 
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? 'var(--color-indigo-600)' : (m.role === 'system' ? 'rgba(16,185,129,0.1)' : 'rgba(14,20,36,0.8)'),
              border: m.role === 'system' ? '1px solid var(--color-status-emerald)' : '1px solid var(--color-border-subtle)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              maxWidth: '80%',
              color: m.role === 'system' ? 'var(--color-status-emerald)' : '#fff',
              fontSize: '14px',
              lineHeight: 1.5
            }}>
              {m.role === 'ai' && <div style={{ fontSize: '11px', color: 'var(--color-cyan-400)', marginBottom: '4px', fontWeight: 600 }}>COMMANDER AI</div>}
              {m.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
            {chips.map((chip, idx) => (
              <button 
                key={idx} 
                onClick={() => { setInput(chip); setTimeout(handleSend, 0); }}
                style={{ padding: '6px 12px', background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-full)', color: 'var(--color-text-secondary)', fontSize: '12px', whiteSpace: 'nowrap', cursor: 'pointer' }}
              >
                {chip}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Commander AI to analyze schedules or reroute trains..." 
              style={{ flex: 1, padding: '12px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '14px' }}
            />
            <button onClick={handleSend} className="btn btn-primary" style={{ padding: '0 24px' }}>Send</button>
          </div>
        </div>
      </div>
    </section>
  );
}
