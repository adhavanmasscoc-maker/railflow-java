package com.railflow.model;

import java.util.List;

/**
 * Model representing a response from the Railway AI Operations Assistant,
 * backed by real SQLite database grounding.
 */
public class AIQueryResult {
    private final String query;
    private final String intent;
    private final String answer;
    private final String databaseContext;
    private final List<String> relatedStations;
    private final List<String> relatedTrains;
    private final String providerMode; // "LOCAL_DATA_MODE" or "GEMINI_API"

    public AIQueryResult(String query, String intent, String answer, String databaseContext,
                         List<String> relatedStations, List<String> relatedTrains, String providerMode) {
        this.query = query;
        this.intent = intent;
        this.answer = answer;
        this.databaseContext = databaseContext;
        this.relatedStations = relatedStations;
        this.relatedTrains = relatedTrains;
        this.providerMode = providerMode;
    }

    public String getQuery() { return query; }
    public String getIntent() { return intent; }
    public String getAnswer() { return answer; }
    public String getDatabaseContext() { return databaseContext; }
    public List<String> getRelatedStations() { return relatedStations; }
    public List<String> getRelatedTrains() { return relatedTrains; }
    public String getProviderMode() { return providerMode; }
}
