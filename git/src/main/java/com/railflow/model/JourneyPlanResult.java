package com.railflow.model;

import java.util.List;

/**
 * Model representing the computed result of an inter-station journey route query.
 */
public class JourneyPlanResult {
    private final Station fromStation;
    private final Station toStation;
    private final double distanceKm;
    private final int estimatedMinutes;
    private final String corridorName;
    private final List<Train> directTrains;
    private final List<Station> routeSequence;
    private final int segmentCount;
    private final String travelSummary;

    public JourneyPlanResult(Station fromStation, Station toStation, double distanceKm,
                             int estimatedMinutes, String corridorName, List<Train> directTrains,
                             List<Station> routeSequence, int segmentCount, String travelSummary) {
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.distanceKm = distanceKm;
        this.estimatedMinutes = estimatedMinutes;
        this.corridorName = corridorName;
        this.directTrains = directTrains;
        this.routeSequence = routeSequence;
        this.segmentCount = segmentCount;
        this.travelSummary = travelSummary;
    }

    public Station getFromStation() { return fromStation; }
    public Station getToStation() { return toStation; }
    public double getDistanceKm() { return distanceKm; }
    public int getEstimatedMinutes() { return estimatedMinutes; }
    public String getCorridorName() { return corridorName; }
    public List<Train> getDirectTrains() { return directTrains; }
    public List<Station> getRouteSequence() { return routeSequence; }
    public int getSegmentCount() { return segmentCount; }
    public String getTravelSummary() { return travelSummary; }
}
