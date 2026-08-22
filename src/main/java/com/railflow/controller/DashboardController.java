package com.railflow.controller;

import com.railflow.dto.DashboardStatsResponse;
import com.railflow.service.CrowdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller serving aggregated station dashboard metrics.
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final CrowdService crowdService;

    @Autowired
    public DashboardController(CrowdService crowdService) {
        this.crowdService = crowdService;
    }

    /**
     * GET /api/dashboard/stats - Comprehensive station dashboard statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(crowdService.getDashboardStatistics());
    }
}
