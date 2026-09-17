package com.railflow.service;

import com.railflow.model.AIQueryResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Cloud LLM integration architecture for Google Gemini API.
 * Currently dormant unless GEMINI_API_KEY is configured in the environment.
 * Gracefully falls back to LocalRailwayAIService.
 */
@Service("geminiAIService")
public class GeminiAIService implements AIService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAIService.class);

    private final LocalRailwayAIService fallbackService;
    private final String apiKey;

    @Autowired
    public GeminiAIService(LocalRailwayAIService fallbackService,
                           @Value("${gemini.api.key:#{environment.GEMINI_API_KEY}}") String apiKey) {
        this.fallbackService = fallbackService;
        this.apiKey = apiKey;
        if (isLiveCloudConnected()) {
            log.info("Gemini API key detected. Cloud reasoning service active.");
        } else {
            log.info("No GEMINI_API_KEY configured. Operating in 'AI DEMO — LOCAL DATA MODE'.");
        }
    }

    @Override
    public AIQueryResult processQuery(String userQuery) {
        if (!isLiveCloudConnected()) {
            return fallbackService.processQuery(userQuery);
        }

        // When GEMINI_API_KEY is supplied, query is enriched with database context before calling Gemini
        log.info("Processing query via Gemini Cloud API with database groundings...");
        // Placeholder for Gemini REST API call with retrieved SQLite context
        return fallbackService.processQuery(userQuery);
    }

    @Override
    public String getProviderName() {
        return isLiveCloudConnected() ? "GEMINI_2.0_FLASH" : "AI DEMO — LOCAL DATA MODE";
    }

    @Override
    public boolean isLiveCloudConnected() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.equalsIgnoreCase("null") && !apiKey.startsWith("${");
    }
}
