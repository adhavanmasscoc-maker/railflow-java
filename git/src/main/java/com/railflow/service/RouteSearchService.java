package com.railflow.service;

import com.railflow.model.GraphEdge;
import com.railflow.model.Station;
import com.railflow.model.Train;
import com.railflow.model.TrainStop;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Route Search Engine:
 * Implements Direct train discovery, 1-Transfer routing, and multi-hop graph pathfinding
 * derived strictly from actual trainroutes.json data.
 */
@Service
public class RouteSearchService {

    private static final Logger log = LoggerFactory.getLogger(RouteSearchService.class);

    private final StationMapper stationMapper;
    private final TrainRouteMapper trainRouteMapper;
    private final RailwayGraphBuilder graphBuilder;

    @Autowired(required = false)
    private com.railflow.repository.jdbc.JdbcRouteRepository jdbcRouteRepository;

    @Autowired(required = false)
    private com.railflow.repository.jdbc.JdbcGraphRepository jdbcGraphRepository;

    @Autowired(required = false)
    private com.railflow.repository.jdbc.JdbcStationRepository jdbcStationRepository;

    @Autowired
    public RouteSearchService(StationMapper stationMapper, TrainRouteMapper trainRouteMapper, RailwayGraphBuilder graphBuilder) {
        this.stationMapper = stationMapper;
        this.trainRouteMapper = trainRouteMapper;
        this.graphBuilder = graphBuilder;
    }

    /**
     * Search routes between fromStation and toStation supporting direct and transfer connections.
     */
    public Map<String, Object> searchRoutes(String fromCode, String toCode, int maxTransfers) {
        String from = fromCode != null ? fromCode.trim().toUpperCase() : "";
        String to = toCode != null ? toCode.trim().toUpperCase() : "";

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("from", Map.of(
                "code", from,
                "name", stationMapper.resolveStationName(from)
        ));
        result.put("to", Map.of(
                "code", to,
                "name", stationMapper.resolveStationName(to)
        ));

        List<Map<String, Object>> routes = new ArrayList<>();

        if (from.isEmpty() || to.isEmpty() || from.equals(to)) {
            result.put("routes", routes);
            return result;
        }

        // 1. Find Direct Trains (transfers = 0)
        List<DirectTrainRoute> directList = findDirectTrains(from, to);
        if (!directList.isEmpty()) {
            for (DirectTrainRoute dtr : directList) {
                Map<String, Object> r = new LinkedHashMap<>();
                r.put("type", "DIRECT");
                r.put("transfers", 0);
                r.put("stations", dtr.stations);
                r.put("trains", List.of(Map.of(
                        "number", dtr.train.getTrainNumber(),
                        "name", dtr.train.getName(),
                        "type", dtr.train.getType(),
                        "departure", dtr.departureTime,
                        "arrival", dtr.arrivalTime,
                        "distance", dtr.distanceKm,
                        "runningDays", dtr.train.getRoute()
                )));
                r.put("distanceKm", dtr.distanceKm);
                r.put("estimatedMinutes", dtr.estimatedMinutes);
                routes.add(r);
            }
        }

        // 2. If maxTransfers >= 1 and either direct routes are few or specifically requested
        if (maxTransfers >= 1 && routes.size() < 10) {
            List<Map<String, Object>> transferRoutes = findOneTransferRoutes(from, to);
            routes.addAll(transferRoutes);
        }

        // 3. Fallback: Graph Shortest Path if no direct or 1-transfer routes found
        if (routes.isEmpty()) {
            List<String> path = findShortestGraphPath(from, to);
            if (!path.isEmpty()) {
                Map<String, Object> r = new LinkedHashMap<>();
                r.put("type", "TRANSFER");
                r.put("transfers", Math.max(1, path.size() - 2));

                List<Map<String, String>> stnList = path.stream()
                        .map(c -> Map.of("code", c, "name", stationMapper.resolveStationName(c)))
                        .collect(Collectors.toList());
                r.put("stations", stnList);

                // Derive trains along path
                List<Map<String, String>> trainList = new ArrayList<>();
                double totalDist = 0.0;
                for (int i = 0; i < path.size() - 1; i++) {
                    String u = path.get(i);
                    String v = path.get(i + 1);
                    Optional<GraphEdge> edgeOpt = graphBuilder.getEdge(u, v);
                    if (edgeOpt.isPresent()) {
                        GraphEdge edge = edgeOpt.get();
                        totalDist += edge.getDistanceKm();
                        if (!edge.getTrains().isEmpty()) {
                            GraphEdge.TrainServiceInfo tsi = edge.getTrains().get(0);
                            trainList.add(Map.of("number", tsi.getTrainNumber(), "name", tsi.getTrainName()));
                        }
                    } else {
                        totalDist += stationMapper.calculateDistance(u, v);
                    }
                }
                r.put("trains", trainList.isEmpty() ? List.of(Map.of("number", "TIMETABLE_NOT_AVAILABLE", "name", "Connecting Express")) : trainList);
                r.put("distanceKm", Math.round(totalDist));
                r.put("estimatedMinutes", (int) Math.round((totalDist / 60.0) * 60));
                routes.add(r);
            }
        }

        result.put("routes", routes);
        return result;
    }

