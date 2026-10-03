export default function TrainTimetableModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay open" id="trainTimetableModal" onClick={onClose}>
        <div className="modal-card" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-real" id="ttTrainBadge">SUPERFAST</span>
                <span className="bp-chip"><span className="bp-ring" style={{ width: '8px', height: '8px' }}></span> SCHEMATIC</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.25rem' }} id="ttTrainTitle">12622 — Tamil Nadu Express</h3>
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }} id="ttTrainRoute">NDLS ➔ MAS • 2,180 km</span>
              <div id="ttHeritageBox" style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span className="badge badge-ai" id="ttInaugurationBadge">Inaugurated: 15 Aug 1977</span>
                <span id="ttHistoricalDetails" style={{ fontStyle: 'italic' }}>Iconic Indian Railways scheduled express service.</span>
              </div>
            </div>
            <button className="drawer-close" onClick={onClose}>&times;</button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.80rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.75rem' }}>Timetable Sequence &amp; Intermediate Stoppages</h4>
            <div className="table-wrapper">
              <table className="data-table" id="ttStopsTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Station</th>
                    <th>Arr.</th>
                    <th>Dep.</th>
                    <th>Halt</th>
                    <th>Distance</th>
                    <th>Platform</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>New Delhi (NDLS)</td>
                    <td>-</td>
                    <td>21:05</td>
                    <td>-</td>
                    <td>0 km</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Agra Cantt (AGC)</td>
                    <td>22:58</td>
                    <td>23:00</td>
                    <td>2m</td>
                    <td>195 km</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Chennai Central (MAS)</td>
                    <td>06:35</td>
                    <td>-</td>
                    <td>-</td>
                    <td>2180 km</td>
                    <td>4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
