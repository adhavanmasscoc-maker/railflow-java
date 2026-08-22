package com.railflow.controller;

import com.railflow.dto.CrowdUpdateRequest;
import com.railflow.dto.PlatformResponse;
import com.railflow.dto.RecommendationResponse;
import com.railflow.service.PlatformService;
import com.railflow.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Platform monitoring, crowd updates, and recommendations.
 */
@RestController
@RequestMapping("/api/platforms")
@CrossOrigin(origins = "*")
public class PlatformController {

    private final PlatformService platformService;
    private final RecommendationService recommendationService;

    @Autowired
    public PlatformController(PlatformService platformService, RecommendationService recommendationService) {
        this.platformService = platformService;
        this.recommendationService = recommendationService;
    }

    /** GET /api/platforms - Retrieve all station platforms */
    @GetMapping
    public ResponseEntity<List<PlatformResponse>> getAllPlatforms() {
        return ResponseEntity.ok(platformService.getAllPlatforms());
    }

    /** GET /api/platforms/{id} - Retrieve single platform by ID */
    @GetMapping("/{id}")
    public ResponseEntity<PlatformResponse> getPlatformById(@PathVariable String id) {
        return ResponseEntity.ok(platformService.getPlatformById(id));
    }

    /** GET /api/platforms/status/{status} - Filter platforms by operational status */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PlatformResponse>> getPlatformsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(platformService.getPlatformsByStatus(status));
    }

    /** GET /api/platforms/critical - Retrieve high occupancy / critical platforms */
    @GetMapping("/critical")
    public ResponseEntity<List<PlatformResponse>> getCriticalPlatforms() {
        return ResponseEntity.ok(platformService.getCriticalPlatforms());
    }

    /** GET /api/platforms/recommendations - Get active algorithmic recommendations */
    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations() {
        return ResponseEntity.ok(recommendationService.getAllRecommendations());
    }

    /** POST /api/platforms/recommendations/{id}/apply - Execute recommendation */
    @PostMapping("/recommendations/{id}/apply")
    public ResponseEntity<Map<String, Object>> applyRecommendation(@PathVariable String id) {
        boolean applied = recommendationService.applyRecommendation(id);
        return ResponseEntity.ok(Map.of(
                "success", applied,
                "message", applied ? "Optimization recommendation applied successfully." : "Recommendation not found or already applied."
        ));
    }

    /** POST /api/platforms/recommendations/{id}/dismiss - Dismiss recommendation */
    @PostMapping("/recommendations/{id}/dismiss")
    public ResponseEntity<Map<String, Object>> dismissRecommendation(@PathVariable String id) {
        boolean dismissed = recommendationService.dismissRecommendation(id);
        return ResponseEntity.ok(Map.of(
                "success", dismissed,
                "message", dismissed ? "Recommendation dismissed." : "Recommendation not found."
        ));
    }

    /** PUT /api/platforms/{id}/crowd - Manually update platform crowd */
    @PutMapping("/{id}/crowd")
    public ResponseEntity<PlatformResponse> updatePlatformCrowd(@PathVariable String id,
                                                               @Valid @RequestBody CrowdUpdateRequest request) {
        return ResponseEntity.ok(platformService.updatePlatformCrowd(id, request.getCrowd()));
    }
}
