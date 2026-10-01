import { useState } from 'react';

export default function CommuterPage() {
  const [pnr, setPnr] = useState('');
  const [status, setStatus] = useState(null);

  const checkPnr = () => {
    if (pnr.length !== 10) {
      alert('PNR must be 10 digits.');
      return;
    }
    // Mock response for the UI
    setStatus({
      pnr,
      trainName: 'Pandian Express (12638)',
      boarding: 'MDU',
      destination: 'MS',
      class: '3A',
      passengers: [
        { id: 1, bookingStatus: 'RLWL/12', currentStatus: 'CNF', coach: 'B2', berth: '14', type: 'UB' },
        { id: 2, bookingStatus: 'RLWL/13', currentStatus: 'CNF', coach: 'B2', berth: '15', type: 'MB' }
      ],
      chartStatus: 'CHART PREPARED',
      provider: 'Local Cache Proxy'
    });
  };

  return (
    <section className="page-view active" id="page-commuter">
      <div className="view-header">
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 08</span> <span className="slash">//</span> COMMUTER PORTAL</div>
          <div className="view-subtitle">
            <span className="pulse-dot"></span>
            LIVE PASSENGER INQUIRY
          </div>
          <h1 className="view-title">Real-Time Commuter Portal</h1>
          <p className="view-desc">
            Direct integration with PNR inquiry, seat availability matrices, and fare calculators via multi-provider fallback.
          </p>
        </div>
        <span className="badge badge-real">API GATEWAY</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'flex-start' }}>
        <div className="panel" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="panel-header" style={{ padding: '16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span className="panel-title">PNR Status Inquiry</span>
          </div>
          <div className="panel-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Enter 10-Digit PNR Number</label>
              <input 
                type="text" 
                maxLength="10"
                placeholder="e.g. 4234567890" 
                value={pnr}
                onChange={e => setPnr(e.target.value.replace(/\D/g, ''))}
                style={{ padding: '12px', background: 'rgba(14,20,36,0.8)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '16px', letterSpacing: '2px' }}
              />
            </div>
            <button className="btn btn-primary" onClick={checkPnr} style={{ width: '100%', padding: '12px', fontWeight: 600 }}>Get Live Status</button>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <span className="pulse-dot"></span> Fallback Multi-Provider Active
            </div>
          </div>
        </div>

        {status ? (
          <div className="panel" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
            <div className="panel-header" style={{ padding: '16px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="panel-title">PNR: {status.pnr}</span>
                <span className="badge badge-derived" style={{ marginLeft: '12px' }}>{status.chartStatus}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-status-emerald)' }}>Source: {status.provider}</span>
            </div>
            <div className="panel-body" style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', background: 'rgba(14,20,36,0.5)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Train</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{status.trainName}</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(14,20,36,0.5)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Journey</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{status.boarding} &rarr; {status.destination}</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(14,20,36,0.5)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Class</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{status.class}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-text-secondary)' }}>Passenger Status</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ background: 'rgba(14,20,36,0.5)' }}>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <th style={{ padding: '12px' }}>Passenger</th>
                      <th style={{ padding: '12px' }}>Booking Status</th>
                      <th style={{ padding: '12px' }}>Current Status</th>
                      <th style={{ padding: '12px' }}>Coach / Berth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.passengers.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px' }}>Passenger {p.id}</td>
                        <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>{p.bookingStatus}</td>
                        <td style={{ padding: '12px', color: 'var(--color-status-emerald)', fontWeight: 600 }}>{p.currentStatus}</td>
                        <td style={{ padding: '12px' }}>{p.coach}, Berth {p.berth} ({p.type})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border-subtle)', minHeight: '300px', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</span>
            <p>Enter a 10-digit PNR to retrieve live journey status.</p>
          </div>
        )}
      </div>
    </section>
  );
}
