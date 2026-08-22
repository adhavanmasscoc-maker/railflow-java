package com.railflow.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.railflow.service.IrctcApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for external live railway schedules and station lookup feeds.
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

    @GetMapping("/trains-by-station")
    public ResponseEntity<JsonNode> getTrainsByStation(@RequestParam(defaultValue = "NDLS") String stationCode) {
        return ResponseEntity.ok(irctcApiService.getTrainsByStation(stationCode));
    }

    @GetMapping("/search-station")
    public ResponseEntity<JsonNode> searchStation(@RequestParam String query) {
        return ResponseEntity.ok(irctcApiService.searchStation(query));
    }

    @GetMapping("/train-between-stations")
    public ResponseEntity<JsonNode> trainBetweenStations(@RequestParam String from, @RequestParam String to) {
        return ResponseEntity.ok(irctcApiService.trainBetweenStations(from, to));
    }
}
