package com.railflow.controller;

import com.railflow.dto.DelayUpdateRequest;
import com.railflow.dto.TrainResponse;
import com.railflow.service.TrainService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Train schedule queries, arrival tracking, and delays.
 */
@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "*")
public class TrainController {

    private final TrainService trainService;

    @Autowired
    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    /** GET /api/trains - Retrieve all scheduled trains */
    @GetMapping
    public ResponseEntity<List<TrainResponse>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    /** GET /api/trains/{id} - Retrieve single train by ID or 5-digit train number */
    @GetMapping("/{id}")
    public ResponseEntity<TrainResponse> getTrainById(@PathVariable String id) {
        return ResponseEntity.ok(trainService.getTrainById(id));
    }

    /** GET /api/trains/arriving - Retrieve trains arriving within 15 minutes */
    @GetMapping("/arriving")
    public ResponseEntity<List<TrainResponse>> getArrivingTrains(@RequestParam(defaultValue = "15") int minutes) {
        return ResponseEntity.ok(trainService.getArrivingTrains(minutes));
    }

    /** GET /api/trains/delayed - Retrieve all delayed trains */
    @GetMapping("/delayed")
    public ResponseEntity<List<TrainResponse>> getDelayedTrains() {
        return ResponseEntity.ok(trainService.getDelayedTrains());
    }

    /** GET /api/trains/search - Search trains by route/keyword using DSA Search */
    @GetMapping("/search")
    public ResponseEntity<List<TrainResponse>> searchTrains(@RequestParam String query) {
        return ResponseEntity.ok(trainService.searchTrains(query));
    }

    /** PUT /api/trains/{id}/delay - Update train delay minutes */
    @PutMapping("/{id}/delay")
    public ResponseEntity<TrainResponse> updateDelay(@PathVariable String id,
                                                    @Valid @RequestBody DelayUpdateRequest request) {
        return ResponseEntity.ok(trainService.updateTrainDelay(id, request.getDelayMinutes()));
    }
}
