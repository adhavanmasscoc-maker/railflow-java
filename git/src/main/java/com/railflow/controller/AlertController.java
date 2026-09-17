package com.railflow.controller;

import com.railflow.dto.AlertResponse;
import com.railflow.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for active congestion alerts and operator acknowledgments.
 */
@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    @Autowired
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    /** GET /api/alerts - Retrieve all active prioritized alerts */
    @GetMapping
    public ResponseEntity<List<AlertResponse>> getActiveAlerts() {
        return ResponseEntity.ok(alertService.getActiveAlerts());
    }

    /** GET /api/alerts/all - Retrieve all historical alerts */
    @GetMapping("/all")
    public ResponseEntity<List<AlertResponse>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    /** GET /api/alerts/{id} - Retrieve single alert */
    @GetMapping("/{id}")
    public ResponseEntity<AlertResponse> getAlertById(@PathVariable String id) {
        return ResponseEntity.ok(alertService.getAlertById(id));
    }

    /** POST /api/alerts/{id}/acknowledge - Acknowledge alert */
    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<AlertResponse> acknowledgeAlert(@PathVariable String id) {
        return ResponseEntity.ok(alertService.acknowledgeAlert(id));
    }

    /** POST /api/alerts/{id}/dismiss - Resolve and dismiss alert */
    @PostMapping("/{id}/dismiss")
    public ResponseEntity<AlertResponse> dismissAlert(@PathVariable String id) {
        return ResponseEntity.ok(alertService.dismissAlert(id));
    }
}
