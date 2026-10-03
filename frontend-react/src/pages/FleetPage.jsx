import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';

const FLEET_ZONES = [
  {
    zone: 'Southern Railway (SR)', code: 'SR', hq: 'Chennai', trains: 840,
    locos: [
      { cls: 'WAP-7', count: 42, health: 94, type: 'Electric', klass: 'Express' },
      { cls: 'WAG-9', count: 28, health: 88, type: 'Electric', klass: 'Goods' },
      { cls: 'WDM-3D', count: 15, health: 72, type: 'Diesel', klass: 'Mixed' },
    ],
  },
  {
    zone: 'Northern Railway (NR)', code: 'NR', hq: 'New Delhi', trains: 1240,
    locos: [
      { cls: 'WAP-5', count: 38, health: 91, type: 'Electric', klass: 'Rajdhani' },
      { cls: 'WAP-7', count: 56, health: 89, type: 'Electric', klass: 'Express' },
      { cls: 'WDP-4D', count: 22, health: 76, type: 'Diesel', klass: 'Express' },
    ],
  },
  {
    zone: 'Central Railway (CR)', code: 'CR', hq: 'Mumbai CSMT', trains: 870,
    locos: [
      { cls: 'WAP-7', count: 48, health: 92, type: 'Electric', klass: 'Express' },
      { cls: 'EMU/MEMU', count: 124, health: 85, type: 'Electric', klass: 'Suburban' },
    ],
  },
  {
    zone: 'Western Railway (WR)', code: 'WR', hq: 'Mumbai', trains: 1120,
    locos: [
      { cls: 'WAP-4', count: 34, health: 78, type: 'Electric', klass: 'Express' },
      { cls: 'WAG-7', count: 44, health: 82, type: 'Electric', klass: 'Goods' },
    ],
  },
];

const ROLLING_STOCK = [
  { id: 'LHB-001', type: 'LHB Coach (AC 2T)', zone: 'SR', status: 'IN SERVICE', health: 96, overhaul_due: '2027-Mar', maint: 'DONE' },
  { id: 'LHB-002', type: 'LHB Coach (AC 3T)', zone: 'NR', status: 'IN SERVICE', health: 91, overhaul_due: '2027-Jun', maint: 'DONE' },
  { id: 'ICF-034', type: 'ICF Sleeper (SL)',   zone: 'CR', status: 'IN SERVICE', health: 74, overhaul_due: '2026-Nov', maint: 'DUE' },
  { id: 'EMU-112', type: 'EMU Motor Coach',    zone: 'WR', status: 'IN SERVICE', health: 83, overhaul_due: '2027-Jan', maint: 'DONE' },
  { id: 'DEMU-07', type: 'DEMU Trailer Coach', zone: 'SR', status: 'OVERHAUL',   health: 52, overhaul_due: '2026-Oct', maint: 'IN PROGRESS' },
  { id: 'VB-001',  type: 'Vande Bharat (EC)',  zone: 'NR', status: 'IN SERVICE', health: 99, overhaul_due: '2028-Apr', maint: 'DONE' },
  { id: 'VB-002',  type: 'Vande Bharat (EC)',  zone: 'SR', status: 'IN SERVICE', health: 97, overhaul_due: '2028-Jun', maint: 'DONE' },
  { id: 'WDM-019', type: 'WDM-3D Locomotive',  zone: 'ER', status: 'STANDBY',   health: 68, overhaul_due: '2026-Dec', maint: 'SCHEDULED' },
];

const MAINTENANCE_LOG = [
  { id: 'MNT-2024-001', unit: 'WDM-3D #0419', shed: 'Ernakulam Shed', type: 'Scheduled POH', due: '2026-Oct-10', status: 'OVERDUE', priority: 'HIGH' },
  { id: 'MNT-2024-002', unit: 'WAP-7 #30212', shed: 'BRC Loco Shed', type: 'Trip Schedule (TS)', due: '2026-Oct-15', status: 'SCHEDULED', priority: 'MEDIUM' },
  { id: 'MNT-2024-003', unit: 'LHB AC-2T #21892', shed: 'ICF Workshop', type: 'POH Overhaul', due: '2026-Nov-01', status: 'SCHEDULED', priority: 'MEDIUM' },
  { id: 'MNT-2024-004', unit: 'EMU Motor #MR-112', shed: 'Virar Car Shed', type: 'Monthly Schedule', due: '2026-Oct-05', status: 'COMPLETED', priority: 'LOW' },
  { id: 'MNT-2024-005', unit: 'Vande Bharat #VB-22', shed: 'RCF Kapurthala', type: 'Annual Maintenance', due: '2027-Apr-12', status: 'PLANNED', priority: 'LOW' },
];

const healthColor = (h) => h >= 90 ? '#10b981' : h >= 70 ? '#f59e0b' : '#ef4444';
const statusColor = { 'IN SERVICE': '#10b981', 'OVERHAUL': '#f59e0b', 'STANDBY': '#38bdf8', 'CRITICAL': '#ef4444' };

