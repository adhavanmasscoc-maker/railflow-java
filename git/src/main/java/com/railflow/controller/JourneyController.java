package com.railflow.controller;

import com.railflow.model.JourneyPlanResult;
import com.railflow.service.JourneyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller providing inter-station journey planning, corridor graphs,
 * and shortest-path route computation.
 */
@RestController
@RequestMapping("/api/journey")
@CrossOrigin(origins = "*")
public class JourneyController {

    private final JourneyService journeyService;

    @Autowired
    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }

    @GetMapping("/plan")
    public ResponseEntity<JourneyPlanResult> planJourney(@RequestParam("from") String from,
                                                         @RequestParam("to") String to) {
        return ResponseEntity.ok(journeyService.planJourney(from, to));
    }

    @GetMapping("/corridors")
    public ResponseEntity<List<Map<String, Object>>> getCorridors() {
        return ResponseEntity.ok(journeyService.getCorridors());
    }
}
