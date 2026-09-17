package com.railflow.controller;

import com.railflow.model.ValidationReport;
import com.railflow.service.RailwayDataLoader;
import com.railflow.service.RouteSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Route Controller:
 * Handles dynamic route searching between real stations,
 * direct train finding, and validation reporting.
 */
@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    private final RouteSearchService routeSearchService;
    private final RailwayDataLoader dataLoader;

    @Autowired
    public RouteController(RouteSearchService routeSearchService, RailwayDataLoader dataLoader) {
        this.routeSearchService = routeSearchService;
        this.dataLoader = dataLoader;
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchRoutes(
            @RequestParam("from") String from,
            @RequestParam("to") String to,
            @RequestParam(value = "maxTransfers", defaultValue = "1") int maxTransfers) {
        Map<String, Object> result = routeSearchService.searchRoutes(from, to, maxTransfers);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/validation")
    public ResponseEntity<ValidationReport> getValidationReport() {
        return ResponseEntity.ok(dataLoader.getValidationReport());
    }
}
