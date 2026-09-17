-- Extreme Performance Configuration
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA mmap_size = 268435456; -- 256MB memory-mapped I/O
PRAGMA cache_size = -64000;   -- 64MB cache
PRAGMA foreign_keys = ON;
PRAGMA temp_store = MEMORY;

-- 1. Stations
CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zone TEXT,
    lat REAL,
    lng REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Trains
CREATE TABLE IF NOT EXISTS trains (
    id TEXT PRIMARY KEY,
    train_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    source_station_id TEXT NOT NULL,
    dest_station_id TEXT NOT NULL,
    running_days TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_station_id) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (dest_station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- 3. Routes
CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    train_id TEXT NOT NULL,
    station_id TEXT NOT NULL,
    stop_sequence INTEGER NOT NULL,
    arrival_time TEXT,
    departure_time TEXT,
    distance_km REAL,
    day_count INTEGER DEFAULT 1,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    CHECK (stop_sequence > 0)
);

-- 4. Platforms
CREATE TABLE IF NOT EXISTS platforms (
    id TEXT PRIMARY KEY,
    station_id TEXT NOT NULL,
    platform_number INTEGER NOT NULL,
    capacity INTEGER DEFAULT 0,
    current_occupancy INTEGER DEFAULT 0,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- 5. Analytics (Time-series data for crowd monitoring)
CREATE TABLE IF NOT EXISTS analytics (
    id TEXT PRIMARY KEY,
    platform_id TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    crowd_density_percentage REAL,
    predicted_trend TEXT,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 6. PNR Status
CREATE TABLE IF NOT EXISTS pnr_status (
    pnr_number TEXT PRIMARY KEY,
    train_id TEXT NOT NULL,
    journey_date TEXT NOT NULL,
    boarding_station_id TEXT,
    dest_station_id TEXT,
    booking_status TEXT,
    current_status TEXT,
    coach_position TEXT,
    passenger_count INTEGER,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    FOREIGN KEY (boarding_station_id) REFERENCES stations(id) ON DELETE CASCADE,
    FOREIGN KEY (dest_station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- 7. API Keys (For internal/partner integrations)
CREATE TABLE IF NOT EXISTS api_keys (
    key_hash TEXT PRIMARY KEY,
    owner_name TEXT NOT NULL,
    rate_limit INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT 1
);

-- 8. Audit Logs (For API requests and PNR fetches)
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    endpoint TEXT,
    method TEXT,
    ip_address TEXT,
    status_code INTEGER,
    response_time_ms REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 20+ Strategic B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_stations_code ON stations(code);
CREATE INDEX IF NOT EXISTS idx_stations_name ON stations(name);
CREATE INDEX IF NOT EXISTS idx_stations_city ON stations(city);

CREATE INDEX IF NOT EXISTS idx_trains_number ON trains(train_number);
CREATE INDEX IF NOT EXISTS idx_trains_name ON trains(name);
CREATE INDEX IF NOT EXISTS idx_trains_source ON trains(source_station_id);
CREATE INDEX IF NOT EXISTS idx_trains_dest ON trains(dest_station_id);

CREATE INDEX IF NOT EXISTS idx_routes_train_id ON routes(train_id);
CREATE INDEX IF NOT EXISTS idx_routes_station_id ON routes(station_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_routes_train_seq ON routes(train_id, stop_sequence);

CREATE INDEX IF NOT EXISTS idx_platforms_station ON platforms(station_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_platforms_station_num ON platforms(station_id, platform_number);

CREATE INDEX IF NOT EXISTS idx_analytics_platform ON analytics(platform_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_platform_time ON analytics(platform_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_pnr_train ON pnr_status(train_id);
CREATE INDEX IF NOT EXISTS idx_pnr_date ON pnr_status(journey_date);
CREATE INDEX IF NOT EXISTS idx_pnr_status ON pnr_status(current_status);
CREATE INDEX IF NOT EXISTS idx_pnr_updated ON pnr_status(last_updated);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_endpoint ON audit_logs(endpoint);
