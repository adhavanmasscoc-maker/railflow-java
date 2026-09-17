package com.railflow.controller;

import com.railflow.model.Station;
import com.railflow.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller providing station directory, intelligent search, and details from SQLite.
 */
@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "*")
public class StationController {

    private final StationService stationService;

    @Autowired
    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping
    public ResponseEntity<List<Station>> getAllStations(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size) {
        List<Station> all = stationService.getAllStations();
        int start = Math.min(page * size, all.size());
        int end = Math.min(start + size, all.size());
        return ResponseEntity.ok(all.subList(start, end));
    }

    @GetMapping("/{code}")
    public ResponseEntity<Station> getStationByCode(@PathVariable("code") String code) {
        return ResponseEntity.ok(stationService.getStationByCode(code));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Station>> searchStations(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "query", required = false) String query) {
        String term = (q != null && !q.isBlank()) ? q : query;
        if (term == null || term.isBlank()) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(stationService.searchStations(term));
    }
}
