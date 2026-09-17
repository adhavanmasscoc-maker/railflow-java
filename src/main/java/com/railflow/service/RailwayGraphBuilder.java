package com.railflow.service;

import com.railflow.model.GraphEdge;
import com.railflow.model.Train;
import com.railflow.model.TrainStop;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Dynamic Railway Network Graph Builder:
 * Constructs directed consecutive edges A -> B from actual train routes,
 * supporting multiple trains per edge, segment distance calculations, and fast adjacency lookups.
 */
@Service
public class RailwayGraphBuilder {

    private static final Logger log = LoggerFactory.getLogger(RailwayGraphBuilder.class);

    private final StationMapper stationMapper;
    private final TrainRouteMapper trainRouteMapper;

    // fromStationCode -> Map<toStationCode, GraphEdge>
    private final Map<String, Map<String, GraphEdge>> adjacencyGraph = new ConcurrentHashMap<>();
    private int totalEdgeCount = 0;
    private boolean graphBuilt = false;

    @Autowired
    public RailwayGraphBuilder(StationMapper stationMapper, TrainRouteMapper trainRouteMapper) {
        this.stationMapper = stationMapper;
        this.trainRouteMapper = trainRouteMapper;
    }

    public synchronized void buildGraph() {
        if (graphBuilt && !adjacencyGraph.isEmpty()) return;
        long start = System.currentTimeMillis();

        Map<String, List<TrainStop>> allStops = trainRouteMapper.getAllStopsByTrain();
        int edgesCount = 0;

        for (Map.Entry<String, List<TrainStop>> entry : allStops.entrySet()) {
            String trainNumber = entry.getKey();
            List<TrainStop> stops = entry.getValue();
            if (stops.size() < 2) continue;

            Optional<Train> trainOpt = trainRouteMapper.getTrain(trainNumber);
            String trainName = trainOpt.map(Train::getName).orElse("Express");

            for (int i = 0; i < stops.size() - 1; i++) {
                TrainStop curr = stops.get(i);
                TrainStop next = stops.get(i + 1);

                String fromCode = curr.getStationCode();
                String toCode = next.getStationCode();

                if (fromCode.equals(toCode)) continue; // skip zero-distance loops

                // Segment distance: calculate from cumulative distance or GPS coordinates
                double segmentDist = 0.0;
                if (next.getDistanceKm() > curr.getDistanceKm()) {
                    segmentDist = next.getDistanceKm() - curr.getDistanceKm();
                } else {
                    segmentDist = stationMapper.calculateDistance(fromCode, toCode);
                }

                Map<String, GraphEdge> outEdges = adjacencyGraph.computeIfAbsent(fromCode, k -> new ConcurrentHashMap<>());
                GraphEdge edge = outEdges.get(toCode);
                if (edge == null) {
                    edge = new GraphEdge(fromCode, toCode, segmentDist);
                    outEdges.put(toCode, edge);
                    edgesCount++;
                } else if (edge.getDistanceKm() <= 0 && segmentDist > 0) {
                    edge.setDistanceKm(segmentDist);
                }

                edge.addTrain(trainNumber, trainName, curr.getDepartureTime(), next.getArrivalTime(), curr.getSequence());
            }
        }

        totalEdgeCount = edgesCount;
        graphBuilt = true;
        log.info("RailwayGraphBuilder constructed {} directed corridor edges across {} stations in {} ms",
                totalEdgeCount, adjacencyGraph.size(), (System.currentTimeMillis() - start));
    }

    public Map<String, GraphEdge> getOutgoingEdges(String stationCode) {
        if (stationCode == null) return Collections.emptyMap();
        return adjacencyGraph.getOrDefault(stationCode.trim().toUpperCase(), Collections.emptyMap());
    }

    public Optional<GraphEdge> getEdge(String fromCode, String toCode) {
        if (fromCode == null || toCode == null) return Optional.empty();
        Map<String, GraphEdge> out = adjacencyGraph.get(fromCode.trim().toUpperCase());
        if (out == null) return Optional.empty();
        return Optional.ofNullable(out.get(toCode.trim().toUpperCase()));
    }

    public Map<String, Map<String, GraphEdge>> getAdjacencyGraph() {
        return Collections.unmodifiableMap(adjacencyGraph);
    }

    public int getTotalEdgeCount() {
        return totalEdgeCount;
    }
}
