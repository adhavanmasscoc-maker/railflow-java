import { useState, useRef, useEffect, useMemo } from 'react';

// ─── GEOGRAPHIC PROJECTION ENGINE (INDIA BOUNDS: 8°N–35.5°N, 68°E–97.5°E) ─────
function projectGeoToSvg(lat, lon, width = 1100, height = 980) {
  const padX = 75;
  const padY = 65;
  const minLon = 68.0, maxLon = 97.5;
  const minLat = 8.0, maxLat = 35.5;
  const x = padX + ((lon - minLon) / (maxLon - minLon)) * (width - 2 * padX);
  const y = padY + ((maxLat - lat) / (maxLat - minLat)) * (height - 2 * padY);
  return { x: Math.round(x), y: Math.round(y) };
}

// ─── 42 NATIONAL RAILWAY HUBS ────────────────────────────────────────────────
const RAW_HUBS = [
  { code: 'NDLS', name: 'New Delhi', zone: 'NR', city: 'Delhi', state: 'Delhi NCT', platforms: 16, lat: 28.6423, lon: 77.2200, tier: 'trunk' },
  { code: 'AGC', name: 'Agra Cantt', zone: 'NCR', city: 'Agra', state: 'Uttar Pradesh', platforms: 6, lat: 27.1580, lon: 77.9902, tier: 'junction' },
  { code: 'GWL', name: 'Gwalior Jn', zone: 'NCR', city: 'Gwalior', state: 'Madhya Pradesh', platforms: 5, lat: 26.2165, lon: 78.1823, tier: 'junction' },
  { code: 'VGLB', name: 'V Lakshmibai Jhansi', zone: 'NCR', city: 'Jhansi', state: 'Uttar Pradesh', platforms: 8, lat: 25.4484, lon: 78.5685, tier: 'junction' },
  { code: 'BPL', name: 'Bhopal Jn', zone: 'WCR', city: 'Bhopal', state: 'Madhya Pradesh', platforms: 6, lat: 23.2669, lon: 77.4131, tier: 'junction' },
  { code: 'NGP', name: 'Nagpur Jn', zone: 'CR', city: 'Nagpur', state: 'Maharashtra', platforms: 8, lat: 21.1536, lon: 79.0890, tier: 'junction' },
  { code: 'CNB', name: 'Kanpur Central', zone: 'NCR', city: 'Kanpur', state: 'Uttar Pradesh', platforms: 10, lat: 26.4542, lon: 80.3510, tier: 'junction' },
  { code: 'LKO', name: 'Lucknow Charbagh', zone: 'NR', city: 'Lucknow', state: 'Uttar Pradesh', platforms: 9, lat: 26.8307, lon: 80.9253, tier: 'junction' },
  { code: 'BSB', name: 'Varanasi Jn', zone: 'NR', city: 'Varanasi', state: 'Uttar Pradesh', platforms: 9, lat: 25.3273, lon: 82.9865, tier: 'junction' },
  { code: 'GKP', name: 'Gorakhpur Jn', zone: 'NER', city: 'Gorakhpur', state: 'Uttar Pradesh', platforms: 10, lat: 26.7593, lon: 83.3815, tier: 'junction' },
  { code: 'PNBE', name: 'Patna Jn', zone: 'ECR', city: 'Patna', state: 'Bihar', platforms: 10, lat: 25.6026, lon: 85.1368, tier: 'junction' },
  { code: 'HWH', name: 'Howrah Jn', zone: 'ER', city: 'Kolkata', state: 'West Bengal', platforms: 23, lat: 22.5841, lon: 88.3410, tier: 'trunk' },
  { code: 'BBS', name: 'Bhubaneswar', zone: 'ECoR', city: 'Bhubaneswar', state: 'Odisha', platforms: 6, lat: 20.2654, lon: 85.8426, tier: 'junction' },
  { code: 'GHY', name: 'Guwahati', zone: 'NFR', city: 'Guwahati', state: 'Assam', platforms: 7, lat: 26.1826, lon: 91.7519, tier: 'junction' },
  { code: 'ASR', name: 'Amritsar Jn', zone: 'NR', city: 'Amritsar', state: 'Punjab', platforms: 8, lat: 31.6315, lon: 74.8580, tier: 'junction' },
  { code: 'JP', name: 'Jaipur Jn', zone: 'NWR', city: 'Jaipur', state: 'Rajasthan', platforms: 8, lat: 26.9202, lon: 75.7869, tier: 'junction' },
  { code: 'ADI', name: 'Ahmedabad Jn', zone: 'WR', city: 'Ahmedabad', state: 'Gujarat', platforms: 12, lat: 23.0255, lon: 72.6015, tier: 'junction' },
  { code: 'BCT', name: 'Mumbai Central', zone: 'WR', city: 'Mumbai', state: 'Maharashtra', platforms: 8, lat: 18.9707, lon: 72.8194, tier: 'trunk' },
  { code: 'CSTM', name: 'Chhatrapati Shivaji MT', zone: 'CR', city: 'Mumbai', state: 'Maharashtra', platforms: 18, lat: 18.9445, lon: 72.8369, tier: 'trunk' },
  { code: 'PUNE', name: 'Pune Jn', zone: 'CR', city: 'Pune', state: 'Maharashtra', platforms: 6, lat: 18.5294, lon: 73.8731, tier: 'junction' },
  { code: 'HYB', name: 'Hyderabad Deccan', zone: 'SCR', city: 'Hyderabad', state: 'Telangana', platforms: 6, lat: 17.3934, lon: 78.4674, tier: 'junction' },
  { code: 'MAS', name: 'Chennai Central', zone: 'SR', city: 'Chennai', state: 'Tamil Nadu', platforms: 12, lat: 13.0848, lon: 80.2749, tier: 'trunk' },
  { code: 'MS', name: 'Chennai Egmore', zone: 'SR', city: 'Chennai', state: 'Tamil Nadu', platforms: 11, lat: 13.0777, lon: 80.2602, tier: 'suburban' },
  { code: 'TBM', name: 'Tambaram', zone: 'SR', city: 'Chennai', state: 'Tamil Nadu', platforms: 8, lat: 12.9260, lon: 80.1192, tier: 'suburban' },
  { code: 'SBC', name: 'KSR Bengaluru', zone: 'SWR', city: 'Bengaluru', state: 'Karnataka', platforms: 10, lat: 12.9776, lon: 77.5681, tier: 'junction' },
  { code: 'MYS', name: 'Mysuru Jn', zone: 'SWR', city: 'Mysuru', state: 'Karnataka', platforms: 6, lat: 12.3189, lon: 76.6460, tier: 'junction' },
  { code: 'CBE', name: 'Coimbatore Jn', zone: 'SR', city: 'Coimbatore', state: 'Tamil Nadu', platforms: 6, lat: 10.9976, lon: 76.9663, tier: 'southern' },
  { code: 'TPJ', name: 'Tiruchirappalli Jn (Trichy)', zone: 'SR', city: 'Tiruchirappalli', state: 'Tamil Nadu', platforms: 8, lat: 10.7941, lon: 78.6854, tier: 'southern' },
  { code: 'ALU', name: 'Ariyalur', zone: 'SR', city: 'Ariyalur', state: 'Tamil Nadu', platforms: 3, lat: 11.1500, lon: 79.0683, tier: 'southern' },
  { code: 'MDU', name: 'Madurai Jn', zone: 'SR', city: 'Madurai', state: 'Tamil Nadu', platforms: 8, lat: 9.9199, lon: 78.1103, tier: 'southern' },
  { code: 'TVC', name: 'Thiruvananthapuram C', zone: 'SR', city: 'Thiruvananthapuram', state: 'Kerala', platforms: 5, lat: 8.4867, lon: 76.9512, tier: 'southern' },
  { code: 'JAT', name: 'Jammu Tawi', zone: 'NR', city: 'Jammu', state: 'Jammu and Kashmir', platforms: 7, lat: 32.7070, lon: 74.8801, tier: 'junction' },
  { code: 'CDG', name: 'Chandigarh', zone: 'NR', city: 'Chandigarh', state: 'Chandigarh', platforms: 6, lat: 30.7020, lon: 76.8221, tier: 'junction' },
  { code: 'KOTA', name: 'Kota Jn', zone: 'WCR', city: 'Kota', state: 'Rajasthan', platforms: 6, lat: 25.2236, lon: 75.8805, tier: 'junction' },
  { code: 'BRC', name: 'Vadodara Jn', zone: 'WR', city: 'Vadodara', state: 'Gujarat', platforms: 7, lat: 22.3108, lon: 73.1811, tier: 'junction' },
  { code: 'ST', name: 'Surat', zone: 'WR', city: 'Surat', state: 'Gujarat', platforms: 4, lat: 21.2066, lon: 72.8408, tier: 'junction' },
  { code: 'VSKP', name: 'Visakhapatnam', zone: 'ECoR', city: 'Visakhapatnam', state: 'Andhra Pradesh', platforms: 8, lat: 17.7216, lon: 83.2895, tier: 'junction' },
  { code: 'BZA', name: 'Vijayawada Jn', zone: 'SCR', city: 'Vijayawada', state: 'Andhra Pradesh', platforms: 10, lat: 16.5183, lon: 80.6186, tier: 'junction' },
  { code: 'VRI', name: 'Vriddhachalam Jn', zone: 'SR', city: 'Vriddhachalam', state: 'Tamil Nadu', platforms: 5, lat: 11.5173, lon: 79.3242, tier: 'southern' },
  { code: 'VM', name: 'Villupuram Jn', zone: 'SR', city: 'Villupuram', state: 'Tamil Nadu', platforms: 6, lat: 11.9398, lon: 79.4975, tier: 'southern' },
  { code: 'CGL', name: 'Chengalpattu Jn', zone: 'SR', city: 'Chengalpattu', state: 'Tamil Nadu', platforms: 8, lat: 12.6841, lon: 79.9836, tier: 'southern' },
  { code: 'DG', name: 'Dindigul Jn', zone: 'SR', city: 'Dindigul', state: 'Tamil Nadu', platforms: 5, lat: 10.3624, lon: 77.9695, tier: 'southern' },
  { code: 'TEN', name: 'Tirunelveli Jn', zone: 'SR', city: 'Tirunelveli', state: 'Tamil Nadu', platforms: 5, lat: 8.7274, lon: 77.7281, tier: 'southern' },
  { code: 'CAPE', name: 'Kanniyakumari', zone: 'SR', city: 'Kanniyakumari', state: 'Tamil Nadu', platforms: 4, lat: 8.0883, lon: 77.5385, tier: 'southern' },
  { code: 'ED', name: 'Erode Jn', zone: 'SR', city: 'Erode', state: 'Tamil Nadu', platforms: 5, lat: 11.3410, lon: 77.7172, tier: 'southern' },
  { code: 'SA', name: 'Salem Jn', zone: 'SR', city: 'Salem', state: 'Tamil Nadu', platforms: 6, lat: 11.6643, lon: 78.1460, tier: 'southern' },
  { code: 'JTJ', name: 'Jolarpettai Jn', zone: 'SR', city: 'Jolarpettai', state: 'Tamil Nadu', platforms: 5, lat: 12.5539, lon: 78.5744, tier: 'southern' },
  { code: 'KPD', name: 'Katpadi Jn', zone: 'SR', city: 'Vellore', state: 'Tamil Nadu', platforms: 5, lat: 12.9698, lon: 79.1350, tier: 'southern' },
  { code: 'AJJ', name: 'Arakkonam Jn', zone: 'SR', city: 'Arakkonam', state: 'Tamil Nadu', platforms: 8, lat: 13.0800, lon: 79.6680, tier: 'suburban' },
  { code: 'PRYJ', name: 'Prayagraj Jn', zone: 'NCR', city: 'Prayagraj', state: 'Uttar Pradesh', platforms: 10, lat: 25.4358, lon: 81.8463, tier: 'junction' },
  { code: 'GAYA', name: 'Gaya Jn', zone: 'ECR', city: 'Gaya', state: 'Bihar', platforms: 9, lat: 24.7955, lon: 85.0002, tier: 'junction' },
  { code: 'ASN', name: 'Asansol Jn', zone: 'ER', city: 'Asansol', state: 'West Bengal', platforms: 8, lat: 23.6889, lon: 86.9661, tier: 'junction' },
  { code: 'SC', name: 'Secunderabad Jn', zone: 'SCR', city: 'Hyderabad', state: 'Telangana', platforms: 10, lat: 17.4399, lon: 78.5017, tier: 'trunk' },
  { code: 'RTM', name: 'Ratlam Jn', zone: 'WR', city: 'Ratlam', state: 'Madhya Pradesh', platforms: 7, lat: 23.3441, lon: 75.0373, tier: 'junction' }
];

