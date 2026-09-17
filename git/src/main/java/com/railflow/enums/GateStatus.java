package com.railflow.enums;

/**
 * Enumerates the operational status of physical station access gates.
 */
public enum GateStatus {
    OPEN("Gate is active for bidirectional passage"),
    CLOSED("Gate is currently shut"),
    INFLOW_ONLY("Gate restricted to passenger entry"),
    OUTFLOW_ONLY("Gate restricted to passenger exit");

    private final String description;

    GateStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
