package com.railflow.model;

/**
 * Normalized model for a single station stop on an Indian Railways train route.
 * Matches completeOrderedRoute in trainroutes.json / trains.json.
 */
public class TrainStop {
    private String trainNumber;
    private int sequence;
    private String stationCode;
    private String stationName;
    private String arrivalTime;
    private String departureTime;
    private int journeyDay;
    private double distanceKm;

    public TrainStop() {}

    public TrainStop(String trainNumber, int sequence, String stationCode, String stationName,
                     String arrivalTime, String departureTime, int journeyDay, double distanceKm) {
        this.trainNumber = trainNumber;
        this.sequence = sequence;
        this.stationCode = stationCode != null ? stationCode.trim().toUpperCase() : "UNKNOWN_STATION";
        this.stationName = stationName != null ? stationName.trim() : "Unknown Station";
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.journeyDay = journeyDay > 0 ? journeyDay : 1;
        this.distanceKm = distanceKm;
    }

    public String getTrainNumber() { return trainNumber; }
    public void setTrainNumber(String trainNumber) { this.trainNumber = trainNumber; }

    public int getSequence() { return sequence; }
    public void setSequence(int sequence) { this.sequence = sequence; }

    public String getStationCode() { return stationCode; }
    public void setStationCode(String stationCode) { this.stationCode = stationCode; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public String getArrivalTime() { return arrivalTime != null ? arrivalTime : "START"; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDepartureTime() { return departureTime != null ? departureTime : "ENDS"; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public int getJourneyDay() { return journeyDay; }
    public void setJourneyDay(int journeyDay) { this.journeyDay = journeyDay; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public String getHalt() {
        if (arrivalTime == null || departureTime == null) return "-";
        if (arrivalTime.equals(departureTime)) return "1 min";
        try {
            String[] arr = arrivalTime.split(":");
            String[] dep = departureTime.split(":");
            int arrMin = Integer.parseInt(arr[0]) * 60 + Integer.parseInt(arr[1]);
            int depMin = Integer.parseInt(dep[0]) * 60 + Integer.parseInt(dep[1]);
            int diff = depMin - arrMin;
            if (diff < 0) diff += 1440;
            return diff > 0 ? diff + " min" : "1 min";
        } catch (Exception e) {
            return "-";
        }
    }
}
