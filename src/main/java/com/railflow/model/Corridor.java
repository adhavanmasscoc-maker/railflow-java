package com.railflow.model;

import java.util.List;

/**
 * Model representing a high-density inter-hub railway corridor (e.g., Delhi-Kanpur-Howrah).
 */
public class Corridor {
    private final String id;
    private final String name;
    private final String fromStationCode;
    private final String toStationCode;
    private final double distanceKm;
    private final int averageTravelMinutes;
    private final List<String> stationCodes;

    public Corridor(String id, String name, String fromStationCode, String toStationCode,
                    double distanceKm, int averageTravelMinutes, List<String> stationCodes) {
        this.id = id;
        this.name = name;
        this.fromStationCode = fromStationCode;
        this.toStationCode = toStationCode;
        this.distanceKm = distanceKm;
        this.averageTravelMinutes = averageTravelMinutes;
        this.stationCodes = stationCodes;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getFromStationCode() { return fromStationCode; }
    public String getToStationCode() { return toStationCode; }
    public double getDistanceKm() { return distanceKm; }
    public int getAverageTravelMinutes() { return averageTravelMinutes; }
    public List<String> getStationCodes() { return stationCodes; }
}
