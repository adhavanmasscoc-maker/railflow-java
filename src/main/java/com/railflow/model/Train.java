package com.railflow.model;

import com.railflow.enums.TrainStatus;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Domain model representing a Train service.
 */
public class Train implements Comparable<Train> {

    private final String id;
    private final String trainNumber; // 5-digit Indian Railway code e.g. "12301"
    private String name;
    private String route;
    private String sourceStation;
    private String destinationStation;
    private String type; // EXPRESS, SUPERFAST, RAJDHANI, LOCAL, SPECIAL
    private int totalCapacity;
    private int coachCount;
    private int currentPassengers;
    private String assignedPlatformId;
    private TrainStatus status;
    private int delayMinutes;
    private int minutesToArrival;
    private LocalDateTime scheduledArrival;
    private LocalDateTime scheduledDeparture;
    private LocalDateTime lastUpdated;

    public Train(String id, String trainNumber, String name, String route,
                 String sourceStation, String destinationStation,
                 String type, int totalCapacity, int coachCount) {
        this.id = Objects.requireNonNull(id, "Train id must not be null");
        this.trainNumber = Objects.requireNonNull(trainNumber, "Train number must not be null");
        this.name = name != null ? name : "Express Train";
        this.route = route != null ? route : "Route";
        this.sourceStation = sourceStation != null ? sourceStation : "Origin";
        this.destinationStation = destinationStation != null ? destinationStation : "Destination";
        this.type = type != null ? type : "EXPRESS";
        this.totalCapacity = Math.max(100, totalCapacity);
        this.coachCount = Math.max(1, coachCount);
        this.currentPassengers = 0;
        this.status = TrainStatus.ON_TIME;
        this.delayMinutes = 0;
        this.minutesToArrival = 15;
        this.lastUpdated = LocalDateTime.now();
    }

    public boolean isDelayed() {
        return delayMinutes > 0 || status == TrainStatus.DELAYED;
    }

    public boolean isArrivingSoon(int thresholdMinutes) {
        return minutesToArrival <= thresholdMinutes && status != TrainStatus.DEPARTED && status != TrainStatus.CANCELLED;
    }

    public double getOccupancyRate() {
        return totalCapacity > 0 ? (double) currentPassengers / totalCapacity : 0.0;
    }

    @Override
    public int compareTo(Train other) {
        if (other == null) return 1;
        // Primary sort: arrival time, Secondary sort: delay (descending)
        int arrivalComp = Integer.compare(this.minutesToArrival, other.minutesToArrival);
        if (arrivalComp != 0) return arrivalComp;
        return Integer.compare(other.delayMinutes, this.delayMinutes);
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getTrainNumber() { return trainNumber; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }
    public String getSourceStation() { return sourceStation; }
    public void setSourceStation(String sourceStation) { this.sourceStation = sourceStation; }
    public String getDestinationStation() { return destinationStation; }
    public void setDestinationStation(String destinationStation) { this.destinationStation = destinationStation; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }
    public int getCoachCount() { return coachCount; }
    public void setCoachCount(int coachCount) { this.coachCount = coachCount; }
    public int getCurrentPassengers() { return currentPassengers; }
    public void setCurrentPassengers(int currentPassengers) { this.currentPassengers = Math.max(0, currentPassengers); }
    public String getAssignedPlatformId() { return assignedPlatformId; }
    public void setAssignedPlatformId(String assignedPlatformId) { this.assignedPlatformId = assignedPlatformId; }
    public TrainStatus getStatus() { return status; }
    public void setStatus(TrainStatus status) { this.status = status; }
    public int getDelayMinutes() { return delayMinutes; }
    public void setDelayMinutes(int delayMinutes) {
        this.delayMinutes = Math.max(0, delayMinutes);
        if (this.delayMinutes > 0 && this.status != TrainStatus.CANCELLED) {
            this.status = TrainStatus.DELAYED;
        }
    }
    public int getMinutesToArrival() { return minutesToArrival; }
    public void setMinutesToArrival(int minutesToArrival) { this.minutesToArrival = minutesToArrival; }
    public LocalDateTime getScheduledArrival() { return scheduledArrival; }
    public void setScheduledArrival(LocalDateTime scheduledArrival) { this.scheduledArrival = scheduledArrival; }
    public LocalDateTime getScheduledDeparture() { return scheduledDeparture; }
    public void setScheduledDeparture(LocalDateTime scheduledDeparture) { this.scheduledDeparture = scheduledDeparture; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Train train = (Train) o;
        return Objects.equals(trainNumber, train.trainNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(trainNumber);
    }

    @Override
    public String toString() {
        return String.format("Train[%s: %s | ETA: %d min | Delay: %d min | Status: %s]",
                trainNumber, name, minutesToArrival, delayMinutes, status);
    }
}
