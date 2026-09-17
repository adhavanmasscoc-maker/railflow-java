package com.railflow.service;

import com.railflow.model.AIQueryResult;

/**
 * Enterprise AI Operations Assistant service interface.
 * Abstracts local database-grounded reasoning from future cloud LLM providers (Google Gemini API).
 */
public interface AIService {
    AIQueryResult processQuery(String userQuery);
    String getProviderName();
    boolean isLiveCloudConnected();
}