export default function FleetPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedZone, setSelectedZone] = useState('SR');

  const activeZone = FLEET_ZONES.find(z => z.code === selectedZone);

  return (
    <section className="page-view active" id="page-fleet">
      <PageHeader
        systemCode="SYSTEM 10 // FLEET TOPOLOGY"
        title="Rolling Stock Fleet Topology & Health Registry"
        subtitle="16 Zones — Loco Shed Management & POH Overhaul Tracking"
        description="Comprehensive fleet management system tracking all locomotive classes, rolling stock health metrics, periodic overhaul cycles, and maintenance schedules across 18 zonal railways."
        extra={
          <>
            <span className="badge badge-real">16 ZONES</span>
            <span className="badge badge-derived">LOCO REGISTRY</span>
          </>
        }
      />

      {/* ─── Tab Bar ─── */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(14,20,36,0.8)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(148,163,184,0.08)', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { k: 'overview', label: '🚂 Zone Overview' },
          { k: 'stock', label: '📋 Rolling Stock' },
          { k: 'maintenance', label: '🔧 Maintenance Log' },
        ].map(t => (
          <button key={t.k} onClick={() => setActiveTab(t.k)}
            style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === t.k ? '#38bdf8' : 'transparent', color: activeTab === t.k ? '#000' : 'var(--color-text-secondary)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Zone selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {FLEET_ZONES.map(z => (
              <button key={z.code} onClick={() => setSelectedZone(z.code)}
                style={{ padding: '6px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${selectedZone === z.code ? '#38bdf8' : 'rgba(148,163,184,0.15)'}`, background: selectedZone === z.code ? 'rgba(56,189,248,0.1)' : 'rgba(14,20,36,0.8)', color: selectedZone === z.code ? '#38bdf8' : '#94a3b8', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                {z.code}
              </button>
            ))}
          </div>

          {activeZone && (
            <>
              <div style={{ padding: '16px 20px', background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#e2e8f0' }}>{activeZone.zone}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>HQ: {activeZone.hq} &bull; {activeZone.trains.toLocaleString()} Active Train Services</div>
                  </div>
                  <span className="badge badge-real">{activeZone.code} ZONE</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {activeZone.locos.map((loco, i) => (
                  <div key={i} style={{ padding: '18px', background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', borderTop: `3px solid ${healthColor(loco.health)}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '18px', color: '#38bdf8' }}>{loco.cls}</span>
                      <span style={{ background: loco.type === 'Electric' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: loco.type === 'Electric' ? '#10b981' : '#f59e0b', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>{loco.type}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>UNITS IN SERVICE</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '22px', color: '#e2e8f0' }}>{loco.count}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>FLEET CLASS</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>{loco.klass}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Fleet Health Index</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: healthColor(loco.health), fontWeight: 700 }}>{loco.health}%</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(148,163,184,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${loco.health}%`, background: healthColor(loco.health), borderRadius: '4px', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'stock' && (
        <div style={{ background: 'rgba(14,20,36,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'rgba(14,20,36,0.95)', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  {['UNIT ID', 'TYPE', 'ZONE', 'HEALTH', 'STATUS', 'OVERHAUL DUE', 'MAINT'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROLLING_STOCK.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.04)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>{s.id}</td>
                    <td style={{ padding: '12px 14px', color: '#e2e8f0' }}>{s.type}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{s.zone}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '5px', background: 'rgba(148,163,184,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${s.health}%`, background: healthColor(s.health), borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: healthColor(s.health), fontWeight: 700 }}>{s.health}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: `${statusColor[s.status] || '#94a3b8'}22`, color: statusColor[s.status] || '#94a3b8', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>{s.status}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{s.overhaul_due}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: s.maint === 'DONE' ? '#10b981' : s.maint === 'DUE' ? '#ef4444' : '#f59e0b', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{s.maint}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MAINTENANCE_LOG.map((m, i) => (
            <div key={i} style={{ padding: '16px 20px', background: 'rgba(14,20,36,0.9)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 'var(--radius-lg)', borderLeft: `3px solid ${m.status === 'OVERDUE' ? '#ef4444' : m.status === 'COMPLETED' ? '#10b981' : '#f59e0b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#38bdf8' }}>{m.id}</span>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#e2e8f0' }}>{m.unit}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{m.type} &bull; Shed: {m.shed} &bull; Due: {m.due}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ background: m.priority === 'HIGH' ? 'rgba(239,68,68,0.12)' : m.priority === 'MEDIUM' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)', color: m.priority === 'HIGH' ? '#ef4444' : m.priority === 'MEDIUM' ? '#f59e0b' : '#10b981', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>{m.priority}</span>
                  <span style={{ background: m.status === 'OVERDUE' ? 'rgba(239,68,68,0.12)' : m.status === 'COMPLETED' ? 'rgba(16,185,129,0.12)' : 'rgba(56,189,248,0.12)', color: m.status === 'OVERDUE' ? '#ef4444' : m.status === 'COMPLETED' ? '#10b981' : '#38bdf8', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>{m.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
