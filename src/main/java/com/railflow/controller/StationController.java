package com.railflow.controller;

import com.railflow.dto.StationResponse;
import com.railflow.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller providing station directory, search, and details.
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
    public List<StationResponse> getAllStations(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size) {
        List<StationResponse> all = stationService.getAllStations();
        int start = Math.min(page * size, all.size());
        int end = Math.min(start + size, all.size());
        return all.subList(start, end);
    }

    @GetMapping("/{id}")
    public StationResponse getStationById(@PathVariable("id") String id) {
        return stationService.getStationById(id);
    }

    @GetMapping("/search")
    public List<StationResponse> searchStations(@RequestParam("query") String query) {
        return stationService.searchStations(query);
    }
}
