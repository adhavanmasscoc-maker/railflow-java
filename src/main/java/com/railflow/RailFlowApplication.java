package com.railflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * RailFlow — Smart Railway Crowd Monitoring & Platform Optimization System.
 * Main Spring Boot Application Entry Point.
 */
@SpringBootApplication
@EnableScheduling
public class RailFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(RailFlowApplication.class, args);
    }
}
