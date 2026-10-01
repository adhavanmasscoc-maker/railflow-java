import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const ZONES = [
  { code: 'NR', name: 'Northern Railway', hq: 'New Delhi', divisions: ['Delhi', 'Ambala', 'Firozpur', 'Lucknow', 'Moradabad'], trains: 892, stations: 764, locos: ['WAP-7', 'WAP-5', 'WAG-12B'], color: '#ef4444' },
  { code: 'SR', name: 'Southern Railway', hq: 'Chennai', divisions: ['Chennai', 'Trichy', 'Madurai', 'Salem', 'Palakkad'], trains: 648, stations: 682, locos: ['WAP-7', 'WDM-3D', 'WAP-4'], color: '#10B981' },
  { code: 'WR', name: 'Western Railway', hq: 'Mumbai', divisions: ['Mumbai Central', 'Vadodara', 'Ratlam', 'Ahmedabad', 'Rajkot', 'Bhavnagar'], trains: 756, stations: 598, locos: ['WAP-7', 'WAP-5', 'WAG-9H'], color: '#3B82F6' },
  { code: 'ER', name: 'Eastern Railway', hq: 'Kolkata', divisions: ['Howrah', 'Sealdah', 'Asansol', 'Malda'], trains: 584, stations: 512, locos: ['WAP-7', 'WAP-4', 'WAG-7'], color: '#F59E0B' },
  { code: 'CR', name: 'Central Railway', hq: 'Mumbai CST', divisions: ['Mumbai', 'Bhusaval', 'Pune', 'Solapur', 'Nagpur'], trains: 703, stations: 625, locos: ['WAP-7', 'WCAM-3', 'WAG-12B'], color: '#8B5CF6' },
  { code: 'SCR', name: 'South Central Railway', hq: 'Secunderabad', divisions: ['Secunderabad', 'Hyderabad', 'Vijayawada', 'Guntakal', 'Guntur', 'Nanded'], trains: 492, stations: 538, locos: ['WAP-7', 'WDM-3A', 'WAP-4'], color: '#EC4899' },
  { code: 'SER', name: 'South Eastern Railway', hq: 'Kolkata', divisions: ['Adra', 'Chakradharpur', 'Kharagpur', 'Ranchi'], trains: 378, stations: 415, locos: ['WAP-7', 'WAG-9', 'WDM-3D'], color: '#06B6D4' },
  { code: 'NER', name: 'North Eastern Railway', hq: 'Gorakhpur', divisions: ['Izzatnagar', 'Lucknow NER', 'Varanasi'], trains: 312, stations: 387, locos: ['WDM-3A', 'WDP-4D', 'WAP-7'], color: '#14B8A6' },
  { code: 'SWR', name: 'South Western Railway', hq: 'Hubli', divisions: ['Hubli', 'Bangalore', 'Mysuru'], trains: 286, stations: 324, locos: ['WAP-7', 'WDP-4D', 'WDM-3A'], color: '#F97316' },
  { code: 'NFR', name: 'Northeast Frontier Railway', hq: 'Guwahati', divisions: ['Alipurduar', 'Katihar', 'Lumding', 'Rangiya', 'Tinsukia'], trains: 198, stations: 478, locos: ['WDP-4D', 'WDM-3A'], color: '#A855F7' },
  { code: 'ECR', name: 'East Central Railway', hq: 'Hajipur', divisions: ['Danapur', 'Dhanbad', 'Mughalsarai', 'Samastipur', 'Sonpur'], trains: 445, stations: 456, locos: ['WAP-7', 'WAP-4', 'WAG-7'], color: '#EF4444' },
  { code: 'WCR', name: 'West Central Railway', hq: 'Jabalpur', divisions: ['Bhopal', 'Jabalpur', 'Kota'], trains: 325, stations: 312, locos: ['WAP-7', 'WAP-4', 'WAG-9'], color: '#84CC16' },
  { code: 'NCR', name: 'North Central Railway', hq: 'Allahabad', divisions: ['Agra', 'Allahabad', 'Jhansi'], trains: 356, stations: 298, locos: ['WAP-7', 'WAP-5', 'WAG-12B'], color: '#0EA5E9' },
  { code: 'SECR', name: 'South East Central Railway', hq: 'Bilaspur', divisions: ['Bilaspur', 'Nagpur', 'Raipur'], trains: 267, stations: 289, locos: ['WAP-7', 'WAG-9H', 'WDM-3D'], color: '#D946EF' },
  { code: 'ECoR', name: 'East Coast Railway', hq: 'Bhubaneswar', divisions: ['Khurda Road', 'Sambalpur', 'Waltair'], trains: 312, stations: 345, locos: ['WAP-7', 'WAP-4', 'WAG-7'], color: '#FBBF24' },
  { code: 'NWR', name: 'North Western Railway', hq: 'Jaipur', divisions: ['Jaipur', 'Ajmer', 'Bikaner', 'Jodhpur'], trains: 278, stations: 367, locos: ['WDP-4D', 'WDM-3A', 'WAP-7'], color: '#22C55E' },
];

