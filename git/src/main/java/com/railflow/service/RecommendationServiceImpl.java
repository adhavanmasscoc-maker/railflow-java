package com.railflow.service;

import com.railflow.algorithm.PlatformOptimizer;
import com.railflow.dto.RecommendationResponse;
import com.railflow.model.Platform;
import com.railflow.model.PlatformRecommendation;
import com.railflow.repository.PlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Service implementation for algorithmic recommendation generation and execution.
 */
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final PlatformOptimizer platformOptimizer;
    private final PlatformRepository platformRepository;
    private final Map<String, PlatformRecommendation> activeRecommendations = new ConcurrentHashMap<>();

    @Autowired
    public RecommendationServiceImpl(PlatformOptimizer platformOptimizer, PlatformRepository platformRepository) {
        this.platformOptimizer = platformOptimizer;
        this.platformRepository = platformRepository;
    }

    @Override
    public List<RecommendationResponse> getAllRecommendations() {
        List<PlatformRecommendation> fresh = platformOptimizer.generateRecommendations();
        activeRecommendations.clear();
        for (PlatformRecommendation r : fresh) {
            activeRecommendations.put(r.getId(), r);
        }

        return activeRecommendations.values().stream()
                .filter(r -> !r.isDismissed())
                .sorted()
                .map(RecommendationResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public boolean applyRecommendation(String recommendationId) {
        PlatformRecommendation rec = activeRecommendations.get(recommendationId);
        if (rec == null || rec.isApplied()) return false;

        Optional<Platform> targetPlatformOpt = platformRepository.findById(rec.getTargetPlatformId());
        if (targetPlatformOpt.isEmpty()) return false;

        Platform target = targetPlatformOpt.get();
        boolean success = rec.apply(target);
        if (success) {
            platformRepository.save(target);
        }
        return success;
    }

    @Override
    public boolean dismissRecommendation(String recommendationId) {
        PlatformRecommendation rec = activeRecommendations.get(recommendationId);
        if (rec != null) {
            rec.dismiss();
            return true;
        }
        return false;
    }
}
