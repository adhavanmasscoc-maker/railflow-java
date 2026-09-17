package com.railflow.service;

import com.railflow.model.JourneyPlanResult;
import java.util.List;
import java.util.Map;

/**
 * Service interface for Indian Railways Journey Planning & Corridor Graph algorithms.
 */
public interface JourneyService {
    JourneyPlanResult planJourney(String fromInput, String toInput);
    List<Map<String, Object>> getCorridors();
}
