import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const CATEGORIES = ['Bug Report', 'Feature Request', 'UI/UX Improvement', 'Performance Issue', 'Data Accuracy', 'Other'];

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: '', email: '', category: 'Bug Report', severity: 'medium', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [feedbackLog, setFeedbackLog] = useState([
    { id: 1, name: 'Adhavan', category: 'Feature Request', severity: 'high', message: 'Add live train GPS tracking overlay on the Network map', date: '2026-09-28', status: 'Under Review' },
    { id: 2, name: 'System', category: 'Bug Report', severity: 'low', message: 'Console clear command does not reset scroll position', date: '2026-09-30', status: 'Fixed' },
    { id: 3, name: 'Tester', category: 'Data Accuracy', severity: 'medium', message: 'Station code XYZ99 shows as unresolved in edge table', date: '2026-10-01', status: 'Acknowledged' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setFeedbackLog(prev => [
      { id: Date.now(), name: form.name || 'Anonymous', category: form.category, severity: form.severity, message: form.message, date: new Date().toISOString().slice(0, 10), status: 'New' },
      ...prev,
    ]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', category: 'Bug Report', severity: 'medium', message: '' });
  };

  return (
    <section className="page-view active" id="page-feedback">
      <PageHeader
        systemCode="SYSTEM 14 // USER FEEDBACK"
        title="Feedback & Issue Tracker"
        subtitle="Bug Reports, Feature Requests, and Data Accuracy"
        description="Submit bug reports, feature requests, and data accuracy concerns. All submissions are logged and tracked."
        badge="ACTIVE"
        badgeColor="emerald"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Submission Form */}
        <div style={{ padding: '20px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>Submit Feedback</div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input className="form-input" placeholder="Your name (optional)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="form-input" placeholder="Email (optional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['low', 'medium', 'high', 'critical'].map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, severity: s })}
                  className={`btn ${form.severity === s ? 'btn-ai-toggle' : ''}`}
                  style={{ flex: 1, fontSize: '11px', textTransform: 'capitalize', padding: '6px' }}>
                  {s}
                </button>
              ))}
            </div>
            <textarea
              className="form-input"
              placeholder="Describe the issue or suggestion in detail..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              rows={4}
              style={{ resize: 'vertical' }}
              required
            />
            <button type="submit" className="btn btn-ai-toggle" style={{ padding: '10px' }}>
              {submitted ? '✓ Submitted!' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        {/* Feedback Log */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Recent Submissions ({feedbackLog.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {feedbackLog.map(f => (
              <div key={f.id} style={{
                padding: '12px 16px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', borderLeftWidth: '3px',
                borderLeftColor: f.severity === 'critical' ? 'var(--color-live)' : f.severity === 'high' ? 'var(--color-warning)' : f.severity === 'medium' ? 'var(--color-info)' : 'var(--color-success)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px' }}>{f.name}</strong>
                    <span className="badge nb-cyan" style={{ fontSize: '10px' }}>{f.category}</span>
                  </div>
                  <span className={`badge ${f.status === 'Fixed' ? 'nb-green' : f.status === 'New' ? 'nb-amber' : 'nb-blue'}`} style={{ fontSize: '10px' }}>{f.status}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{f.message}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{f.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
