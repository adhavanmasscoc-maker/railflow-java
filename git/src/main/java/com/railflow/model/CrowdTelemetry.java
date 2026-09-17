package com.railflow.model;

/**
 * Model representing live multi-platform crowd density telemetry generated
 * by the background simulation scheduler.
 */
public class CrowdTelemetry {
    private final String platformId;
    private final String stationCode;
    private final int platformNumber;
    private final int passengerCount;
    private final int capacity;
    private final double densityPercentage;
    private final String status; // "NORMAL", "WARNING", "CRITICAL"
    private final String timestamp;

    public CrowdTelemetry(String platformId, String stationCode, int platformNumber,
                          int passengerCount, int capacity, double densityPercentage,
                          String status, String timestamp) {
        this.platformId = platformId;
        this.stationCode = stationCode;
        this.platformNumber = platformNumber;
        this.passengerCount = passengerCount;
        this.capacity = capacity;
        this.densityPercentage = densityPercentage;
        this.status = status;
        this.timestamp = timestamp;
    }

    public String getPlatformId() { return platformId; }
    public String getStationCode() { return stationCode; }
    public int getPlatformNumber() { return platformNumber; }
    public int getPassengerCount() { return passengerCount; }
    public int getCapacity() { return capacity; }
    public double getDensityPercentage() { return densityPercentage; }
    public String getStatus() { return status; }
    public String getTimestamp() { return timestamp; }
}
