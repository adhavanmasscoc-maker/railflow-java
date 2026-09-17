package com.railflow.controller;

import com.railflow.model.CrowdTelemetry;
import com.railflow.service.CrowdSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller providing live 3,000 ms simulated platform crowd telemetry
 * and data provenance guarantees.
 */
@RestController
@RequestMapping("/api/crowd")
@CrossOrigin(origins = "*")
public class CrowdSimulationController {

    private final CrowdSimulationService crowdSimulationService;

    @Autowired
    public CrowdSimulationController(CrowdSimulationService crowdSimulationService) {
        this.crowdSimulationService = crowdSimulationService;
    }

    @GetMapping("/telemetry/latest")
    public ResponseEntity<List<CrowdTelemetry>> getLatestTelemetry() {
        return ResponseEntity.ok(crowdSimulationService.getLatestTelemetry());
    }

    @GetMapping("/provenance")
    public ResponseEntity<Map<String, Object>> getProvenance() {
        return ResponseEntity.ok(crowdSimulationService.getProvenanceDetails());
    }

    @PostMapping("/tick")
    public ResponseEntity<Map<String, String>> triggerManualTick() {
        crowdSimulationService.simulationTick();
        return ResponseEntity.ok(Map.of("status", "TICK_EXECUTED", "intervalMs", "3000"));
    }
}
