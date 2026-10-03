import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';

const DISPATCH_CONTROLS = [
  {
    label: 'Line Clearance Override',
    desc: 'Force clear block section for emergency movement',
    status: 'ARMED',
    color: '#ef4444',
    icon: '🚨',
  },
  {
    label: 'Signal Control — NDLS Block',
    desc: 'Manual override: Green / Yellow / Red signal state',
    status: 'AUTO',
    color: '#10b981',
    icon: '🚦',
  },
  {
    label: 'Gate Metering — Concourse North',
    desc: 'Throttle turnstile flow to max 80 pax/min',
    status: 'OFF',
    color: '#94a3b8',
    icon: '🛡️',
  },
  {
    label: 'Priority Route Interlock — MAS PF-2',
    desc: 'Lock platform assignment for priority train',
    status: 'STANDBY',
    color: '#f59e0b',
    icon: '🔒',
  },
  {
    label: 'Clone Rake Deployment',
    desc: 'Deploy standby rake for relief operations',
    status: 'READY',
    color: '#38bdf8',
    icon: '🚆',
  },
  {
    label: 'Emergency PA Broadcast',
    desc: 'Trigger all-zone multi-lingual broadcast',
    status: 'STANDBY',
    color: '#8b5cf6',
    icon: '📢',
  },
];

const ACTIVE_INCIDENTS = [
  { id: 'INC-001', sev: 'CRITICAL', type: 'Platform Conflict', desc: '25m delay on MAS PF-2 causing Pandian Express overlap', action: 'Heuristic Reallocate', resolved: false },
  { id: 'INC-002', sev: 'WARNING',  type: 'Crowd Surge',     desc: 'FOB-2 Staircase: 2.1 pax/m² at MS Concourse', action: 'Gate Metering', resolved: false },
  { id: 'INC-003', sev: 'WARNING',  type: 'Signal Delay',    desc: 'NX-3 signal malfunction at MAS South Throat', action: 'Manual Override', resolved: false },
  { id: 'INC-004', sev: 'INFO',     type: 'Maintenance Alert', desc: 'WDM-3D #0419 coolant low at ERN Shed', action: 'Dispatch Engineer', resolved: true },
];

const INTERLOCK_MATRIX = [
  { block: 'NDLS–AGC', signal: 'GREEN', headway: '8 min', kavach: 'ACTIVE', train: '12301 Rajdhani' },
  { block: 'MAS–TBM',  signal: 'RED',   headway: 'HOLD',   kavach: 'ACTIVE', train: '12638 Pandian' },
  { block: 'HWH–BBS',  signal: 'GREEN', headway: '12 min', kavach: 'ACTIVE', train: '22691 Rajdhani' },
  { block: 'CNB–ALD',  signal: 'YELLOW', headway: '5 min', kavach: 'CAUTION', train: '12163 Express' },
  { block: 'PUNE–SC',  signal: 'GREEN', headway: '15 min', kavach: 'ACTIVE', train: '11301 Udyan' },
];

const sevColor = { CRITICAL: '#ef4444', WARNING: '#f59e0b', INFO: '#10b981' };
const sigColor = { GREEN: '#10b981', YELLOW: '#f59e0b', RED: '#ef4444' };

