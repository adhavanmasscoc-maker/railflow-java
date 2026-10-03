# LEGACY SITE FEATURE INVENTORY & MAPPING

## 1. Global UI & Navigation
- **Global Nav Sidebar (`#sidebarNav`)**: 12 Main Nav Items (Dashboard, Journey, Network, Stations, Trains, Crowd, Quality, Architecture, Fleet, Database, Feedback, Commuter, Commander).
- **Top Navbar (`#topNavbar`)**: Search, Alerts, Profile.
- **Persistent Footer Ticker (`#hudBarBottom`)**: Ticker showing hubs, corridors, clock.
- **Machina HUD Bottom Telemetry Bar (`#hudBarTop`)**: SYS 01/12 index, arrows.
- **Mobile Bottom Navigation (`#mobileBottomNav`)**: Dashboard, Planner, Network, Crowd, Commuter.

## 2. Modals & Drawers
- **Station Detail Drawer (`#stationDrawer`)**: Drilldown with hub overview, heritage, trunk corridors, outgoing routes.
- **AI Operations Assistant Drawer (`#aiDrawer`)**: AI Chat, quick chips.
- **Operations Guide Modal (`#guideModal`)**: 7-step guide.
- **Multi-Lingual PA Soundboard Modal (`#stationSoundboardModal`)**: Language select, scenario templates, audio visualizer, broadcast button.
- **Quick PNR Status Checker Modal (`#pnrModal`)**: 10-digit PNR input, chart status.
- **Floating Mini Help & Feedback Widget (`#floatingHelpModal`)**: Issue form with rating.

## 3. Pages & Features
| Page View (Legacy) | Component / Feature | React Target Component |
| --- | --- | --- |
| `page-dashboard` | Master KPIs, Live Terminal, Express Map, Network Alerts, Platform Capacity | `DashboardPage.jsx` |
| `page-planner` | Shortest Path Form, Routing Table, Journey Result Card, FOB Interlock, Coach Compass | `JourneyPage.jsx` |
| `page-network` | SVG Topology Graph, Zoom/Pan, Node Drilldown, Corridors | `NetworkPage.jsx` |
| `page-stations` | Hierarchy Tree, Stations Data Table | `StationsPage.jsx` |
| `page-trains` | Express Registry, Search, Explorer Table | `TrainsPage.jsx` |
| `page-crowd` | Simulation Interval/Audio, Density Rows, Stress-Test Sandbox, FOB Topo, Coach Density, Audit Log | `CrowdPage.jsx` |
| `page-quality` | Data Validation KPIs, Checksum Audit Table | `QualityPage.jsx` |
| `page-architecture`| 7-Tier Interactive Pipeline, Real-time Telemetry, Java Console, ASCII Blueprint, Feature Tree | `ArchitecturePage.jsx` |
| `page-fleet` | Fleet KPIs, Kavach Features, Loco Sheds Table, Kavach Telemetry Table, Hierarchical Tree | `FleetPage.jsx` |
| `page-database` | SQL Presets, Station Tree (Left), Admin Password Monitor / Custom SQL Terminal (Right) | `DatabasePage.jsx` |
| `page-feedback` | Operations Review Form, Feedback Stream & Stats | `FeedbackPage.jsx` |
| `page-commuter` | Live Audio Dispatch, Display Board, Coach Boarding Guidance, Exit Navigator | `CommuterPage.jsx` |
| `page-commander` | Broadcast Station Audio Dock, Lang/Rate/Pitch Controls, Waveform, 6 Scenarios, Custom Studio | `CommanderPage.jsx` / `VoiceCommandPage.jsx` |
