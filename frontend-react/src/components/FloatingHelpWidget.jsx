import { useState } from 'react';

export default function FloatingHelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Mini Help & Feedback Widget (Bottom-Right) */}
      <button 
        className="floating-help-btn" 
        id="btnFloatingHelp" 
        aria-label="Open Help & Feedback" 
        title="Help & Feedback • AKNEX Telemetry"
        onClick={toggleOpen}
      >
        <span className="help-pulse"></span>
        <span style={{ fontSize: '0.95rem' }}>🎧</span>
        <span>Help &amp; Feedback</span>
      </button>

      {/* Floating Help & Feedback Modal */}
      {isOpen && (
        <>
          <div className="floating-help-modal-backdrop" style={{ display: 'block' }} onClick={() => setIsOpen(false)}></div>
          <div className="floating-help-modal" style={{ display: 'block' }} role="dialog" aria-labelledby="helpModalTitle" aria-modal="true">
            <div className="help-modal-header">
              <h4 id="helpModalTitle">
                <span style={{ color: 'var(--rail-red)' }}>🚆</span>
                <span>Operations Help &amp; Telemetry Feedback</span>
              </h4>
              <button className="help-modal-close" onClick={() => setIsOpen(false)} aria-label="Close modal">&times;</button>
            </div>
            <div className="help-modal-body">
              <div>
                <label className="help-field-label" htmlFor="helpFeedbackCategory">Feedback / Issue Category</label>
                <select className="help-select" id="helpFeedbackCategory" defaultValue="General Feedback">
                  <option value="General Feedback">💡 General System Feedback</option>
                  <option value="Crowd Congestion Report">👥 Crowd Congestion / Surge Report</option>
                  <option value="Platform Allocation Issue">🚉 Platform Re-allocation / Delay Report</option>
                  <option value="Route Search Suggestion">🗺️ Route Planner / Station Suggestion</option>
                  <option value="Bug Report">🐛 Technical / Bug Report</option>
                </select>
              </div>
              <div>
                <label className="help-field-label">Overall System Rating</label>
                <div className="help-star-rating" id="helpStarRating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`help-star ${star <= rating ? 'active' : ''}`} 
                      onClick={() => setRating(star)}
                      style={{ cursor: 'pointer' }}
                    >★</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="help-field-label" htmlFor="helpFeedbackMsg">Description / Feedback Details *</label>
                <textarea className="help-textarea" id="helpFeedbackMsg" rows="3" placeholder="Share your experience, suggest an improvement, or report station congestion..." required></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label className="help-field-label" htmlFor="helpFeedbackName">Your Name / Call-Sign</label>
                  <input type="text" className="help-input" id="helpFeedbackName" placeholder="Operator / Commuter" />
                </div>
                <div>
                  <label className="help-field-label" htmlFor="helpFeedbackEmail">Email (Optional)</label>
                  <input type="email" className="help-input" id="helpFeedbackEmail" placeholder="name@domain.com" />
                </div>
              </div>
              <button className="help-submit-btn" type="button" onClick={() => setIsOpen(false)}>
                <span>Submit Feedback</span>
              </button>
            </div>
            <div className="help-modal-footer">
              <span>Operations &amp; Service Feedback</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>● Service Online</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
