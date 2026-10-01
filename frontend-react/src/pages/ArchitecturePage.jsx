export default function ArchitecturePage() {
  return (
    <section className="page-view active" id="page-architecture">
      <div className="view-header" style={{ marginBottom: '24px' }}>
        <div className="view-title-group">
          <div className="eyebrow"><span className="sys-num">SYSTEM 09</span> <span className="slash">//</span> SYSTEM ARCHITECTURE</div>
          <h1 className="view-title">Full-Stack Dataflow &amp; Engineering Blueprint</h1>
          <p className="view-desc">Complete architecture from CSV/JSON/PDF ingestion through JDBC PreparedStatements, SQLite WAL, Java Services, Node.js Proxy, to React SPA.</p>
        </div>
        <span className="badge badge-real">JAVA 21+ JDBC</span>
      </div>

      {/* Data Flow Pipeline */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>End-to-End Dataflow Pipeline</div>
      <div style={{ display: 'flex', gap: '0px', alignItems: 'stretch', marginBottom: '24px', overflowX: 'auto' }}>
        {[
          { stage: 'DATA SOURCES', items: ['trainroutes.json (5,208 trains)', 'stations.csv (8,990 records)', 'station_name.pdf (616 records)', 'special_trains.pdf (228 records)'], color: '#3B82F6' },
          { stage: 'INGESTION ENGINE', items: ['DataIngestionEngine.java', 'DataScanner.java', 'PdfExtractor.java', 'CsvParser.java'], color: '#8B5CF6' },
          { stage: 'VALIDATION', items: ['Schema verification', 'Duplicate detection', 'FK integrity check', 'Coordinate validation'], color: '#F59E0B' },
          { stage: 'JDBC + SQLITE', items: ['PreparedStatements', 'WAL mode enabled', 'Batch inserts (1000/tx)', '21 performance indexes'], color: '#10B981' },
          { stage: 'JAVA SERVICES', items: ['RouteSearchService', 'CrowdSimulationService', 'JourneyServiceImpl', 'NetworkServiceImpl'], color: '#06B6D4' },
          { stage: 'API LAYER', items: ['Spring Boot REST', 'Node.js Express Proxy', 'Vercel Serverless', 'Gemini AI Gateway'], color: '#EC4899' },
          { stage: 'REACT SPA', items: ['Vite 8 + React 19', 'Tailwind CSS 4', 'React Router v7', 'Web Audio API'], color: '#EF4444' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, minWidth: '140px' }}>
            <div style={{
              padding: '12px', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
              borderTopWidth: '3px', borderTopColor: s.color, borderRadius: i === 0 ? 'var(--radius-sm) 0 0 var(--radius-sm)' : i === 6 ? '0 var(--radius-sm) var(--radius-sm) 0' : '0',
              height: '100%',
            }}>
              <div style={{ fontWeight: 700, fontSize: '10px', color: s.color, textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>{s.stage}</div>
              {s.items.map((item, j) => (
                <div key={j} style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '2px 0', fontFamily: 'var(--font-mono)' }}>• {item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack Cards */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Core Technology Stack</div>
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        {[
          { title: 'Java Backend', version: 'OpenJDK 21 LTS', detail: 'Maven, JDBC, SQLite, PreparedStatements, Batch Processing', icon: '☕' },
          { title: 'Node.js Proxy', version: 'Node.js 24 + Express', detail: 'PNR Provider, Gemini AI Proxy, Atlas Telemetry, CORS Gateway', icon: '🟢' },
          { title: 'React Frontend', version: 'React 19 + Vite 8', detail: 'React Router v7, Chart.js, Tailwind CSS 4, Web Audio API', icon: '⚛️' },
          { title: 'Database', version: 'SQLite 3 (WAL Mode)', detail: '862K+ total records, 21 indexes, 9 tables, sub-ms queries', icon: '🗄️' },
          { title: 'Deployment', version: 'Vercel + GitHub', detail: 'Serverless Functions, Edge Network, CI/CD via push-to-github.bat', icon: '🚀' },
          { title: 'AI Integration', version: 'Gemini API', detail: 'Natural language dispatch queries, copilot drawer, intent classification', icon: '🤖' },
        ].map(t => (
          <div key={t.title} className="kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="metric-title">{t.title}</span>
              <span style={{ fontSize: '20px' }}>{t.icon}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: '14px', margin: '6px 0' }}>{t.version}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.detail}</div>
          </div>
        ))}
      </div>

      {/* Key Java Classes */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Core Java Class Registry</div>
      <div className="table-container">
        <table>
          <thead><tr><th>Package</th><th>Class</th><th>Role</th></tr></thead>
          <tbody>
            {[
              ['com.railflow.ingestion', 'DataIngestionEngine', 'Orchestrates full CSV/JSON/PDF → SQLite pipeline'],
              ['com.railflow.ingestion', 'PdfExtractor', 'Apache PDFBox extraction for special trains & station metadata'],
              ['com.railflow.database', 'SchemaManager', 'DDL creation, index management, WAL configuration'],
              ['com.railflow.repository.jdbc', 'JdbcStationRepository', 'CRUD + fuzzy search for 8,989 stations'],
              ['com.railflow.repository.jdbc', 'JdbcTrainRepository', 'Train lookup, route fetching with ordered stops'],
              ['com.railflow.repository.jdbc', 'JdbcRouteRepository', 'Direct & transfer route search with graph traversal'],
              ['com.railflow.service', 'RouteSearchService', 'BFS/DFS graph search across 411K edges'],
              ['com.railflow.service', 'CrowdSimulationService', 'O(1) platform density estimation + surge modeling'],
              ['com.railflow.model', 'Station / Train / TrainStop', 'Core domain model POJOs'],
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{row[0]}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '12px' }}>{row[1]}</td>
                <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
