export default function StationDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" style={{ display: 'block', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10004 }} onClick={onClose}></div>
      <aside className="station-drawer open" id="stationDrawer" style={{ zIndex: 10005, right: 0 }}>
        <div className="drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-real" id="drawerZoneBadge">Southern Railway</span>
              <span className="bp-chip"><span className="bp-ring" style={{ width: '8px', height: '8px' }}></span> BLUEPRINT</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.3rem' }} id="drawerStationName">Chennai Central</h2>
            <span style={{ fontSize: '0.80rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }} id="drawerStationCode">CODE: MAS</span>
          </div>
          <button className="drawer-close" onClick={onClose}>&times;</button>
        </div>
        <div className="drawer-body" id="drawerBody">
          <div>
            <h4 style={{ fontSize: '0.80rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem' }}>Hub Overview</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div>City: <strong id="drawerCity">Chennai</strong></div>
              <div>State: <strong id="drawerState">Tamil Nadu</strong></div>
              <div>Platforms: <strong id="drawerPlatforms">12 Tracks</strong></div>
              <div>Daily Footfall: <strong id="drawerFootfall" style={{ color: 'var(--emerald)' }}>420,000 / day</strong></div>
              <div>Crowd Index: <strong id="drawerCrowdIndex" style={{ color: 'var(--rail-red)' }}>HIGH</strong></div>
              <div>Status: <span className="badge badge-real" id="drawerStatus">OPERATIONAL</span></div>
            </div>
            <div id="drawerHeritageBox" style={{ marginTop: '0.75rem', padding: '0.6rem 0.75rem', background: 'rgba(217, 35, 45, 0.06)', border: '1px solid rgba(217, 35, 45, 0.25)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.95rem' }}>🏛️</span>
                <strong style={{ fontSize: '0.82rem', color: 'var(--rail-red)' }} id="drawerEstablishedBadge">Established: 1873</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }} id="drawerHistoricalDetails">Madras Railway headquarters designed by George Harding with red Romanesque-Gothic clock tower by Robert Chisholm.</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.80rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem' }}>Connected Trunk Corridors</h4>
            <div id="drawerConnectionsList" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
              <div>MAS ➔ NDLS (Grand Trunk Express)</div>
              <div>MAS ➔ HWH (Coromandel Coast)</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.80rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem' }}>Primary Originating Express Trains</h4>
            <div id="drawerOutgoingRoutes" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
              <div>12621 - Tamil Nadu Express</div>
              <div>12840 - Howrah Mail</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button className="btn btn-primary" id="btnDrawerPlanFrom" style={{ width: '100%', justifyContent: 'center' }}>Plan Journey From Here &rarr;</button>
          </div>
        </div>
      </aside>
    </>
  );
}
