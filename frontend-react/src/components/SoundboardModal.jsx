import { useState } from 'react';

export default function SoundboardModal({ isOpen, onClose }) {
  const [lang, setLang] = useState('ta-IN');
  const [scenario, setScenario] = useState('arrival');

  if (!isOpen) return null;

  return (
    <>
      <div className="soundboard-backdrop" style={{ display: 'block' }} onClick={onClose}></div>
      <div className="station-soundboard-modal" style={{ display: 'flex', flexDirection: 'column' }} role="dialog" aria-modal="true" aria-labelledby="soundboardTitle">
        <div className="soundboard-header">
          <div className="soundboard-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-real">IR PASSENGER ADDRESS</span>
              <span className="bp-chip"><span className="bp-ring" style={{ width: '8px', height: '8px' }}></span> LIVE SYNTHESIZER</span>
            </div>
            <h3 id="soundboardTitle" className="soundboard-title">Station Master Multi-Lingual PA Soundboard</h3>
            <p className="soundboard-subtitle">Authentic Public Address Synthesizer with 4-Tone Chime, Multi-Dialect Voice Personas &amp; Acoustic Horn Filtering</p>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close Soundboard">&times;</button>
        </div>

        <div className="soundboard-body">
          <div className="soundboard-section">
            <div className="soundboard-section-label">
              <span>1. SELECT BROADCAST LANGUAGE</span>
              <span className="soundboard-section-note">8 Indian Regional Dialects + Trilingual Chain</span>
            </div>
            <div className="soundboard-lang-grid">
              <button type="button" className={`soundboard-lang-btn ${lang === 'ta-IN' ? 'active' : ''}`} onClick={() => setLang('ta-IN')}>
                <span className="soundboard-lang-flag">🌴</span>
                <span className="soundboard-lang-name">Tamil</span>
                <span className="soundboard-lang-native">தமிழ் (Southern)</span>
              </button>
              <button type="button" className={`soundboard-lang-btn ${lang === 'hi-IN' ? 'active' : ''}`} onClick={() => setLang('hi-IN')}>
                <span className="soundboard-lang-flag">🏛️</span>
                <span className="soundboard-lang-name">Hindi</span>
                <span className="soundboard-lang-native">हिन्दी (Central/NR)</span>
              </button>
              <button type="button" className={`soundboard-lang-btn ${lang === 'en-IN' ? 'active' : ''}`} onClick={() => setLang('en-IN')}>
                <span className="soundboard-lang-flag">🌐</span>
                <span className="soundboard-lang-name">Indian English</span>
                <span className="soundboard-lang-native">Railway PA Cadence</span>
              </button>
              <button type="button" className={`soundboard-lang-btn ${lang === 'te-IN' ? 'active' : ''}`} onClick={() => setLang('te-IN')}>
                <span className="soundboard-lang-flag">🌾</span>
                <span className="soundboard-lang-name">Telugu</span>
                <span className="soundboard-lang-native">తెలుగు (SCR)</span>
              </button>
              <button type="button" className="soundboard-lang-btn soundboard-lang-trilingual">
                <span className="soundboard-lang-flag">🇮🇳</span>
                <span className="soundboard-lang-name">Tri-Lingual Protocol</span>
                <span className="soundboard-lang-native">Regional ➔ Hindi ➔ English</span>
              </button>
            </div>
          </div>

          <div className="soundboard-section">
            <div className="soundboard-section-label">
              <span>2. OPERATIONAL SCENARIO TEMPLATE</span>
              <span className="soundboard-section-note">Authentic Indian Railways Station PA Scripts</span>
            </div>
            <div className="soundboard-scenario-grid">
              <button type="button" className={`soundboard-scenario-btn ${scenario === 'arrival' ? 'active' : ''}`} onClick={() => setScenario('arrival')}>
                <span className="soundboard-scenario-icon">🚆</span>
                <span className="soundboard-scenario-title">Platform Arrival</span>
                <span className="soundboard-scenario-desc">Standard incoming express arrival announcement</span>
              </button>
              <button type="button" className={`soundboard-scenario-btn ${scenario === 'reallocation' ? 'active' : ''}`} onClick={() => setScenario('reallocation')}>
                <span className="soundboard-scenario-icon">⚠️</span>
                <span className="soundboard-scenario-title">Platform Reallocation</span>
                <span className="soundboard-scenario-desc">Congestion reroute to alternative platform</span>
              </button>
            </div>
          </div>

          <div className="soundboard-params-row">
            <div className="soundboard-param-col">
              <label className="form-label">Target Train Service</label>
              <select className="form-input">
                <option value="12635">12635 &bull; Vaigai Superfast Express</option>
                <option value="12638">12638 &bull; Pandian Superfast Express</option>
                <option value="12622">12622 &bull; Tamil Nadu Express</option>
              </select>
            </div>
            <div className="soundboard-param-col">
              <label className="form-label">Platform No.</label>
              <select className="form-input" defaultValue="2">
                <option value="1">Platform 1</option>
                <option value="2">Platform 2</option>
                <option value="3">Platform 3</option>
              </select>
            </div>
          </div>
        </div>

        <div className="soundboard-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" title="Play 4-Tone IR Station Chime Only">
              <span>🔔 Test Chime</span>
            </button>
            <button type="button" className="btn btn-secondary" style={{ borderColor: 'var(--rail-red)', color: 'var(--rail-red)' }}>
              <span>⏹️ Stop PA</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)', border: 'none', padding: '0.6rem 1.4rem', fontWeight: 700, boxShadow: '0 0 16px rgba(6,182,212,0.35)' }}>
              <span>🎙️ Broadcast Announcement Now</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
