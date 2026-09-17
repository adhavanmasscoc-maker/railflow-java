package com.railflow.controller;

import com.railflow.service.ConsoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for executing interactive terminal commands and simulation operations
 * from the in-browser Web Terminal / CLI Simulator (RailFlowSystem interface).
 */
@RestController
@RequestMapping("/api/console")
@CrossOrigin(origins = "*")
public class ConsoleController {

    private final ConsoleService consoleService;

    @Autowired
    public ConsoleController(ConsoleService consoleService) {
        this.consoleService = consoleService;
    }

    /** GET /api/console/menu - Retrieve standard 10-option help menu */
    @GetMapping("/menu")
    public ResponseEntity<Map<String, String>> getMenu() {
        return ResponseEntity.ok(Map.of(
                "banner", consoleService.renderWelcomeScreen(),
                "menu", consoleService.getHelpMenu()
        ));
    }

    /** POST /api/console/execute - Execute terminal command */
    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeCommand(@RequestBody Map<String, String> payload) {
        String command = payload != null ? payload.getOrDefault("command", "") : "";
        return ResponseEntity.ok(consoleService.execute(command));
    }
}