// ─── 55 CORRIDOR EDGES ───────────────────────────────────────────────────────
const CORRIDOR_EDGES = [
  { from: 'JAT', to: 'ASR', dist: 206, name: 'Jammu-Punjab Trunk' },
  { from: 'ASR', to: 'CDG', dist: 248, name: 'Amritsar-Chandigarh Intercity' },
  { from: 'CDG', to: 'NDLS', dist: 244, name: 'Kalka-Delhi Express Highway' },
  { from: 'ASR', to: 'NDLS', dist: 448, name: 'Grand Trunk Northern Section' },
  { from: 'NDLS', to: 'AGC', dist: 195, name: 'Taj High Speed Link' },
  { from: 'AGC', to: 'GWL', dist: 118, name: 'Chambal Section' },
  { from: 'GWL', to: 'VGLB', dist: 98, name: 'Bundelkhand Trunk' },
  { from: 'VGLB', to: 'BPL', dist: 292, name: 'Malwa Express Corridor' },
  { from: 'BPL', to: 'NGP', dist: 390, name: 'Satpura Line' },
  { from: 'NGP', to: 'HYB', dist: 502, name: 'Deccan North-South Link' },
  { from: 'NGP', to: 'BZA', dist: 433, name: 'Grand Trunk Southern Spur' },
  { from: 'HYB', to: 'BZA', dist: 310, name: 'Satavahana Andhra Axis' },
  { from: 'BZA', to: 'MAS', dist: 431, name: 'Circar Coastal Trunk' },
  { from: 'NDLS', to: 'CNB', dist: 440, name: 'Gangetic Main Trunk' },
  { from: 'CNB', to: 'LKO', dist: 72, name: 'Avadh Double Track' },
  { from: 'CNB', to: 'BSB', dist: 320, name: 'Prayagraj Gangetic Line' },
  { from: 'LKO', to: 'GKP', dist: 270, name: 'Purvanchal Express Route' },
  { from: 'GKP', to: 'BSB', dist: 230, name: 'Sarayu-Ganga Link' },
  { from: 'BSB', to: 'PNBE', dist: 230, name: 'Magadh Corridor' },
  { from: 'PNBE', to: 'HWH', dist: 530, name: 'Grand Chord Trunk' },
  { from: 'HWH', to: 'BBS', dist: 440, name: 'East Coast Line' },
  { from: 'BBS', to: 'VSKP', dist: 444, name: 'Kalinga Coastal Axis' },
  { from: 'VSKP', to: 'BZA', dist: 350, name: 'Godavari Coromandel Line' },
  { from: 'HWH', to: 'GHY', dist: 990, name: 'Northeast Gateway' },
  { from: 'NDLS', to: 'JP', dist: 308, name: 'Pink City Corridor' },
  { from: 'JP', to: 'KOTA', dist: 240, name: 'Shekhawati-Hadoti Link' },
  { from: 'KOTA', to: 'BRC', dist: 528, name: 'Western High Speed Main' },
  { from: 'JP', to: 'ADI', dist: 620, name: 'Aravalli Western Link' },
  { from: 'ADI', to: 'BRC', dist: 100, name: 'Gujarat High Density Link' },
  { from: 'BRC', to: 'ST', dist: 129, name: 'Tapi Coastal Double Track' },
  { from: 'ST', to: 'BCT', dist: 263, name: 'Western Main Corridor' },
  { from: 'BCT', to: 'CSTM', dist: 10, name: 'Mumbai Suburban Interconnect' },
  { from: 'CSTM', to: 'PUNE', dist: 192, name: 'Bhor Ghat Deccan Corridor' },
  { from: 'PUNE', to: 'HYB', dist: 597, name: 'Deccan Superfast Link' },
  { from: 'CSTM', to: 'BPL', dist: 830, name: 'Central Trunk' },
  { from: 'MAS', to: 'SBC', dist: 360, name: 'Mysore Express Highway' },
  { from: 'SBC', to: 'MYS', dist: 139, name: 'Cauvery Section' },
  { from: 'MAS', to: 'MS', dist: 3, name: 'Chennai Urban Bifurcation' },
  { from: 'MS', to: 'TBM', dist: 25, name: 'Tambaram Suburban Link' },
  { from: 'TBM', to: 'CGL', dist: 31, name: 'Chengalpattu Dual Track' },
  { from: 'CGL', to: 'VM', dist: 103, name: 'Villupuram Express Section' },
  { from: 'VM', to: 'VRI', dist: 55, name: 'Vriddhachalam Main Line' },
  { from: 'VRI', to: 'ALU', dist: 53, name: 'Ariyalur Industrial Section' },
  { from: 'ALU', to: 'TPJ', dist: 70, name: 'Ariyalur - Trichy Chord Main' },
  { from: 'TPJ', to: 'DG', dist: 94, name: 'Dindigul Chord Spur' },
  { from: 'DG', to: 'MDU', dist: 63, name: 'Pandian Express Corridor' },
  { from: 'MDU', to: 'TEN', dist: 157, name: 'Nellai Southern Corridor' },
  { from: 'TEN', to: 'CAPE', dist: 85, name: 'Kanyakumari Ocean Terminus' },
  { from: 'MAS', to: 'AJJ', dist: 69, name: 'Arakkonam Quad Track' },
  { from: 'AJJ', to: 'KPD', dist: 61, name: 'Katpadi Kongu Section' },
  { from: 'KPD', to: 'JTJ', dist: 84, name: 'Jolarpettai Junction Link' },
  { from: 'JTJ', to: 'SA', dist: 120, name: 'Salem Fast Line' },
  { from: 'SA', to: 'ED', dist: 60, name: 'Erode Electrified Section' },
  { from: 'ED', to: 'CBE', dist: 101, name: 'Kongu Express Track' },
  { from: 'CBE', to: 'TVC', dist: 380, name: 'Palakkad Gap Southern Route' },
  { from: 'CNB', to: 'PRYJ', dist: 194, name: 'Prayagraj Fast Line' },
  { from: 'PRYJ', to: 'BSB', dist: 124, name: 'Varanasi Gangetic Track' },
  { from: 'BSB', to: 'GAYA', dist: 220, name: 'Grand Chord Bihar Section' },
  { from: 'GAYA', to: 'ASN', dist: 250, name: 'Asansol Coal Belt Line' },
  { from: 'ASN', to: 'HWH', dist: 200, name: 'Howrah Approach Trunk' },
  { from: 'PUNE', to: 'SC', dist: 597, name: 'Deccan Superfast Link' },
  { from: 'SC', to: 'BZA', dist: 350, name: 'Amaravati Axis' },
  { from: 'BRC', to: 'RTM', dist: 260, name: 'Malwa Western Connection' },
  { from: 'RTM', to: 'KOTA', dist: 267, name: 'Hadoti Trunk Section' }
];

