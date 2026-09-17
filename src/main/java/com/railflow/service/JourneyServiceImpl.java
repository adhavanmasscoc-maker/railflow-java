package com.railflow.service;

import com.railflow.dao.NetworkDAO;
import com.railflow.dao.StationDAO;
import com.railflow.dao.TrainDAO;
import com.railflow.exception.StationNotFoundException;
import com.railflow.model.JourneyPlanResult;
import com.railflow.model.Station;
import com.railflow.model.Train;
import com.railflow.model.TrainRoute;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Enterprise implementation of JourneyService leveraging JDBC, Network Graph routing,
 * and direct train timetable lookups.
 */
@Service
public class JourneyServiceImpl implements JourneyService {

    private final StationDAO stationDAO;
    private final TrainDAO trainDAO;
    private final NetworkDAO networkDAO;

    @Autowired
    public JourneyServiceImpl(StationDAO stationDAO, TrainDAO trainDAO, NetworkDAO networkDAO) {
        this.stationDAO = stationDAO;
        this.trainDAO = trainDAO;
        this.networkDAO = networkDAO;
    }

    @Override
    public JourneyPlanResult planJourney(String fromInput, String toInput) {
        if (fromInput == null || fromInput.isBlank() || toInput == null || toInput.isBlank()) {
            throw new IllegalArgumentException("From and To station parameters must not be empty.");
        }

        Station fromStation = resolveStation(fromInput);
        Station toStation = resolveStation(toInput);

        if (fromStation.getCode().equalsIgnoreCase(toStation.getCode())) {
            throw new IllegalArgumentException("Source and destination stations cannot be the same.");
        }

        // 1. Check for direct trains
        List<Train> directTrains = trainDAO.findBetweenStations(fromStation.getCode(), toStation.getCode());
        List<Station> routeSequence = new ArrayList<>();
        double distanceKm = 0.0;
        int estimatedMinutes = 0;
        String corridorName = "National Railway Corridor";

        if (!directTrains.isEmpty()) {
            Train sampleTrain = directTrains.get(0);
            List<TrainRoute> stops = trainDAO.getRoutesForTrain(sampleTrain.getTrainNumber());
            
            boolean recording = false;
            double startDist = 0.0;
            double endDist = 0.0;

            for (TrainRoute r : stops) {
                if (r.getStationCode().equalsIgnoreCase(fromStation.getCode())) {
                    recording = true;
                    startDist = r.getDistanceKm();
                }
                if (recording) {
                    stationDAO.findByCode(r.getStationCode()).ifPresent(routeSequence::add);
                }
                if (r.getStationCode().equalsIgnoreCase(toStation.getCode())) {
                    endDist = r.getDistanceKm();
                    break;
                }
            }
            distanceKm = Math.max(10.0, Math.abs(endDist - startDist));
            estimatedMinutes = (int) Math.round((distanceKm / 75.0) * 60.0);
            corridorName = sampleTrain.getName() + " Direct Line";
        } else {
            // 2. Multi-hop Graph Traversal (Shortest Path over station connections)
            List<String> pathCodes = findShortestPath(fromStation.getCode(), toStation.getCode());
            for (String code : pathCodes) {
                stationDAO.findByCode(code).ifPresent(routeSequence::add);
            }

            if (routeSequence.isEmpty()) {
                routeSequence.add(fromStation);
                routeSequence.add(toStation);
            }

            // Estimate distance from coordinates or default hop distance
            distanceKm = estimateRouteDistance(routeSequence);
            estimatedMinutes = (int) Math.round((distanceKm / 65.0) * 60.0);
            corridorName = "Inter-Network Trans-India Route";
        }

        int segmentCount = Math.max(1, routeSequence.size() - 1);
        int hours = estimatedMinutes / 60;
        int mins = estimatedMinutes % 60;
        String summary = String.format("%d km • Approx %dh %02dm • %d Route Segments",
                Math.round(distanceKm), hours, mins, segmentCount);

        return new JourneyPlanResult(
                fromStation,
                toStation,
                distanceKm,
                estimatedMinutes,
                corridorName,
                directTrains,
                routeSequence,
                segmentCount,
                summary
        );
    }

    @Override
    public List<Map<String, Object>> getCorridors() {
        return networkDAO.getAllCorridors();
    }

    private Station resolveStation(String query) {
        String trimmed = query.trim();
        Optional<Station> exact = stationDAO.findByCode(trimmed);
        if (exact.isPresent()) return exact.get();

        List<Station> candidates = stationDAO.search(trimmed, 1);
        if (!candidates.isEmpty()) return candidates.get(0);

        throw new StationNotFoundException("No railway station resolved for input: '" + query + "'");
    }

    private List<String> findShortestPath(String start, String target) {
        List<Map<String, Object>> connections = networkDAO.getAllConnections();
        Map<String, List<String>> graph = new HashMap<>();

        for (Map<String, Object> conn : connections) {
            String u = ((String) conn.get("source_station_code")).toUpperCase();
            String v = ((String) conn.get("destination_station_code")).toUpperCase();
            graph.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
            graph.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
        }

        Queue<String> queue = new LinkedList<>();
        Map<String, String> parentMap = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(start.toUpperCase());
        visited.add(start.toUpperCase());

        boolean found = false;
        while (!queue.isEmpty()) {
            String curr = queue.poll();
            if (curr.equalsIgnoreCase(target)) {
                found = true;
                break;
            }
            List<String> neighbors = graph.getOrDefault(curr, Collections.emptyList());
            for (String nxt : neighbors) {
                if (!visited.contains(nxt)) {
                    visited.add(nxt);
                    parentMap.put(nxt, curr);
                    queue.add(nxt);
                }
            }
        }

        if (!found) {
            return List.of(start, target);
        }

        LinkedList<String> path = new LinkedList<>();
        String step = target.toUpperCase();
        while (step != null) {
            path.addFirst(step);
            step = parentMap.get(step);
        }
        return path;
    }

    private double estimateRouteDistance(List<Station> path) {
        double dist = 0.0;
        for (int i = 0; i < path.size() - 1; i++) {
            dist += 280.0; // average inter-hub distance in km
        }
        return Math.max(50.0, dist);
    }
}
