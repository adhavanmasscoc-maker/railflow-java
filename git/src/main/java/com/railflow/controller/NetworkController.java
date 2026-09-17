package com.railflow.controller;

import com.railflow.service.NetworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller exposing Indian Railways Network Graph, Inter-Hub Topology,
 * and Station Drawer Analytics.
 */
@RestController
@RequestMapping("/api/network")
@CrossOrigin(origins = "*")
public class NetworkController {

    private final NetworkService networkService;

    @Autowired
    public NetworkController(NetworkService networkService) {
        this.networkService = networkService;
    }

    @GetMapping("/graph")
    public ResponseEntity<Map<String, Object>> getNetworkGraph() {
        return ResponseEntity.ok(networkService.getNetworkGraph());
    }

    @GetMapping("/hub/{code}")
    public ResponseEntity<Map<String, Object>> getHubDetails(@PathVariable("code") String code) {
        return ResponseEntity.ok(networkService.getHubDetails(code));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getNetworkStats() {
        return ResponseEntity.ok(networkService.getNetworkStats());
    }
}
