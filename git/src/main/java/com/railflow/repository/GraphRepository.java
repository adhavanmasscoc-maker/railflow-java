package com.railflow.repository;

import com.railflow.model.GraphEdge;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Repository interface for railway network graph topology queries.
 */
public interface GraphRepository {

    /**
     * Retrieves all directed outgoing edges from a given station.
     */
    List<GraphEdge> getOutgoingEdges(String stationCode);

    /**
     * Retrieves distinct station codes directly connected to the specified station.
     */
    List<String> getConnectedStations(String stationCode);

    /**
     * Finds routes between fromCode and toCode supporting 0, 1, 2, or 3 transfers.
     */
    List<Map<String, Object>> findRoutes(String fromCode, String toCode, int maxTransfers);

    /**
     * Total number of rail edges recorded in the database.
     */
    long countEdges();

    /**
     * Total distinct directed station pairs (corridor segments).
     */
    long countDistinctSegments();
}
