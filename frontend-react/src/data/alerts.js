export const alertsData = [
  { alert_id: 'ALT-1001', type: 'CRITICAL', timestamp: '2026-10-03T14:23:45', title: 'Signal Failure at Platform 3 (MAS)', description: 'Coromandel Express (12842) delayed 15m. Maintenance crew dispatched.', source: 'Signal Controller NX-3', acknowledged: false },
  { alert_id: 'ALT-1002', type: 'WARNING', timestamp: '2026-10-03T14:18:22', title: 'High crowd density FOB-2 (NDLS)', description: 'Occupancy 87% (threshold: 75%). Crowd dispersal advisory issued.', source: 'CrowdSim Engine v2', acknowledged: false },
  { alert_id: 'ALT-1003', type: 'INFO', timestamp: '2026-10-03T14:00:00', title: 'Data sync successful', description: '13,849 records verified across stations, trains, and edges. SQLite WAL checkpoint completed.', source: 'DataIngestionEngine', acknowledged: true },
];
