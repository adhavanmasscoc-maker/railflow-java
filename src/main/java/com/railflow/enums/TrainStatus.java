package com.railflow.enums;

/**
 * Enumerates the operational status of trains.
 */
public enum TrainStatus {
    ON_TIME("Train operating on scheduled timetable"),
    DELAYED("Train is running behind schedule"),
    ARRIVING("Train is approaching platform (< 5 mins)"),
    ON_PLATFORM("Train is currently berthed at platform"),
    DEPARTED("Train has departed from the station"),
    CANCELLED("Train service is cancelled");

    private final String description;

    TrainStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
