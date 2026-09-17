package com.railflow.service;

import java.util.concurrent.ConcurrentHashMap;

/**
 * TelemetryCache — Free In-Memory Cache for Live Train & Platform Telemetry.
 * Avoids repeated network hits to public NTES endpoints by caching timetable data
 * in a lightweight concurrent memory map with a 5-minute (300,000 ms) TTL.
 */
public class TelemetryCache {

    private static final ConcurrentHashMap<String, CachedData> cache = new ConcurrentHashMap<>();
    private static final long TTL_MILLIS = 300_000L; // 5 minutes

    public record CachedData(String payload, long timestamp) {}

    /**
     * Retrieves cached train telemetry, or fetches fresh data from FreeRailClient if expired.
     *
     * @param trainNo 5-digit Indian Railways train number
     * @return Telemetry payload string
     */
    public static String getOrFetch(String trainNo) {
        long now = System.currentTimeMillis();
        CachedData entry = cache.get(trainNo);

        // Return cached entry if fresh (< 5 minutes old)
        if (entry != null && (now - entry.timestamp()) < TTL_MILLIS) {
            return entry.payload();
        }

        // Fetch fresh telemetry from free public endpoints
        String freshData = FreeRailClient.fetchLiveTrainStatus(trainNo);
        cache.put(trainNo, new CachedData(freshData, now));
        return freshData;
    }

    /**
     * Manually updates cache entry for a train.
     */
    public static void put(String trainNo, String payload) {
        cache.put(trainNo, new CachedData(payload, System.currentTimeMillis()));
    }

    /**
     * Clears all cached telemetry entries.
     */
    public static void clear() {
        cache.clear();
    }

    /**
     * Returns total active cached train records.
     */
    public static int size() {
        return cache.size();
    }
}
