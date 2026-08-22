package com.railflow.exception;

/**
 * Thrown when a station code or name cannot be resolved.
 */
public class StationNotFoundException extends RuntimeException {
    public StationNotFoundException(String stationCode) {
        super("Station with code or name '" + stationCode + "' was not found.");
    }
}
