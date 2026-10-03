import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';

const COMMUTER_ARRIVALS = [
  { id: '12301', name: 'Howrah Rajdhani Express', from: 'NDLS', to: 'HWH', eta: '16:55', pf: 1, status: 'ON TIME', delay: 0, type: 'RAJDHANI', cls: ['1A', '2A', '3A'] },
  { id: '12638', name: 'Pandian Express', from: 'MAS', to: 'MDU', eta: '17:20', pf: 2, status: 'DELAYED', delay: 25, type: 'EXPRESS', cls: ['SL', '3A', '2A'] },
  { id: '12163', name: 'Chennai Express', from: 'PUNE', to: 'MAS', eta: '17:45', pf: 3, status: 'ON TIME', delay: 0, type: 'EXPRESS', cls: ['SL', '3A', '2A', '1A'] },
  { id: '20951', name: 'Vande Bharat Express', from: 'NDLS', to: 'BSB', eta: '18:10', pf: 1, status: 'ON TIME', delay: 0, type: 'VB', cls: ['EC', 'CC'] },
  { id: '12622', name: 'Tamil Nadu Superfast', from: 'NDLS', to: 'MAS', eta: '18:30', pf: 4, status: 'MINOR DELAY', delay: 7, type: 'SUPERFAST', cls: ['SL', '3A', '2A', '1A'] },
  { id: '22691', name: 'Rajdhani Express', from: 'HWH', to: 'BBS', eta: '19:00', pf: 5, status: 'ON TIME', delay: 0, type: 'RAJDHANI', cls: ['1A', '2A', '3A'] },
];

const COACH_LAYOUT = [
  { num: 1, cls: 'AC1', state: 'RESERVED', pax: 18, cap: 18, dir: 'Loco End (Engine)' },
  { num: 2, cls: 'AC2', state: 'NORMAL', pax: 42, cap: 46, dir: 'Towards Engine' },
  { num: 3, cls: 'AC2', state: 'NORMAL', pax: 44, cap: 46, dir: 'Towards Engine' },
  { num: 4, cls: 'AC3', state: 'FULL', pax: 72, cap: 72, dir: 'Towards Engine' },
  { num: 5, cls: 'AC3', state: 'NORMAL', pax: 61, cap: 72, dir: 'FOB Staircase Landing' },
  { num: 6, cls: 'AC3', state: 'NORMAL', pax: 58, cap: 72, dir: 'Mid-Platform' },
  { num: 7, cls: 'SL',  state: 'FULL', pax: 72, cap: 72, dir: 'Mid-Platform' },
  { num: 8, cls: 'SL',  state: 'NORMAL', pax: 64, cap: 72, dir: 'Mid-Platform' },
  { num: 9, cls: 'SL',  state: 'NORMAL', pax: 59, cap: 72, dir: 'Guard & Tail End' },
  { num: 10, cls: 'GEN', state: 'OVERFLOW', pax: 110, cap: 90, dir: 'Guard & Tail End' },
];

const PA_ANNOUNCEMENTS = [
  { lang: 'English', text: 'Attention passengers: The Pandian Express (Train No. 12638) arriving on Platform 2 will be 25 minutes late. Passengers are requested to wait in the waiting area.' },
  { lang: 'Tamil', text: 'பயணிகள் கவனத்திற்கு: பண்டியன் எக்ஸ்பிரஸ் (ரயில் எண் 12638) தளம் 2-ல் 25 நிமிடம் தாமதமாக வரும். பயணிகள் காத்திருக்கும் இடத்தில் காத்திருக்கவும்.' },
  { lang: 'Hindi', text: 'यात्रियों का ध्यान: पांडियन एक्सप्रेस (ट्रेन संख्या 12638) प्लेटफार्म 2 पर 25 मिनट देरी से आएगी। यात्रियों से अनुरोध है कि प्रतीक्षा क्षेत्र में प्रतीक्षा करें।' },
];

const statusColor = { 'ON TIME': '#10b981', 'DELAYED': '#ef4444', 'MINOR DELAY': '#f59e0b' };
const coachColor  = { RESERVED: '#38bdf8', NORMAL: '#10b981', FULL: '#f59e0b', OVERFLOW: '#ef4444' };

