package com.railflow.model;

import com.railflow.enums.PlatformStatus;
import com.railflow.exception.InvalidCrowdCountException;
import com.railflow.exception.InvalidPlatformCapacityException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Domain model representing a railway station platform.
 * Encapsulates crowd calculations, gate management, and train docking state.
 */
public class Platform {

    private final String id;
    private final String name;
    private String stationId;
    private String stationName;
    private int capacity;
    private int currentCrowd;
    private double occupancyRate;
    private PlatformStatus status;
    private String platformType; // EXPRESS, SUBURBAN, FREIGHT, PASSENGER

    // Active Train on platform (if any)
    private String currentTrainId;
    private String currentTrainName;
    private String trainStatus;
    private int trainDelayMinutes;

    // Physical gates associated with platform
    private final List<Gate> gates = new ArrayList<>();

    // Flow metrics
    private int inflowRate;  // passengers entering per min
    private int outflowRate; // passengers exiting per min
    private double avgWaitTimeMinutes;
    private LocalDateTime lastUpdated;

    public Platform(String id, String name, String stationId, String stationName, int capacity, String platformType) {
        if (capacity <= 0) {
            throw new InvalidPlatformCapacityException(capacity);
        }
        this.id = Objects.requireNonNull(id, "Platform ID cannot be null");
        this.name = Objects.requireNonNull(name, "Platform Name cannot be null");
        this.stationId = stationId != null ? stationId : "STN-001";
        this.stationName = stationName != null ? stationName : "Central Station";
        this.capacity = capacity;
        this.platformType = platformType != null ? platformType : "EXPRESS";
        this.currentCrowd = 0;
        this.occupancyRate = 0.0;
        this.status = PlatformStatus.EMPTY;
        this.lastUpdated = LocalDateTime.now();

        // Initialize 4 standard gates
        for (int i = 1; i <= 4; i++) {
            gates.add(new Gate("GATE-" + id + "-" + i, "Gate " + i));
        }
    }

    /**
     * Updates platform crowd count with validation and automatic occupancy recalculation.
     */
    public synchronized void updateCrowd(int crowd) {
        if (crowd < 0) {
            throw new InvalidCrowdCountException(crowd);
        }
        this.currentCrowd = crowd;
        this.occupancyRate = (double) this.currentCrowd / this.capacity;
        this.status = PlatformStatus.fromOccupancy(this.occupancyRate);
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Increment or decrement crowd safely by delta.
     */
    public synchronized void adjustCrowd(int delta) {
        int target = Math.max(0, this.currentCrowd + delta);
        updateCrowd(target);
    }

    public boolean isCritical() {
        return this.occupancyRate >= 0.90;
    }

    public boolean isOvercrowded() {
        return this.occupancyRate >= 0.80;
    }

    public boolean isUnderutilized() {
        return this.occupancyRate < 0.50;
    }

    public int getAvailableCapacity() {
        return Math.max(0, this.capacity - this.currentCrowd);
    }

    public int getActiveGateCount() {
        return (int) gates.stream().filter(Gate::isOpen).count();
    }

    public int getTotalGateCount() {
        return gates.size();
    }

    public List<Gate> getGates() {
        return Collections.unmodifiableList(gates);
    }

    public void addGate(Gate gate) {
        if (gate != null) {
            this.gates.add(gate);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getStationId() { return stationId; }
    public void setStationId(String stationId) { this.stationId = stationId; }
    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) {
        if (capacity <= 0) throw new InvalidPlatformCapacityException(capacity);
        this.capacity = capacity;
        this.occupancyRate = (double) this.currentCrowd / this.capacity;
        this.status = PlatformStatus.fromOccupancy(this.occupancyRate);
    }
    public int getCurrentCrowd() { return currentCrowd; }
    public double getOccupancyRate() { return occupancyRate; }
    public PlatformStatus getStatus() { return status; }
    public void setStatus(PlatformStatus status) { this.status = status; }
    public String getPlatformType() { return platformType; }
    public void setPlatformType(String platformType) { this.platformType = platformType; }

    public String getCurrentTrainId() { return currentTrainId; }
    public void setCurrentTrainId(String currentTrainId) { this.currentTrainId = currentTrainId; }
    public String getCurrentTrainName() { return currentTrainName; }
    public void setCurrentTrainName(String currentTrainName) { this.currentTrainName = currentTrainName; }
    public String getTrainStatus() { return trainStatus; }
    public void setTrainStatus(String trainStatus) { this.trainStatus = trainStatus; }
    public int getTrainDelayMinutes() { return trainDelayMinutes; }
    public void setTrainDelayMinutes(int trainDelayMinutes) { this.trainDelayMinutes = trainDelayMinutes; }

    public int getInflowRate() { return inflowRate; }
    public void setInflowRate(int inflowRate) { this.inflowRate = inflowRate; }
    public int getOutflowRate() { return outflowRate; }
    public void setOutflowRate(int outflowRate) { this.outflowRate = outflowRate; }
    public double getAvgWaitTimeMinutes() { return avgWaitTimeMinutes; }
    public void setAvgWaitTimeMinutes(double avgWaitTimeMinutes) { this.avgWaitTimeMinutes = avgWaitTimeMinutes; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Platform platform = (Platform) o;
        return Objects.equals(id, platform.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return String.format("Platform[%s: %s | Crowd: %d/%d (%.1f%%) | Status: %s]",
                id, name, currentCrowd, capacity, occupancyRate * 100, status);
    }
}