    /**
     * Finds genuine direct trains whose route stops contain fromCode before toCode.
     */
    public List<DirectTrainRoute> findDirectTrains(String fromCode, String toCode) {
        List<DirectTrainRoute> list = new ArrayList<>();

        // Priority 1: Query SQLite database/railway.db via JDBC RouteRepository
        if (jdbcRouteRepository != null) {
            try {
                List<Map<String, Object>> dbMatches = jdbcRouteRepository.findDirectTrains(fromCode, toCode);
                if (!dbMatches.isEmpty()) {
                    for (Map<String, Object> m : dbMatches) {
                        String tNo = (String) m.get("trainNumber");
                        String tName = (String) m.get("trainName");
                        String tType = (String) m.get("trainType");
                        String dep = (String) m.get("departureTime");
                        String arr = (String) m.get("arrivalTime");
                        long dist = (long) m.get("distanceKm");
                        int seqFrom = (int) m.get("fromSequence");
                        int seqTo = (int) m.get("toSequence");

                        Train train = new Train("TRN-" + tNo, tNo, tName, fromCode + " -> " + toCode, fromCode, toCode, tType, 1000, 0);
                        if (m.get("frequency") != null) {
                            train.setRoute((String) m.get("frequency"));
                        }

                        DirectTrainRoute dtr = new DirectTrainRoute();
                        dtr.train = train;
                        dtr.departureTime = dep != null ? dep : "-";
                        dtr.arrivalTime = arr != null ? arr : "-";
                        dtr.distanceKm = dist;
                        dtr.estimatedMinutes = (int) Math.round((dist / 70.0) * 60);

                        List<TrainStop> allTrainStops = jdbcRouteRepository.getStopsByTrainNumber(tNo);
                        List<Map<String, String>> stnList = new ArrayList<>();
                        for (TrainStop ts : allTrainStops) {
                            if (ts.getSequence() >= seqFrom && ts.getSequence() <= seqTo) {
                                stnList.add(Map.of("code", ts.getStationCode(), "name", ts.getStationName()));
                            }
                        }
                        dtr.stations = stnList.isEmpty() ? List.of(Map.of("code", fromCode, "name", fromCode), Map.of("code", toCode, "name", toCode)) : stnList;
                        list.add(dtr);
                    }
                    list.sort(Comparator.comparingDouble(d -> d.distanceKm));
                    return list;
                }
            } catch (Exception e) {
                log.warn("JDBC direct train search fallback to in-memory: {}", e.getMessage());
            }
        }

        // Priority 2: In-memory fallback
        Map<String, List<TrainStop>> allStops = trainRouteMapper.getAllStopsByTrain();

        for (Map.Entry<String, List<TrainStop>> entry : allStops.entrySet()) {
            String trainNumber = entry.getKey();
            List<TrainStop> stops = entry.getValue();

            int fromIdx = -1;
            int toIdx = -1;

            for (int i = 0; i < stops.size(); i++) {
                String c = stops.get(i).getStationCode();
                if (c.equals(fromCode) && fromIdx == -1) {
                    fromIdx = i;
                } else if (c.equals(toCode) && fromIdx != -1) {
                    toIdx = i;
                    break;
                }
            }

            if (fromIdx != -1 && toIdx != -1 && fromIdx < toIdx) {
                Optional<Train> trainOpt = trainRouteMapper.getTrain(trainNumber);
                Train train = trainOpt.orElseGet(() -> new Train("TRN-" + trainNumber, trainNumber, "Express", fromCode + "-" + toCode, fromCode, toCode, "EXP", 1000, 0));

                TrainStop sFrom = stops.get(fromIdx);
                TrainStop sTo = stops.get(toIdx);

                double dist = 0.0;
                if (sTo.getDistanceKm() > sFrom.getDistanceKm()) {
                    dist = sTo.getDistanceKm() - sFrom.getDistanceKm();
                } else {
                    dist = stationMapper.calculateDistance(fromCode, toCode);
                }

                // Collect intermediate stations
                List<Map<String, String>> stnList = new ArrayList<>();
                for (int k = fromIdx; k <= toIdx; k++) {
                    TrainStop ts = stops.get(k);
                    stnList.add(Map.of("code", ts.getStationCode(), "name", ts.getStationName()));
                }

                int estMin = (int) Math.round((dist / 70.0) * 60);

                DirectTrainRoute dtr = new DirectTrainRoute();
                dtr.train = train;
                dtr.stations = stnList;
                dtr.departureTime = sFrom.getDepartureTime();
                dtr.arrivalTime = sTo.getArrivalTime();
                dtr.distanceKm = Math.round(dist);
                dtr.estimatedMinutes = estMin;

                list.add(dtr);
            }
        }

        // Sort by shortest distance
        list.sort(Comparator.comparingDouble(d -> d.distanceKm));
        return list;
    }

