import { useState, useEffect } from 'react';
import { api } from '../services/api';
import audioEngine from '../services/audioEngine';

export default function PnrModal({ isOpen, onClose }) {
  const [pnr, setPnr] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const maskPnr = (p) => p.length >= 10 ? p.slice(0, 3) + '****' + p.slice(7) : p;

  const lookup = async () => {
    if (pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
      setError('Please enter a valid 10-digit PNR number');
      audioEngine.playError();
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await api.getPnr(pnr);
      audioEngine.playChime();
      setResult(data);
    } catch {
      // Offline mock
      audioEngine.playChime();
      setResult({
        pnr: maskPnr(pnr),
        trainNumber: '12622',
        trainName: 'Tamil Nadu Express',
        boardingStation: 'NDLS (New Delhi)',
        destinationStation: 'MAS (Chennai Central)',
        dateOfJourney: new Date().toLocaleDateString('en-IN'),
        chartStatus: 'PREPARED',
        passengers: [
          { number: 1, bookingStatus: 'S4/32/SL', currentStatus: 'CNF S4/32/SL', coach: 'S4', berth: 32, berthType: 'SL' },
          { number: 2, bookingStatus: 'S4/35/UB', currentStatus: 'CNF S4/35/UB', coach: 'S4', berth: 35, berthType: 'UB' },
        ],
        _note: 'Mock response — live PNR endpoint unreachable',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 10004,
      display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', width: '90%', maxWidth: '500px', maxHeight: '80vh',
        overflow: 'auto', position: 'relative', top: 'auto', left: 'auto', transform: 'none', display: 'block',
      }}>
        <div className="modal-header" style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🎟️</span>
            <strong>PNR Status Inquiry</strong>
          </div>
          <button onClick={onClose} className="modal-close" style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            fontSize: '20px', cursor: 'pointer',
          }}>✕</button>
        </div>
        <div className="modal-body" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pnr}
              onChange={(e) => setPnr(e.target.value.replace(/\D/g, '').slice(0, 10))}
              onKeyDown={(e) => e.key === 'Enter' && lookup()}
              placeholder="Enter 10-digit PNR…"
              className="form-input"
              style={{ flex: 1, letterSpacing: '2px', fontFamily: 'var(--font-mono)', fontSize: '16px' }}
              maxLength={10}
              autoFocus
              autoComplete="off"
            />
            <button onClick={lookup} className="btn btn-ai-toggle" disabled={loading} style={{ padding: '8px 20px' }}>
              {loading ? '...' : 'Check'}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{pnr.length}/10 digits entered</span>
            {pnr.length === 10 && <span style={{ color: 'var(--color-status-emerald)' }}>✓ Ready to check</span>}
          </div>
          {error && <div style={{ color: 'var(--color-live)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
          {result && (
            <div style={{ fontSize: '13px', lineHeight: 1.7 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>PNR:</span> <strong>{result.pnr}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Train:</span> <strong>{result.trainNumber} {result.trainName}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>From:</span> {result.boardingStation}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>To:</span> {result.destinationStation}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Date:</span> {result.dateOfJourney}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Chart:</span> <span className="badge badge-real">{result.chartStatus}</span></div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: 'var(--bg-app)' }}>
                  <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>#</th>
                  <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>Booking</th>
                  <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>Current</th>
                  <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>Coach</th>
                </tr></thead>
                <tbody>
                  {result.passengers?.map((p) => (
                    <tr key={p.number}>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>{p.number}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>{p.bookingStatus}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>{p.currentStatus}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>{p.coach}/{p.berth} ({p.berthType})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result._note && <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>⚠️ {result._note}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
