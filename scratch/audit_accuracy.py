import sqlite3
import json
import os

conn = sqlite3.connect('database/railway.db')
c = conn.cursor()

tables = [t[0] for t in c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
print("=== DATABASE ACCURACY AUDIT: database/railway.db ===")
total_records = 0
for t in tables:
    cnt = c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
    total_records += cnt
    print(f"Table '{t}': {cnt:,} records")

print(f"Total Database Rows across all tables: {total_records:,}")

# Check columns and accuracy metrics in stations
stn_cols = [col[1] for col in c.execute("PRAGMA table_info(stations)").fetchall()]
print("\nStations Columns:", stn_cols)
null_coords = c.execute("SELECT COUNT(*) FROM stations WHERE latitude IS NULL OR longitude IS NULL OR latitude = 0 OR longitude = 0").fetchone()[0]
stn_total = c.execute("SELECT COUNT(*) FROM stations").fetchone()[0]
print(f"Stations with valid coordinates: {stn_total - null_coords:,} / {stn_total:,} ({(stn_total - null_coords)/stn_total*100:.2f}%)")

if 'established_year' in stn_cols:
    valid_est = c.execute("SELECT COUNT(*) FROM stations WHERE established_year IS NOT NULL AND established_year > 0").fetchone()[0]
    print(f"Stations with established_year: {valid_est:,} / {stn_total:,} ({valid_est/stn_total*100:.2f}%)")

if 'daily_footfall' in stn_cols:
    valid_foot = c.execute("SELECT COUNT(*) FROM stations WHERE daily_footfall IS NOT NULL AND daily_footfall > 0").fetchone()[0]
    print(f"Stations with daily_footfall: {valid_foot:,} / {stn_total:,} ({valid_foot/stn_total*100:.2f}%)")

# Check train_stops accuracy
ts_cols = [col[1] for col in c.execute("PRAGMA table_info(train_stops)").fetchall()]
print("\nTrain_Stops Columns:", ts_cols)
ts_total = c.execute("SELECT COUNT(*) FROM train_stops").fetchone()[0]
if 'platform_number' in ts_cols:
    valid_plat = c.execute("SELECT COUNT(*) FROM train_stops WHERE platform_number IS NOT NULL AND platform_number > 0").fetchone()[0]
    print(f"Train stops with assigned platform_number: {valid_plat:,} / {ts_total:,} ({valid_plat/ts_total*100:.2f}%)")

# Check trains accuracy
train_cols = [col[1] for col in c.execute("PRAGMA table_info(trains)").fetchall()]
print("\nTrains Columns:", train_cols)
train_total = c.execute("SELECT COUNT(*) FROM trains").fetchone()[0]
if 'inaugurated_year' in train_cols:
    valid_inaug = c.execute("SELECT COUNT(*) FROM trains WHERE inaugurated_year IS NOT NULL AND inaugurated_year > 0").fetchone()[0]
    print(f"Trains with inaugurated_year: {valid_inaug:,} / {train_total:,} ({valid_inaug/train_total*100:.2f}%)")

# Check station_aliases
if 'station_aliases' in tables:
    alias_cnt = c.execute("SELECT COUNT(*) FROM station_aliases").fetchone()[0]
    print(f"\nStation Aliases: {alias_cnt:,} mappings")

conn.close()
