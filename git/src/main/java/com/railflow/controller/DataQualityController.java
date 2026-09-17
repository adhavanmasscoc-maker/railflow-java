package com.railflow.controller;

import com.railflow.model.DataQualityMetrics;
import com.railflow.service.DataQualityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller exposing live dynamically calculated database health and data quality metrics.
 */
@RestController
@RequestMapping("/api/quality")
@CrossOrigin(origins = "*")
public class DataQualityController {

    private final DataQualityService dataQualityService;

    @Autowired
    public DataQualityController(DataQualityService dataQualityService) {
        this.dataQualityService = dataQualityService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<DataQualityMetrics> getMetrics() {
        return ResponseEntity.ok(dataQualityService.getLiveMetrics());
    }
}