export default function CommuterPage() {
  const [selectedTrain, setSelectedTrain] = useState('12638');
  const [activeCoach, setActiveCoach] = useState(null);
  const [paLang, setPaLang] = useState('English');
  const [tick, setTick] = useState(0);
  const [clock, setClock] = useState(new Date().toLocaleTimeString('en-IN', { hour12: false }));
  
  const [pnr, setPnr] = useState('');
  const [pnrResult, setPnrResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handlePnrInput = (e) => {
    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPnr(sanitized);
  };

  const handleCheckStatus = (e) => {
    e.preventDefault();
    if (pnr.length !== 10) return;
    setIsSearching(true);
    setTimeout(() => {
      setPnrResult({
        pnr,
        trainNo: '12637',
        trainName: 'PANDIAN EXPRESS',
        source: 'MS',
        dest: 'MDU',
        bookingStatus: 'CNF',
        coach: 'B2',
        berth: '34',
        quota: 'GN',
        chartStatus: 'CHART NOT PREPARED'
      });
      setIsSearching(false);
    }, 600);
  };

  useEffect(() => {
    const iv = setInterval(() => {
      setClock(new Date().toLocaleTimeString('en-IN', { hour12: false }));
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const selectedArr = COMMUTER_ARRIVALS.find(t => t.id === selectedTrain);
  const activeAnnouncement = PA_ANNOUNCEMENTS.find(a => a.lang === paLang);

  return (
    <section className="page-view active" id="page-commuter">
      <PageHeader
        systemCode="SYSTEM 11 // COMMUTER PIS"
        title="Passenger Information System (PIS)"
        subtitle="Live Train Arrivals — Coach Position Guide & PA System"
        description="Passenger-facing display board: live arrival/departure boards, coach position compass, platform accessibility status, multi-lingual PA announcement system."
        extra={
          <>
            <span className="badge badge-simulated">PASSENGER PIS</span>
            <span className="badge" style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8' }}>LIVE: {clock}</span>
          </>
        }
      />

      {/* ─── PIS Arrival Board ─── */}
      <div style={{ background: '#0a0a0a', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(56,189,248,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f59e0b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🚉 Chennai Egmore (MS) — Arrival / Departure Board</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontSize: '13px', fontWeight: 800 }}>{clock} IST</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(56,189,248,0.15)' }}>
                {['TRAIN NO.', 'NAME', 'FROM', 'ETA', 'PF', 'COACHES', 'STATUS'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: '10px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMMUTER_ARRIVALS.map(t => (
                <tr key={t.id}
                  onClick={() => setSelectedTrain(t.id)}
                  style={{ borderBottom: '1px solid rgba(56,189,248,0.06)', background: selectedTrain === t.id ? 'rgba(56,189,248,0.07)' : 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}>
                  <td style={{ padding: '12px 14px', color: '#f59e0b', fontWeight: 700 }}>{t.id}</td>
                  <td style={{ padding: '12px 14px', color: '#e2e8f0', fontWeight: 600, fontSize: '12px' }}>{t.name}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '11px' }}>{t.from}</td>
                  <td style={{ padding: '12px 14px', color: '#e2e8f0', fontWeight: 700 }}>
                    {t.status === 'DELAYED' ? <span style={{ color: '#ef4444' }}>{t.eta} (+{t.delay}m)</span> : t.eta}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: 800, fontSize: '14px' }}>PF-{t.pf}</td>
                  <td style={{ padding: '12px 14px', fontSize: '11px', color: '#94a3b8' }}>{t.cls.join(' · ')}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: `${statusColor[t.status]}22`, color: statusColor[t.status], fontSize: '10px', fontWeight: 800, padding: '3px 9px', borderRadius: '3px' }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* ─── Coach Position Guide ─── */}
        <div style={{ background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '14px' }}>
            🚂 Coach Position Guide — Train {selectedTrain}
          </div>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '14px' }}>
            {COACH_LAYOUT.map(c => (
              <button key={c.num} onClick={() => setActiveCoach(activeCoach === c.num ? null : c.num)}
                title={`Coach ${c.num}: ${c.cls} — ${c.state}`}
                style={{ minWidth: '40px', height: '32px', borderRadius: '3px', border: `2px solid ${activeCoach === c.num ? '#fff' : coachColor[c.state]}`, background: `${coachColor[c.state]}22`, color: coachColor[c.state], fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                {c.num}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
            {[{ k: 'RESERVED', c: '#38bdf8' }, { k: 'NORMAL', c: '#10b981' }, { k: 'FULL', c: '#f59e0b' }, { k: 'OVERFLOW', c: '#ef4444' }].map(l => (
              <span key={l.k} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span style={{ width: '8px', height: '8px', background: l.c, borderRadius: '2px' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>{l.k}</span>
              </span>
            ))}
          </div>

          {activeCoach !== null && (() => {
            const c = COACH_LAYOUT.find(x => x.num === activeCoach);
            if (!c) return null;
            return (
              <div style={{ padding: '14px', background: 'rgba(14,20,36,0.8)', border: `1px solid ${coachColor[c.state]}44`, borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: coachColor[c.state] }}>Coach {c.num} ({c.cls})</span>
                  <span style={{ background: `${coachColor[c.state]}22`, color: coachColor[c.state], fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>{c.state}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>📍 {c.dir}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Occupancy: <strong style={{ color: coachColor[c.state] }}>{c.pax}/{c.cap}</strong></span>
                  <span style={{ color: 'var(--color-text-muted)' }}>Distance from FOB: <strong style={{ color: '#38bdf8' }}>{Math.abs(c.num - 5) * 23}m</strong></span>
                </div>
                {c.num <= 4 && (
                  <div style={{ marginTop: '8px', fontSize: '10px', color: '#f59e0b', background: 'rgba(245,158,11,0.08)', padding: '5px 8px', borderRadius: '4px' }}>
                    ⚠️ Bottleneck Zone: Near main FOB staircase. Consider coaches 6–9 for faster boarding.
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ─── PA Announcements ─── */}
        <div style={{ background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '14px' }}>
            🎙️ Multi-Lingual PA Announcement System
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {PA_ANNOUNCEMENTS.map(a => (
              <button key={a.lang} onClick={() => setPaLang(a.lang)}
                style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: `1px solid ${paLang === a.lang ? '#38bdf8' : 'rgba(148,163,184,0.15)'}`, background: paLang === a.lang ? 'rgba(56,189,248,0.12)' : 'transparent', color: paLang === a.lang ? '#38bdf8' : '#94a3b8', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {a.lang}
              </button>
            ))}
          </div>
          <div style={{ padding: '16px', background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.7 }}>
              {activeAnnouncement?.text}
            </div>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>Accessibility Status</div>
          {[
            { label: 'Lift / Elevator', status: 'OPERATIONAL', c: '#10b981' },
            { label: 'Wheelchair Ramp (PF-2)', status: 'DEPLOYED', c: '#10b981' },
            { label: 'Braille Signage', status: 'AVAILABLE', c: '#10b981' },
            { label: 'Hearing Loop (Concourse)', status: 'ACTIVE', c: '#10b981' },
            { label: 'FOB Staircase (Lift)', status: 'UNDER REPAIR', c: '#ef4444' },
          ].map(a => (
            <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(148,163,184,0.04)', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>{a.label}</span>
              <span style={{ color: a.c, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '10px' }}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* ─── PNR Status Inquiry ─── */}
      <div style={{ background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 'var(--radius-lg)', padding: '20px', marginTop: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🎟️</span> PNR Status Inquiry
        </h3>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              value={pnr}
              onChange={handlePnrInput}
              placeholder="e.g. 4234567890"
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg font-mono text-lg focus:outline-none focus:border-cyan-500 cursor-text relative z-10 pointer-events-auto select-auto"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{pnr.length}/10 digits</span>
              {pnr.length === 10 && <span className="text-emerald-400 font-semibold">Ready to query</span>}
            </div>
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={pnr.length !== 10 || isSearching}
              className="w-full mt-3 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {isSearching ? 'Querying Railway Gateway...' : 'Get Live Status'}
            </button>
          </div>
        </div>

        {pnrResult && (
          <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div><span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>PNR</span><div style={{ fontFamily: 'var(--font-mono)', color: '#e2e8f0', fontWeight: 700 }}>{pnrResult.pnr}</div></div>
              <div><span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>Train</span><div style={{ color: '#e2e8f0', fontWeight: 600 }}>{pnrResult.trainNo} - {pnrResult.trainName}</div></div>
              <div><span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>Source-Dest</span><div style={{ color: '#e2e8f0' }}>{pnrResult.source} → {pnrResult.dest}</div></div>
              <div><span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>Chart Status</span><div><span className="badge badge-real">{pnrResult.chartStatus}</span></div></div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#94a3b8' }}>Booking Status</th>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#94a3b8' }}>Coach/Berth</th>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#94a3b8' }}>Quota</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                  <td style={{ padding: '8px', color: '#e2e8f0' }}>{pnrResult.bookingStatus}</td>
                  <td style={{ padding: '8px', color: '#38bdf8', fontWeight: 600 }}>{pnrResult.coach}, {pnrResult.berth}</td>
                  <td style={{ padding: '8px', color: '#10b981', fontWeight: 700 }}>{pnrResult.quota}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
