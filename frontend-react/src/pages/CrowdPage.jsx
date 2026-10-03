import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';

const CROWD_STATIONS = [
  {
    code: 'MS', name: 'Chennai Egmore', platforms: [
      { pf: 1, name: 'PF-1 (Rockfort Exp)', load: 78, fob: 1.8, status: 'HIGH',     metered: false },
      { pf: 2, name: 'PF-2 (Pandian Exp)',  load: 46, fob: 0.9, status: 'NORMAL',   metered: false },
      { pf: 3, name: 'PF-3 (Vaigai Exp)',   load: 24, fob: 0.4, status: 'NORMAL',   metered: false },
      { pf: 4, name: 'PF-4 (Shatabdi)',     load: 61, fob: 1.2, status: 'MODERATE', metered: false },
    ],
    total_footfall: 18450, inflow: 127, egress: 'CLEAR', concourse: 48,
  },
  {
    code: 'MAS', name: 'Chennai Central', platforms: [
      { pf: 1, name: 'PF-1 (Rajdhani)',     load: 82, fob: 2.1, status: 'HIGH',     metered: false },
      { pf: 2, name: 'PF-2 (Grand Trunk)',  load: 91, fob: 2.8, status: 'CRITICAL', metered: false },
      { pf: 3, name: 'PF-3 (Mail Express)', load: 54, fob: 1.0, status: 'MODERATE', metered: false },
    ],
    total_footfall: 24200, inflow: 182, egress: 'CONGESTED', concourse: 71,
  },
  {
    code: 'NDLS', name: 'New Delhi', platforms: [
      { pf: 1, name: 'PF-1 (Shatabdi)',     load: 68, fob: 1.4, status: 'MODERATE', metered: false },
      { pf: 4, name: 'PF-4 (Rajdhani 2)',   load: 84, fob: 2.2, status: 'HIGH',     metered: false },
      { pf: 8, name: 'PF-8 (Duronto)',      load: 41, fob: 0.7, status: 'NORMAL',   metered: false },
    ],
    total_footfall: 32000, inflow: 240, egress: 'CLEAR', concourse: 69,
  },
];

const FOOTFALL_TIMELINE = [
  { hour: '06:00', pax: 2200 }, { hour: '07:00', pax: 5800 }, { hour: '08:00', pax: 9400 },
  { hour: '09:00', pax: 7200 }, { hour: '10:00', pax: 4100 }, { hour: '11:00', pax: 3200 },
  { hour: '12:00', pax: 3800 }, { hour: '13:00', pax: 4200 }, { hour: '14:00', pax: 5100 },
  { hour: '15:00', pax: 6200 }, { hour: '16:00', pax: 7800 }, { hour: '17:00', pax: 9600 },
  { hour: '18:00', pax: 11200 }, { hour: '19:00', pax: 8400 }, { hour: '20:00', pax: 5400 },
];

const loadColor = (pct) => pct >= 80 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981';
const loadLabel = (pct) => pct >= 80 ? 'HIGH' : pct >= 60 ? 'MODERATE' : 'NORMAL';
const fobColor  = (v) => v >= 2.5 ? '#ef4444' : v >= 1.8 ? '#f59e0b' : '#10b981';

