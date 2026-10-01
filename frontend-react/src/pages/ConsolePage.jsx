import { useState, useRef, useEffect } from 'react';

export default function ConsolePage() {
  const [output, setOutput] = useState([
    "RailFlow JVM Console initialized.",
    "Loading OpenJDK 21 LTS 64-bit Server VM...",
    "Connected to SQLite WAL DB (8989 stations, 5208 trains)...",
    "Type 'help' to see available commands."
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = (cmd) => {
    if (!cmd.trim()) return;
    
    setOutput(prev => [...prev, `railflow@jvm:~$ ${cmd}`]);
    
    // Minimal mock response for now (to be wired to actual logic later)
    setTimeout(() => {
      let response = `Command not recognized: ${cmd}`;
      if (cmd === 'help') response = "Available commands: 1, 2, 7, help, stats, schema, routes, trains, stations, bfs, javac, mvn, gradle";
      if (cmd === 'stats') response = "Active JVM Threads: 42 | Heap Usage: 1.2GB/4GB | SQLite WAL Queue: 0";
      if (cmd === 'clear' || cmd === 'cls') {
        setOutput([]);
        return;
      }
      
      setOutput(prev => [...prev, response]);
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  const clearConsole = () => setOutput([]);

  return (
    <section className="page-view active" id="page-console">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 02</span> <span className="slash">//</span> OPERATIONS CONSOLE</div>
          <div className="view-subtitle">
            <span className="pulse-dot"></span>
            BASH + JAVA HYBRID
          </div>
          <h1 className="view-title">⚡ RailFlow Interactive Java Console</h1>
          <p className="view-desc">
            Enterprise Java 21 LTS Interactive Operations Terminal (RailFlowConsole.java). Simulates direct JVM runtime interaction, SQLite WAL batch querying, PriorityQueue platform conflict optimization, and real-time station soundboard.
          </p>
        </div>
        <div>
          <span className="badge badge-real">BASH + JAVA HYBRID</span>
          <span className="badge" style={{ margin: '0 8px' }}>16 COMMANDS</span>
          <button className="btn btn-secondary" onClick={clearConsole}>Clear Console</button>
        </div>
      </div>

      <div className="console-terminal-window" id="consoleTerminalWindow" style={{ background: '#0a0e18', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', marginTop: '24px' }}>
        <div className="console-titlebar" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>
            <span style={{ marginLeft: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>⚡ RailFlow Interactive Java Console — BASH + JAVA HYBRID</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-status-emerald)' }}>
            <span className="pulse-dot"></span> JVM 21 LTS (ONLINE)
          </span>
        </div>
        
        <div className="console-output-area" style={{ padding: '16px', height: '350px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
          {output.map((line, idx) => (
            <div key={idx} style={{ color: line.startsWith('railflow@jvm:~$') ? 'var(--color-text-secondary)' : (line.includes('Error') ? '#ef4444' : 'inherit') }}>
              {line}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        
        <div className="console-input-row" style={{ display: 'flex', padding: '12px 16px', background: 'rgba(14,20,36,0.8)', borderTop: '1px solid var(--color-border-subtle)' }}>
          <span className="console-prompt" style={{ color: 'var(--color-cyan-400)', marginRight: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>railflow@jvm:~$</span>
          <input 
            type="text" 
            className="console-input" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command (try: help, stats, cls)..." 
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            autoComplete="off" 
            spellCheck="false" 
          />
        </div>
      </div>

      <div className="console-quick-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
        {['[1] ⚡ START', '[2] 🚆 TRAINS', '[3] 🚉 STATIONS', '[4] 👥 CROWD', '[5] 🧠 SOLVER', '[6] 🛰️ RADAR', '[7] 📢 VOICE', '[8] 🎫 PNR', '[9] 🧭 ROUTING', '[10] 🗄️ SCHEMA', '[11] 🚪 METERING', '[12] 🚆 CLONE', '[13] 🚦 SIGNALS', '[14] 📊 ANALYTICS', '[15] ⚙️ SPECS', '[16] ⏹️ STOP'].map((chip, idx) => (
          <button 
            key={idx} 
            onClick={() => handleCommand(String(idx + 1))}
            style={{ padding: '6px 12px', background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
          >
            {chip}
          </button>
        ))}
      </div>
    </section>
  );
}
