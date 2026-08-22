package com.railflow.service;

import com.railflow.dto.RecommendationResponse;
import com.railflow.model.PlatformRecommendation;

import java.util.List;

/**
 * Service interface for algorithmic platform recommendations.
 */
public interface RecommendationService {
    List<RecommendationResponse> getAllRecommendations();
    boolean applyRecommendation(String recommendationId);
    boolean dismissRecommendation(String recommendationId);
}
