package com.railflow.service;

import java.util.Map;

/**
 * Service interface for Indian Railways Network Graph and Hub Topology.
 */
public interface NetworkService {
    Map<String, Object> getNetworkGraph();
    Map<String, Object> getHubDetails(String stationCode);
    Map<String, Object> getNetworkStats();
}