// ─── 6 ANIMATED ACTIVE EXPRESS TRAINS ─────────────────────────────────────────
const ANIMATED_TRAINS = [
  { id: 'pandyan', name: '12638 Pandian SF Express (via ALU)', from: 'ALU', to: 'MS', color: '#10B981', dur: '7s' },
  { id: 'tn-exp', name: '12622 Tamil Nadu Express', from: 'NDLS', to: 'MAS', color: '#EF4444', dur: '12s' },
  { id: 'rajdhani', name: '12301 Howrah Rajdhani', from: 'HWH', to: 'NDLS', color: '#F59E0B', dur: '14s' },
  { id: 'vande-bharat', name: '20607 MAS-MYS Vande Bharat', from: 'MAS', to: 'SBC', color: '#38BDF8', dur: '8s' },
  { id: 'mmct-raj', name: '12951 Mumbai Rajdhani', from: 'BCT', to: 'NDLS', color: '#A855F7', dur: '13s' },
  { id: 'vaigai', name: '12636 Vaigai SF Express', from: 'TPJ', to: 'MS', color: '#34D399', dur: '9s' }
];

const TIER_COLORS = {
  trunk: '#EF4444',     // Crimson
  junction: '#3B82F6',  // Blue
  southern: '#10B981',  // Emerald
  suburban: '#22D3EE'   // Cyan
};