export default function CommanderPage() {
  const [controls, setControls] = useState(DISPATCH_CONTROLS.map((c, i) => ({ ...c, active: false, id: i })));
  const [incidents, setIncidents] = useState(ACTIVE_INCIDENTS);
  const [actionLog, setActionLog] = useState([
    { t: '14:24:10', msg: '[COMMANDER] PriorityQueue reallocation: PF-2 → PF-3 (MS). Conflict resolved.', c: '#10b981' },
    { t: '14:22:50', msg: '[SIGNAL] Manual override issued: NDLS Block CLEAR. Speed auth: 130 km/h.', c: '#38bdf8' },
    { t: '14:20:00', msg: '[CROWD] Gate metering ENGAGED: Concourse North — 80 pax/min throttle.', c: '#f59e0b' },
    { t: '14:18:30', msg: '[DISPATCH] Clone rake deployed from RDB Yard. ETA: 35 minutes.', c: '#8b5cf6' },
  ]);

  const toggleControl = (id) => {
    setControls(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newActive = !c.active;
      setActionLog(log => [{
        t: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        msg: `[COMMANDER] ${c.label}: ${newActive ? 'ENGAGED' : 'DISENGAGED'} by operator.`,
        c: newActive ? c.color : '#94a3b8',
      }, ...log].slice(0, 12));
      return { ...c, active: newActive };
    }));
  };

  const resolveIncident = (id) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, resolved: true } : inc));
    setActionLog(log => [{
      t: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      msg: `[INCIDENT] ${id} resolved and closed by commander.`,
      c: '#10b981',
    }, ...log].slice(0, 12));
  };

  return (
    <section className="page-view active" id="page-commander">
      <PageHeader
        systemCode="SYSTEM 09 // EMERGENCY COMMANDER"
        title="Emergency Command Dispatch & Interlock Control"
        subtitle="Central Operations Control — Manual Signal & Platform Override"
        description="Mission-critical emergency command interface for train controllers. Issues manual signal overrides, platform reallocation commands, gate metering, and clone rake deployments."
        extra={
          <>
            <span className="badge badge-real">LIVE DISPATCH</span>
            <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>KAVACH TCAS ARMED</span>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        {/* Left: Dispatch Controls */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Dispatch & Override Controls</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {controls.map(c => (
              <div key={c.id} style={{ padding: '14px 16px', background: 'rgba(14,20,36,0.9)', border: `1px solid ${c.active ? c.color : 'rgba(148,163,184,0.08)'}`, borderRadius: 'var(--radius-lg)', borderLeft: `3px solid ${c.active ? c.color : 'rgba(148,163,184,0.2)'}`, transition: 'border-color 0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px' }}>{c.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#e2e8f0' }}>{c.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{c.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: c.active ? c.color : '#94a3b8', background: c.active ? `${c.color}22` : 'rgba(148,163,184,0.08)', padding: '2px 7px', borderRadius: '3px' }}>{c.active ? 'ACTIVE' : c.status}</span>
                    <button onClick={() => toggleControl(c.id)}
                      style={{ width: '46px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: c.active ? c.color : 'rgba(148,163,184,0.2)', transition: 'background 0.3s', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '3px', left: c.active ? '24px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left 0.3s' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Log */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>COC Live Action Log</div>
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-md)', padding: '12px', maxHeight: '200px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            {actionLog.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', opacity: 1 - i * 0.07 }}>
                <span style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{l.t}</span>
                <span style={{ color: l.c }}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Incidents + Interlock Matrix */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Active Incidents ({incidents.filter(i => !i.resolved).length} Open)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {incidents.map(inc => (
              <div key={inc.id} style={{ padding: '14px 16px', background: inc.resolved ? 'rgba(16,185,129,0.04)' : 'rgba(14,20,36,0.9)', border: `1px solid ${inc.resolved ? 'rgba(16,185,129,0.15)' : sevColor[inc.sev] + '22'}`, borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${inc.resolved ? '#10b981' : sevColor[inc.sev]}`, opacity: inc.resolved ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: sevColor[inc.sev], background: `${sevColor[inc.sev]}22`, padding: '1px 6px', borderRadius: '2px' }}>{inc.sev}</span>
                      <span style={{ fontWeight: 700, fontSize: '12px', color: '#e2e8f0' }}>{inc.type}</span>
                      <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{inc.id}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{inc.desc}</div>
                    <div style={{ fontSize: '10px', color: '#38bdf8', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>Recommended Action: {inc.action}</div>
                  </div>
                  {!inc.resolved ? (
                    <button onClick={() => resolveIncident(inc.id)} className="btn btn-secondary" style={{ fontSize: '10px', padding: '4px 10px', flexShrink: 0 }}>✓ Resolve</button>
                  ) : (
                    <span style={{ fontSize: '9px', color: '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>✓ CLOSED</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Block Interlock Matrix */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>Signal Block Interlock Matrix</div>
          <div style={{ background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                  {['BLOCK', 'SIGNAL', 'HEADWAY', 'KAVACH', 'TRAIN'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INTERLOCK_MATRIX.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.04)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#e2e8f0' }}>{m.block}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: `${sigColor[m.signal]}22`, color: sigColor[m.signal], fontWeight: 700, padding: '2px 8px', borderRadius: '3px', fontSize: '9px' }}>{m.signal}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: m.headway === 'HOLD' ? '#ef4444' : '#94a3b8' }}>{m.headway}</td>
                    <td style={{ padding: '10px 12px', color: m.kavach === 'ACTIVE' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{m.kavach}</td>
                    <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '10px' }}>{m.train}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