const ROLLING_STOCK = [
  { type: 'WAP-7', category: 'Electric Loco', power: '6,120 HP', maxSpeed: '140 km/h', builder: 'CLW Chittaranjan', count: 825, status: 95 },
  { type: 'WAP-5', category: 'Electric Loco', power: '6,000 HP', maxSpeed: '160 km/h', builder: 'CLW Chittaranjan', count: 68, status: 92 },
  { type: 'WAG-12B', category: 'Electric Loco', power: '12,000 HP', maxSpeed: '120 km/h', builder: 'Alstom/CLW', count: 120, status: 88 },
  { type: 'WDM-3D', category: 'Diesel Loco', power: '3,300 HP', maxSpeed: '120 km/h', builder: 'DLW Varanasi', count: 420, status: 78 },
  { type: 'WDP-4D', category: 'Diesel Loco', power: '4,500 HP', maxSpeed: '160 km/h', builder: 'DLW Varanasi', count: 230, status: 91 },
  { type: 'Vande Bharat', category: 'EMU Trainset', power: '8,000 HP', maxSpeed: '180 km/h', builder: 'ICF Chennai', count: 102, status: 98 },
  { type: 'LHB Coach', category: 'Passenger Coach', power: 'N/A', maxSpeed: '160 km/h', builder: 'RCF Kapurthala', count: 14200, status: 94 },
  { type: 'ICF Coach', category: 'Passenger Coach', power: 'N/A', maxSpeed: '110 km/h', builder: 'ICF Chennai', count: 28500, status: 72 },
];

export default function FleetPage() {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <section className="page-view active" id="page-fleet">
      <PageHeader
        systemCode="SYSTEM 10 // FLEET TOPOLOGY"
        title="Rolling Stock & Zonal Fleet Registry"
        subtitle="16 Railway Zones — Loco Classification & Rake Inventory"
        description="16 railway zones, locomotive classification tables, Vande Bharat trainsets, and LHB vs ICF rake inventories with maintenance health."
        badge="16 ZONES"
        badgeColor="emerald"
      />

      {/* Zone Selector Grid */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Railway Zones — Click to filter fleet</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
          {ZONES.map(z => (
            <div key={z.code} onClick={() => setSelectedZone(selectedZone?.code === z.code ? null : z)}
              style={{
                padding: '12px', background: selectedZone?.code === z.code ? 'var(--bg-hover)' : 'var(--bg-panel)',
                border: `1px solid ${selectedZone?.code === z.code ? z.color : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s ease',
                borderLeftWidth: '3px', borderLeftColor: z.color,
              }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{z.code}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{z.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{z.trains} trains · {z.stations} stns</div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Zone Detail */}
      {selectedZone && (
        <div style={{ padding: '20px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0 }}>{selectedZone.name} ({selectedZone.code})</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HQ: {selectedZone.hq}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-real">{selectedZone.trains} trains</span>
              <span className="badge nb-cyan">{selectedZone.stations} stations</span>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <strong>Divisions:</strong> {selectedZone.divisions.join(' · ')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong>Primary Locos:</strong> {selectedZone.locos.join(', ')}
          </div>
        </div>
      )}

      {/* Rolling Stock Classification Table */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Rolling Stock Classification &amp; Health</div>
      <div className="table-container">
        <table>
          <thead><tr>
            <th>Type</th><th>Category</th><th>Power</th><th>Max Speed</th><th>Builder</th><th>Fleet Count</th><th>Health %</th>
          </tr></thead>
          <tbody>
            {ROLLING_STOCK.map(rs => (
              <tr key={rs.type}>
                <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{rs.type}</td>
                <td>{rs.category}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{rs.power}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{rs.maxSpeed}</td>
                <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{rs.builder}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{rs.count.toLocaleString()}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${rs.status}%`, background: rs.status > 90 ? 'var(--color-success)' : rs.status > 80 ? 'var(--color-warning)' : 'var(--color-live)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: rs.status > 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>{rs.status}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
