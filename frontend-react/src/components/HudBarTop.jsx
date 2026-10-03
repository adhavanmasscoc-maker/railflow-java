import { useState, useEffect } from 'react';

export default function HudBarTop() {
  const [time, setTime] = useState('');
  const [ms, setMs] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour12: false }));
      setMs(`.${now.getMilliseconds().toString().padStart(3, '0')}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hud-bar-top" id="hudBarTop">
      <div className="hud-brand">RAILFLOW <span className="slash">//</span> NETWORK INTELLIGENCE</div>
      <div className="hud-index">SYS <b id="hud-block">01</b> / 12</div>
      <div className="hud-nav-arrows">
        <button id="arrow-up" title="Previous System View">&#9650;</button>
        <button id="arrow-down" title="Next System View">&#9660;</button>
      </div>
      <span style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '0.68rem', margin: '0 8px', letterSpacing: '0.04em' }}>&copy; 2026 AKNEX</span>
      <span id="live-clock">{time}<span className="ms">{ms}</span></span>
      <div className="hud-progress">
        <div className="hud-progress-bar"><div className="hud-progress-fill" id="hud-bar" style={{ width: '8.3%' }}></div></div>
        <span className="hud-pct" id="hud-pct">8%</span>
      </div>
    </div>
  );
}
