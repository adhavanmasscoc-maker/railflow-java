package com.railflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.railflow.model.Station;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Station Master Mapper: Dynamically maps all stations from stations.json.
 * Supports case-insensitive searching by code, name, city, and state with 0ms in-memory indexing.
 */
@Service
public class StationMapper {

    private static final Logger log = LoggerFactory.getLogger(StationMapper.class);

    private final Map<String, Station> stationByCode = new ConcurrentHashMap<>();
    private final List<Station> allStations = new ArrayList<>();
    private final Set<String> unresolvedCodes = ConcurrentHashMap.newKeySet();
    private boolean loaded = false;

    public synchronized void loadStations(File file) {
        if (loaded && !stationByCode.isEmpty()) return;
        long start = System.currentTimeMillis();

        if (file == null || !file.exists()) {
            log.warn("stations.json file not found at: {}", file != null ? file.getAbsolutePath() : "null");
            return;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(file);

            if (root.isArray()) {
                for (JsonNode node : root) {
                    String code = node.path("code").asText("").trim().toUpperCase();
                    if (code.isEmpty()) continue;

                    String name = node.path("name").asText("").trim();
                    String state = node.path("state").asText("").trim();
                    String zone = node.path("zone").asText("").trim();
                    String address = node.path("address").asText("").trim();

                    double lat = 0.0;
                    double lon = 0.0;
                    JsonNode coords = node.path("coordinates");
                    if (coords.isObject()) {
                        lat = coords.path("latitude").asDouble(0.0);
                        lon = coords.path("longitude").asDouble(0.0);
                    }

                    // Normalize station display name
                    if (name.isEmpty()) name = code;

                    Station stn = new Station(code, name, state, zone, address, lat, lon);
                    stationByCode.put(code, stn);
                    allStations.add(stn);
                }
            }

            loaded = true;
            log.info("StationMapper loaded {} stations from {} in {} ms",
                    stationByCode.size(), file.getName(), (System.currentTimeMillis() - start));

        } catch (Exception e) {
            log.error("Failed to parse stations.json: {}", e.getMessage(), e);
        }
    }

    /**
     * Resolves station code against dataset. Returns Optional station or logs unresolved code.
     */
    public Optional<Station> getStation(String code) {
        if (code == null || code.isBlank()) return Optional.empty();
        String clean = code.trim().toUpperCase();
        Station s = stationByCode.get(clean);
        if (s == null) {
            unresolvedCodes.add(clean);
        }
        return Optional.ofNullable(s);
    }

    /**
     * Resolves station code to display name. Gracefully falls back to UNKNOWN_STATION instead of crashing.
     */
    public String resolveStationName(String code) {
        if (code == null || code.isBlank()) return "UNKNOWN_STATION";
        String clean = code.trim().toUpperCase();
        Station s = stationByCode.get(clean);
        if (s != null) {
            return s.getName();
        }
        unresolvedCodes.add(clean);
        return "UNKNOWN_STATION (" + clean + ")";
    }

    /**
     * High-speed autocomplete searching across station code, name, city, address, and state.
     */
    public List<Station> searchStations(String query, int limit) {
        if (query == null || query.isBlank()) {
            return allStations.stream().limit(Math.max(1, limit)).collect(Collectors.toList());
        }

        String q = query.trim().toUpperCase();
        int max = Math.max(1, limit);

        // Tiered matching for high relevance
        List<Station> exactCode = new ArrayList<>();
        List<Station> prefixCode = new ArrayList<>();
        List<Station> prefixName = new ArrayList<>();
        List<Station> containsName = new ArrayList<>();
        List<Station> otherMatches = new ArrayList<>();

        for (Station s : allStations) {
            String sc = s.getCode();
            String sn = s.getName().toUpperCase();
            String sa = s.getAddress().toUpperCase();
            String ss = s.getState().toUpperCase();

            if (sc.equals(q)) {
                exactCode.add(s);
            } else if (sc.startsWith(q)) {
                prefixCode.add(s);
            } else if (sn.startsWith(q)) {
                prefixName.add(s);
            } else if (sn.contains(q)) {
                containsName.add(s);
            } else if (sa.contains(q) || ss.contains(q)) {
                otherMatches.add(s);
            }
        }

        List<Station> results = new ArrayList<>();
        results.addAll(exactCode);
        results.addAll(prefixCode);
        results.addAll(prefixName);
        results.addAll(containsName);
        results.addAll(otherMatches);

        return results.stream().limit(max).collect(Collectors.toList());
    }

    public List<Station> getAllStations() {
        return Collections.unmodifiableList(allStations);
    }

    public int getStationCount() {
        return stationByCode.size();
    }

    public Set<String> getUnresolvedCodes() {
        return Collections.unmodifiableSet(unresolvedCodes);
    }

    /**
     * Calculates great-circle Haversine distance in kilometers between two stations.
     */
    public double calculateDistance(String fromCode, String toCode) {
        Optional<Station> s1 = getStation(fromCode);
        Optional<Station> s2 = getStation(toCode);
        if (s1.isEmpty() || s2.isEmpty()) return 0.0;

        double lat1 = s1.get().getLatitude();
        double lon1 = s1.get().getLongitude();
        double lat2 = s2.get().getLatitude();
        double lon2 = s2.get().getLongitude();

        if (lat1 == 0.0 || lon1 == 0.0 || lat2 == 0.0 || lon2 == 0.0) return 0.0;

        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 1.2 * 10.0) / 10.0; // 1.2 rail curvature factor
    }
}
