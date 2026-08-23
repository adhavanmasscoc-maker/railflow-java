package com.railflow.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.railflow.service.IrctcApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for external live railway schedules, instant PNR lookups, and real-time train tracking.
 */
@RestController
@RequestMapping("/api/irctc")
@CrossOrigin(origins = "*")
public class IrctcController {

    private final IrctcApiService irctcApiService;

    @Autowired
    public IrctcController(IrctcApiService irctcApiService) {
        this.irctcApiService = irctcApiService;
    }

    /** GET /api/irctc/pnr/{pnr} - Instant PNR status lookup (SQLite cached + high fidelity generator) */
    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<JsonNode> getPnrStatus(@PathVariable String pnr) {
        return ResponseEntity.ok(irctcApiService.getPnrStatus(pnr));
    }

    /** GET /api/irctc/train-running-status/{trainNo} - Real-time train tracking and delay */
    @GetMapping("/train-running-status/{trainNo}")
    public ResponseEntity<JsonNode> getTrainRunningStatus(@PathVariable String trainNo) {
        return ResponseEntity.ok(irctcApiService.getTrainRunningStatus(trainNo));
    }

    /** GET /api/irctc/trains-by-station - Live departure/arrival board */
    @GetMapping("/trains-by-station")
    public ResponseEntity<JsonNode> getTrainsByStation(@RequestParam(defaultValue = "NDLS") String stationCode) {
        return ResponseEntity.ok(irctcApiService.getTrainsByStation(stationCode));
    }

    /** GET /api/irctc/search-station - Search stations by code or name */
    @GetMapping("/search-station")
    public ResponseEntity<JsonNode> searchStation(@RequestParam String query) {
        return ResponseEntity.ok(irctcApiService.searchStation(query));
    }

    /** GET /api/irctc/train-between-stations - Journey search */
    @GetMapping("/train-between-stations")
    public ResponseEntity<JsonNode> trainBetweenStations(@RequestParam String from, @RequestParam String to) {
        return ResponseEntity.ok(irctcApiService.trainBetweenStations(from, to));
    }
}
