package com.railflow.model;

/**
 * Model representing an intermediate stop in a train's journey sequence.
 */
public class TrainRoute {
    private final String id;
    private final String trainNumber;
    private final String stationCode;
    private final String stationName;
    private final int sequenceNumber;
    private final String arrivalTime;
    private final String departureTime;
    private final double distanceKm;
    private final int platform;

    public TrainRoute(String id, String trainNumber, String stationCode, String stationName,
                      int sequenceNumber, String arrivalTime, String departureTime,
                      double distanceKm, int platform) {
        this.id = id;
        this.trainNumber = trainNumber;
        this.stationCode = stationCode;
        this.stationName = stationName;
        this.sequenceNumber = sequenceNumber;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.distanceKm = distanceKm;
        this.platform = platform;
    }

    public String getId() { return id; }
    public String getTrainNumber() { return trainNumber; }
    public String getStationCode() { return stationCode; }
    public String getStationName() { return stationName; }
    public int getSequenceNumber() { return sequenceNumber; }
    public String getArrivalTime() { return arrivalTime; }
    public String getDepartureTime() { return departureTime; }
    public double getDistanceKm() { return distanceKm; }
    public int getPlatform() { return platform; }
}
