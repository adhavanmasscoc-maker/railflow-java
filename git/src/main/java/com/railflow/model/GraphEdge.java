package com.railflow.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Directed railway edge between consecutive stations A -> B in the national graph.
 * Supports multiple trains running across the same corridor segment.
 */
public class GraphEdge {
    private final String fromStationCode;
    private final String toStationCode;
    private double distanceKm;
    private final List<TrainServiceInfo> trains = new ArrayList<>();

    public GraphEdge(String fromStationCode, String toStationCode, double distanceKm) {
        this.fromStationCode = fromStationCode != null ? fromStationCode.trim().toUpperCase() : "UNKNOWN";
        this.toStationCode = toStationCode != null ? toStationCode.trim().toUpperCase() : "UNKNOWN";
        this.distanceKm = distanceKm;
    }

    public String getFromStationCode() { return fromStationCode; }
    public String getToStationCode() { return toStationCode; }
    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public List<TrainServiceInfo> getTrains() { return trains; }

    public synchronized void addTrain(String trainNumber, String trainName, String departureTime, String arrivalTime, int sequence) {
        boolean exists = trains.stream().anyMatch(t -> t.getTrainNumber().equals(trainNumber));
        if (!exists) {
            trains.add(new TrainServiceInfo(trainNumber, trainName, departureTime, arrivalTime, sequence));
        }
    }

    public static class TrainServiceInfo {
        private final String trainNumber;
        private final String trainName;
        private final String departureTime;
        private final String arrivalTime;
        private final int sequence;

        public TrainServiceInfo(String trainNumber, String trainName, String departureTime, String arrivalTime, int sequence) {
            this.trainNumber = trainNumber;
            this.trainName = trainName != null ? trainName : "Express";
            this.departureTime = departureTime != null ? departureTime : "-";
            this.arrivalTime = arrivalTime != null ? arrivalTime : "-";
            this.sequence = sequence;
        }

        public String getTrainNumber() { return trainNumber; }
        public String getTrainName() { return trainName; }
        public String getDepartureTime() { return departureTime; }
        public String getArrivalTime() { return arrivalTime; }
        public int getSequence() { return sequence; }
    }
}
