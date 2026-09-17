package com.railflow.enums;

/**
 * Explicitly identifies the source of truth for every metric and record.
 * Ensures transparency between real empirical datasets, derived heuristics,
 * simulated live counters, and external API gateways.
 */
public enum DataSourceType {
    REAL("Official Indian Railways Dataset (CSV / PDF)"),
    DERIVED("Algorithmic / Statistical Calculation"),
    SIMULATED("Real-time Inflow/Outflow Simulation Engine"),
    LIVE_API("RapidAPI IRCTC Gateway Live Feed");

    private final String description;

    DataSourceType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