export default function NetworkTopologyGraph() {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState(null);
  // Start at 1.0x so the full SVG viewBox fits neatly in the container
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Map stations to projected SVG coordinates
  const hubsWithCoords = useMemo(() => {
    return RAW_HUBS.map(h => {
      const pt = projectGeoToSvg(h.lat, h.lon);
      return { ...h, x: pt.x, y: pt.y };
    });
  }, []);

  const hubMap = useMemo(() => {
    return new Map(hubsWithCoords.map(h => [h.code, h]));
  }, [hubsWithCoords]);

  // Filter hubs based on zone
  const visibleHubs = useMemo(() => {
    if (selectedZone === 'ALL') return hubsWithCoords;
    return hubsWithCoords.filter(h => h.zone === selectedZone || h.tier === 'trunk');
  }, [hubsWithCoords, selectedZone]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom(prev => Math.min(Math.max(prev * factor, 0.5), 3.0));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));
  const handleReset = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setSelectedStation(null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '640px', height: 'calc(100vh - 220px)', background: '#070C18', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Top Controls Bar */}
      <div style={{ padding: '12px 20px', background: 'rgba(14,20,36,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>TOPOLOGY ENGINE // GEOGRAPHIC PROJECTION</div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌐 Indian Railways National Inter-Hub Graph</span>
              <span className="badge badge-derived" style={{ fontSize: '10px' }}>O(1) Spatial Hydration</span>
            </div>
          </div>

          {/* Zone filters */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'SR', 'NR', 'WR', 'CR', 'ER'].map(zone => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`btn ${selectedZone === zone ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '3px 10px', fontSize: '11px' }}
              >
                {zone === 'ALL' ? 'All Zones' : `${zone} Zone`}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={handleZoomIn} className="btn btn-secondary" title="Zoom In" style={{ padding: '6px 12px' }}>➕</button>
          <button onClick={handleZoomOut} className="btn btn-secondary" title="Zoom Out" style={{ padding: '6px 12px' }}>➖</button>
          <button onClick={handleReset} className="btn btn-secondary" title="Reset View" style={{ padding: '6px 12px' }}>🔄 Reset</button>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', minWidth: '48px', textAlign: 'right' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        style={{ flex: 1, position: 'relative', cursor: isDragging ? 'grabbing' : 'grab', overflow: 'hidden' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          viewBox="0 0 1100 980"
          width="100%"
          height="100%"
          style={{ display: 'block', userSelect: 'none', overflow: 'visible' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="indiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B132B" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#1C2541" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0A1128" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
            {/* 1. India Silhouette Outline */}
            <path
              d="M 300 65 L 365 80 L 429 127 L 429 189 L 478 220 L 735 312 L 1009 297 L 977 359 L 896 405 L 864 451 L 767 482 L 687 498 L 590 606 L 468 683 L 471 760 L 455 853 L 436 878 L 383 913 L 362 900 L 323 807 L 262 683 L 230 575 L 220 513 L 139 529 L 107 473 L 101 420 L 172 328 L 236 235 L 294 173 L 268 96 L 300 65 Z"
              fill="url(#indiaGrad)"
              stroke="rgba(56, 189, 248, 0.25)"
              strokeWidth="1.5"
            />

            {/* 2. Lat/Lon Graticule Lines */}
            {[12, 16, 20, 24, 28, 32].map(lat => {
              const p1 = projectGeoToSvg(lat, 68.0);
              const p2 = projectGeoToSvg(lat, 97.5);
              return (
                <g key={`lat-${lat}`}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
                  <text x={80} y={p1.y - 4} fill="rgba(148, 163, 184, 0.35)" fontSize="9" fontFamily="var(--font-mono)">
                    {lat}°N
                  </text>
                </g>
              );
            })}
            {[72, 76, 80, 84, 88, 92].map(lon => {
              const p1 = projectGeoToSvg(35.5, lon);
              const p2 = projectGeoToSvg(8.0, lon);
              return (
                <line key={`lon-${lon}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
              );
            })}

            {/* Watermark */}
            <text x="550" y="960" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="var(--font-mono)" opacity="0.6">
              INDIAN RAILWAYS NATIONAL TOPOLOGY MAP • GEOGRAPHIC PROJECTION (8°N–35.5°N, 68°E–97.5°E)
            </text>

            {/* 3. Corridors / Edges */}
            {CORRIDOR_EDGES.map((edge, idx) => {
              const source = hubMap.get(edge.from);
              const target = hubMap.get(edge.to);
              if (!source || !target) return null;

              const isChord = (
                (edge.from === 'ALU' || edge.to === 'ALU') ||
                (edge.from === 'VRI' || edge.to === 'VRI') ||
                (edge.from === 'VM' || edge.to === 'VM') ||
                (edge.from === 'CGL' || edge.to === 'CGL') ||
                (edge.from === 'TBM' || edge.to === 'TBM') ||
                (edge.from === 'TPJ' && edge.to === 'ALU')
              );

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isChord ? '#10B981' : (edge.from === 'NDLS' || edge.to === 'MAS' || edge.from === 'HWH' || edge.to === 'BCT' ? '#3B82F6' : '#334155')}
                    strokeWidth={isChord ? 3.5 : (edge.from === 'NDLS' || edge.to === 'MAS' ? 2.5 : 1.5)}
                    strokeOpacity={isChord ? 0.95 : 0.75}
                    filter={isChord ? 'url(#glowEmerald)' : (edge.from === 'NDLS' || edge.to === 'MAS' ? 'url(#glowBlue)' : undefined)}
                  >
                    <title>{`${edge.name} (${edge.from} ↔ ${edge.to}) • ${edge.dist} km`}</title>
                  </line>
                </g>
              );
            })}

            {/* 4. Animated Active Trains */}
            {ANIMATED_TRAINS.map(tr => {
              const s = hubMap.get(tr.from);
              const t = hubMap.get(tr.to);
              if (!s || !t) return null;

              return (
                <circle
                  key={`train-${tr.id}`}
                  r="5.5"
                  fill={tr.color}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer' }}
                >
                  <animateMotion
                    path={`M ${s.x} ${s.y} L ${t.x} ${t.y} Z`}
                    dur={tr.dur}
                    repeatCount="indefinite"
                  />
                  <title>{`${tr.name}\nActive Corridor: ${tr.from} ➔ ${tr.to}\nKavach TCAS Active • 110-130 km/h`}</title>
                </circle>
              );
            })}

            {/* 5. Station Nodes */}
            {visibleHubs.map(hub => {
              const isSelected = selectedStation?.code === hub.code;
              const isChordHub = hub.code === 'ALU' || hub.code === 'TPJ' || hub.code === 'MS';

              return (
                <g
                  key={`hub-${hub.code}`}
                  transform={`translate(${hub.x}, ${hub.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStation(hub);
                  }}
                >
                  {/* Pulse ring for trunk hubs and Southern Chord Line stations */}
                  {(hub.tier === 'trunk' || isChordHub || isSelected) && (
                    <circle
                      r={isSelected ? 18 : 14}
                      fill="none"
                      stroke={isChordHub ? '#10B981' : (isSelected ? '#F59E0B' : '#EF4444')}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeOpacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values={isSelected ? '14;22;14' : '10;17;10'}
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-opacity"
                        values="0.9;0.1;0.9"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Main Circle */}
                  <circle
                    r={hub.tier === 'trunk' ? 12 : (isChordHub ? 11 : 8.5)}
                    fill={isChordHub ? '#10B981' : (TIER_COLORS[hub.tier] || '#3B82F6')}
                    stroke="#0B1220"
                    strokeWidth="2.5"
                  />

                  {/* Node Label */}
                  <text
                    y={hub.tier === 'trunk' ? -16 : -12}
                    textAnchor="middle"
                    fontSize={isChordHub || hub.tier === 'trunk' ? 11 : 10}
                    fontWeight="700"
                    fontFamily="var(--font-mono)"
                    fill={isChordHub ? '#6EE7B7' : '#F3F7FF'}
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                  >
                    {hub.code}
                  </text>

                  <title>{`${hub.name} (${hub.code})\n${hub.city}, ${hub.state} • ${hub.zone} Railway\nPlatforms: ${hub.platforms} • Lat: ${hub.lat.toFixed(2)}°, Lon: ${hub.lon.toFixed(2)}°\nClick to inspect station`}</title>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend Bar */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(14,20,36,0.85)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
          <div style={{ fontWeight: 600, color: '#fff', marginBottom: '2px' }}>TOPOLOGY LEGEND</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <span>Trunk Terminal (NDLS / MAS / HWH / CSTM)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            <span>Southern Chord Hub (TPJ / ALU / MS / MDU)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6' }} />
            <span>Major Zonal Junction (CNB / BPL / PNBE)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '18px', height: '3px', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span>Main Chord Line (ALU–TPJ–MS Double Electrified)</span>
          </div>
        </div>

        {/* Station Inspector Modal / Drawer */}
        {selectedStation && (
          <div style={{ position: 'absolute', top: '16px', right: '16px', width: '320px', background: 'rgba(14,20,36,0.95)', backdropFilter: 'blur(12px)', border: '1px solid #10B981', borderRadius: '12px', padding: '18px', boxShadow: '0 12px 30px rgba(0,0,0,0.6)', zIndex: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className="badge badge-real" style={{ fontSize: '10px', marginBottom: '4px' }}>{selectedStation.zone} ZONE</span>
                <h3 style={{ margin: '4px 0 2px 0', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                  {selectedStation.name}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--color-status-emerald)', fontFamily: 'var(--font-mono)' }}>
                  CODE: {selectedStation.code} • {selectedStation.platforms} Platforms
                </div>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '18px', cursor: 'pointer', padding: '2px 6px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#CBD5E1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              <div>📍 <strong>Location:</strong> {selectedStation.city}, {selectedStation.state}</div>
              <div>🌐 <strong>Coordinates:</strong> {selectedStation.lat.toFixed(4)}°N, {selectedStation.lon.toFixed(4)}°E</div>
              <div>⚡ <strong>Traction &amp; Signalling:</strong> 25kV AC • Kavach (TCAS) Active</div>
              <div>👥 <strong>Concourse Density:</strong> Normal (&lt; 0.8 pax/m²)</div>
              {selectedStation.code === 'ALU' && (
                <div style={{ marginTop: '6px', padding: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', fontSize: '11px', color: '#6EE7B7' }}>
                  🌴 <strong>Chord Line Milestone:</strong> ~267 km from Chennai Egmore, ~70 km from Trichy. Home of Pandian, Vaigai, and Pallavan Superfast Expresses.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