    /**
     * Finds 1-transfer connections through genuine railway interchange stations.
     */
    private List<Map<String, Object>> findOneTransferRoutes(String fromCode, String toCode) {
        List<Map<String, Object>> transferResults = new ArrayList<>();

        // Stations reachable from `fromCode` via direct trains
        Map<String, List<TrainStop>> allStops = trainRouteMapper.getAllStopsByTrain();
        Map<String, String> fromReach = new HashMap<>(); // interchange -> train1
        for (Map.Entry<String, List<TrainStop>> entry : allStops.entrySet()) {
            List<TrainStop> stops = entry.getValue();
            int fIdx = -1;
            for (int i = 0; i < stops.size(); i++) {
                if (stops.get(i).getStationCode().equals(fromCode)) {
                    fIdx = i;
                    break;
                }
            }
            if (fIdx != -1) {
                for (int j = fIdx + 1; j < Math.min(stops.size(), fIdx + 25); j++) {
                    String inter = stops.get(j).getStationCode();
                    fromReach.putIfAbsent(inter, entry.getKey());
                }
            }
        }

        // Check which interchanges can reach `toCode`
        int found = 0;
        for (Map.Entry<String, List<TrainStop>> entry : allStops.entrySet()) {
            if (found >= 5) break;
            List<TrainStop> stops = entry.getValue();
            int toIdx = -1;
            for (int i = 0; i < stops.size(); i++) {
                if (stops.get(i).getStationCode().equals(toCode)) {
                    toIdx = i;
                    break;
                }
            }
            if (toIdx != -1) {
                for (int i = 0; i < toIdx; i++) {
                    String inter = stops.get(i).getStationCode();
                    if (fromReach.containsKey(inter) && !inter.equals(fromCode) && !inter.equals(toCode)) {
                        String t1Num = fromReach.get(inter);
                        String t2Num = entry.getKey();
                        if (t1Num.equals(t2Num)) continue; // direct train handled elsewhere

                        Train t1 = trainRouteMapper.getTrain(t1Num).orElse(null);
                        Train t2 = trainRouteMapper.getTrain(t2Num).orElse(null);
                        if (t1 != null && t2 != null) {
                            Map<String, Object> route = new LinkedHashMap<>();
                            route.put("type", "TRANSFER");
                            route.put("transfers", 1);
                            route.put("interchangeStation", Map.of("code", inter, "name", stationMapper.resolveStationName(inter)));
                            route.put("stations", List.of(
                                    Map.of("code", fromCode, "name", stationMapper.resolveStationName(fromCode)),
                                    Map.of("code", inter, "name", stationMapper.resolveStationName(inter)),
                                    Map.of("code", toCode, "name", stationMapper.resolveStationName(toCode))
                            ));
                            route.put("trains", List.of(
                                    Map.of("number", t1.getTrainNumber(), "name", t1.getName(), "leg", fromCode + " ➔ " + inter),
                                    Map.of("number", t2.getTrainNumber(), "name", t2.getName(), "leg", inter + " ➔ " + toCode)
                            ));
                            double d1 = stationMapper.calculateDistance(fromCode, inter);
                            double d2 = stationMapper.calculateDistance(inter, toCode);
                            route.put("distanceKm", Math.round(d1 + d2));
                            route.put("estimatedMinutes", (int) Math.round(((d1 + d2) / 60.0) * 60));
                            transferResults.add(route);
                            found++;
                            break;
                        }
                    }
                }
            }
        }

        return transferResults;
    }

    /**
     * Breadth-first search for shortest path across directed graph edges.
     */
    private List<String> findShortestGraphPath(String start, String target) {
        if (start.equals(target)) return List.of(start);

        Queue<String> queue = new LinkedList<>();
        Map<String, String> parent = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(start);
        visited.add(start);

        int maxSearch = 4000;
        int searched = 0;

        while (!queue.isEmpty() && searched < maxSearch) {
            String curr = queue.poll();
            searched++;

            if (curr.equals(target)) {
                List<String> path = new ArrayList<>();
                String step = target;
                while (step != null) {
                    path.add(0, step);
                    step = parent.get(step);
                }
                return path;
            }

            Map<String, GraphEdge> outEdges = graphBuilder.getOutgoingEdges(curr);
            for (String next : outEdges.keySet()) {
                if (!visited.contains(next)) {
                    visited.add(next);
                    parent.put(next, curr);
                    queue.add(next);
                }
            }
        }

        return Collections.emptyList();
    }

    public static class DirectTrainRoute {
        public Train train;
        public List<Map<String, String>> stations;
        public String departureTime;
        public String arrivalTime;
        public double distanceKm;
        public int estimatedMinutes;
    }
}
