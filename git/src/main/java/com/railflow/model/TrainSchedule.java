package com.railflow.model;

import java.time.LocalTime;
import java.util.Objects;

/**
 * Domain model representing a scheduled train stop at a station.
 */
public class TrainSchedule {

    private final String trainNumber;
    private final String stationCode;
    private final LocalTime scheduledArrival;
    private final LocalTime scheduledDeparture;
    private final int stopSequence;
    private final int haltMinutes;

    public TrainSchedule(String trainNumber, String stationCode, LocalTime scheduledArrival, 
                         LocalTime scheduledDeparture, int stopSequence, int haltMinutes) {
        this.trainNumber = Objects.requireNonNull(trainNumber, "trainNumber cannot be null");
        this.stationCode = Objects.requireNonNull(stationCode, "stationCode cannot be null");
        this.scheduledArrival = scheduledArrival;
        this.scheduledDeparture = scheduledDeparture;
        this.stopSequence = stopSequence;
        this.haltMinutes = Math.max(0, haltMinutes);
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public String getStationCode() {
        return stationCode;
    }

    public LocalTime getScheduledArrival() {
        return scheduledArrival;
    }

    public LocalTime getScheduledDeparture() {
        return scheduledDeparture;
    }

    public int getStopSequence() {
        return stopSequence;
    }

    public int getHaltMinutes() {
        return haltMinutes;
    }

    @Override
    public String toString() {
        return "TrainSchedule{" +
                "trainNumber='" + trainNumber + '\'' +
                ", stationCode='" + stationCode + '\'' +
                ", arrival=" + scheduledArrival +
                ", departure=" + scheduledDeparture +
                ", halt=" + haltMinutes + "m" +
                '}';
    }
}