export default function CrowdPage() {
  const [stations, setStations] = useState(CROWD_STATIONS);
  const [activeStation, setActiveStation] = useState('MS');
  const [tick, setTick] = useState(0);
  const [strobeActive, setStrobeActive] = useState(false);
  const [meteringLocks, setMeteringLocks] = useState({});

  // Live crowd simulation
  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1);
      setStations(prev => prev.map(stn => ({
        ...stn,
        total_footfall: Math.max(5000, stn.total_footfall + Math.floor(Math.random() * 200 - 80)),
        inflow: Math.max(40, stn.inflow + Math.floor(Math.random() * 20 - 8)),
        concourse: Math.min(100, Math.max(20, stn.concourse + (Math.random() * 4 - 2))),
        platforms: stn.platforms.map(pf => {
          const newLoad = Math.min(100, Math.max(5, pf.load + (Math.random() * 6 - 2.5)));
          const newFob = parseFloat(Math.min(3.5, Math.max(0.2, pf.fob + (Math.random() * 0.3 - 0.15))).toFixed(1));
          return { ...pf, load: Math.round(newLoad), fob: newFob, status: loadLabel(newLoad) };
        }),
      })));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  // Strobe check
  useEffect(() => {
    const hasCritical = stations.some(stn => stn.platforms.some(pf => pf.fob >= 2.5));
    setStrobeActive(hasCritical);
  }, [stations, tick]);

  const activeStn = stations.find(s => s.code === activeStation);

  const toggleMetering = (code, pfNum) => {
    setMeteringLocks(prev => ({ ...prev, [`${code}-${pfNum}`]: !prev[`${code}-${pfNum}`] }));
  };

  const maxFootfall = Math.max(...FOOTFALL_TIMELINE.map(d => d.pax));

  return (
    <section className="page-view active" id="page-crowd">
      <PageHeader
        systemCode="SYSTEM 08 // CROWD MONITORING"
        title="Station Crowd & Platform Density Telemetry"
        subtitle="Real-Time Crush Load Detection & Gate Metering Control"
        description="Live crowd monitoring via ScheduledExecutorService 4,000ms tick cycle, FOB staircase density indices, concourse inflow metering, and stampede hazard alerts."
        extra={
          <>
            <span className="badge badge-simulated">4000ms SIM LOOP</span>
            <span className="badge badge-real">KAVACH TCAS</span>
          </>
        }
      />

      {/* ─── Stampede Strobe Banner ─── */}
      {strobeActive && (
        <div style={{ marginBottom: '16px', padding: '14px 20px', background: 'rgba(239,68,68,0.12)', border: '2px solid #ef4444', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>🚨</span>
            <div>
              <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '13px' }}>STAMPEDE HAZARD ALERT</div>
              <div style={{ fontSize: '11px', color: '#fca5a5' }}>Vertical Chokepoint (FOB Staircase) exceeded 2.5 pax/m²! ACTION MANDATED: HOLD INFLOW AT CONCOURSE GATES.</div>
            </div>
          </div>
          <button onClick={() => setStrobeActive(false)} className="btn btn-secondary" style={{ fontSize: '11px', padding: '5px 14px', borderColor: '#ef4444' }}>Acknowledge Hold</button>
        </div>
      )}

      {/* ─── Station Selector Pills ─── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {stations.map(s => {
          const hasCrit = s.platforms.some(pf => pf.load >= 80 || pf.fob >= 2.0);
          return (
            <button key={s.code} onClick={() => setActiveStation(s.code)}
              style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${activeStation === s.code ? '#38bdf8' : 'rgba(148,163,184,0.15)'}`, background: activeStation === s.code ? 'rgba(56,189,248,0.12)' : 'rgba(14,20,36,0.8)', color: activeStation === s.code ? '#38bdf8' : '#94a3b8', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {s.code}
              {hasCrit && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />}
            </button>
          );
        })}
      </div>

      {activeStn && (
        <>
          {/* ─── Station Overview KPIs ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Footfall', val: activeStn.total_footfall.toLocaleString(), unit: 'pax', color: '#38bdf8' },
              { label: 'Turnstile Inflow', val: `${activeStn.inflow}`, unit: 'pax/min', color: activeStn.inflow > 180 ? '#ef4444' : '#10b981' },
              { label: 'Concourse Load', val: `${Math.round(activeStn.concourse)}%`, unit: '', color: loadColor(activeStn.concourse) },
              { label: 'Egress Status', val: activeStn.egress, unit: '', color: activeStn.egress === 'CLEAR' ? '#10b981' : '#ef4444' },
            ].map(k => (
              <div key={k.label} style={{ padding: '14px', background: 'rgba(14,20,36,0.9)', border: `1px solid ${k.color}22`, borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{k.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '22px', color: k.color }}>{k.val}</div>
                {k.unit && <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{k.unit}</div>}
              </div>
            ))}
          </div>

          {/* ─── Platform Cards Grid ─── */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Platform Crowd Density — {activeStn.name} ({activeStn.code}) • Tick #{tick + 1}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {activeStn.platforms.map(pf => {
              const meteringKey = `${activeStn.code}-${pf.pf}`;
              const isMetered = meteringLocks[meteringKey];
              return (
                <div key={pf.pf} style={{ padding: '16px', background: 'rgba(14,20,36,0.9)', border: `1px solid ${loadColor(pf.load)}22`, borderRadius: 'var(--radius-lg)', borderLeft: `3px solid ${loadColor(pf.load)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '14px', color: '#e2e8f0' }}>PF-{pf.pf}</span>
                    <span style={{ background: `${loadColor(pf.load)}22`, color: loadColor(pf.load), fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>{pf.status}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>{pf.name}</div>
                  
                  {/* Platform load bar */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Platform Occupancy</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: loadColor(pf.load), fontWeight: 700 }}>{pf.load}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(148,163,184,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pf.load}%`, background: loadColor(pf.load), borderRadius: '4px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>

                  {/* FOB density */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>FOB Staircase</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: fobColor(pf.fob) }}>
                      {pf.fob} pax/m² {pf.fob >= 2.5 ? '🚨' : pf.fob >= 1.8 ? '⚠️' : '✅'}
                    </span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(148,163,184,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (pf.fob / 3.5) * 100)}%`, background: fobColor(pf.fob), borderRadius: '2px', transition: 'width 0.5s ease' }} />
                  </div>
                  
                  <button onClick={() => toggleMetering(activeStn.code, pf.pf)}
                    className={isMetered ? 'btn btn-danger' : 'btn btn-secondary'}
                    style={{ fontSize: '10px', padding: '5px 12px', width: '100%' }}>
                    {isMetered ? '🛡️ METERING ACTIVE — Release' : '🛡️ Engage Gate Metering'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ─── Footfall Timeline Chart ─── */}
          <div style={{ background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>Daily Footfall Trend — {activeStn.name}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', overflowX: 'auto' }}>
              {FOOTFALL_TIMELINE.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '44px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>{(d.pax / 1000).toFixed(1)}k</span>
                  <div style={{ width: '100%', background: d.pax >= 9000 ? '#ef4444' : d.pax >= 6000 ? '#f59e0b' : '#38bdf8', borderRadius: '3px 3px 0 0', height: `${(d.pax / maxFootfall) * 90}%`, opacity: 0.85, transition: 'height 0.4s' }} />
                  <span style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>{d.hour.slice(0, 5)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
