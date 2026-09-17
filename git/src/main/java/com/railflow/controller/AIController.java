package com.railflow.controller;

import com.railflow.model.AIQueryResult;
import com.railflow.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller providing access to the Railway AI Operations Assistant,
 * backed by SQLite database context extraction.
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(@Qualifier("localRailwayAIService") AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/query")
    public ResponseEntity<AIQueryResult> queryAssistantPost(@RequestBody Map<String, String> payload) {
        String query = payload.getOrDefault("query", "");
        return ResponseEntity.ok(aiService.processQuery(query));
    }

    @GetMapping("/query")
    public ResponseEntity<AIQueryResult> queryAssistantGet(@RequestParam("q") String query) {
        return ResponseEntity.ok(aiService.processQuery(query));
    }
}
