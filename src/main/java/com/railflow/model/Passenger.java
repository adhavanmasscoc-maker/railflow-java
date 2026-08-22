package com.railflow.model;

import java.time.LocalDateTime;

/**
 * Model representing a passenger / commuter flow unit in simulation.
 */
public class Passenger {

    private final String pnr;
    private final String trainNumber;
    private final String destination;
    private String targetPlatformId;
    private LocalDateTime entryTime;

    public Passenger(String pnr, String trainNumber, String destination, String targetPlatformId) {
        this.pnr = pnr;
        this.trainNumber = trainNumber;
        this.destination = destination;
        this.targetPlatformId = targetPlatformId;
        this.entryTime = LocalDateTime.now();
    }

    public String getPnr() { return pnr; }
    public String getTrainNumber() { return trainNumber; }
    public String getDestination() { return destination; }
    public String getTargetPlatformId() { return targetPlatformId; }
    public void setTargetPlatformId(String targetPlatformId) { this.targetPlatformId = targetPlatformId; }
    public LocalDateTime getEntryTime() { return entryTime; }
}
