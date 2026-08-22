package com.railflow.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Domain model representing a Railway Station.
 */
public class Station {

    private final String code; // e.g. "NDLS", "CSMT", "MAS"
    private final String name;
    private String city;
    private String zone; // NR, CR, SR, WR, etc.
    private final List<Platform> platforms = new ArrayList<>();

    public Station(String code, String name, String city, String zone) {
        this.code = Objects.requireNonNull(code, "Station code cannot be null").toUpperCase().trim();
        this.name = Objects.requireNonNull(name, "Station name cannot be null").trim();
        this.city = city != null ? city : "Unknown";
        this.zone = zone != null ? zone : "IR";
    }

    public void addPlatform(Platform platform) {
        if (platform != null && !platforms.contains(platform)) {
            platforms.add(platform);
        }
    }

    public int getTotalCapacity() {
        return platforms.stream().mapToInt(Platform::getCapacity).sum();
    }

    public int getTotalCurrentCrowd() {
        return platforms.stream().mapToInt(Platform::getCurrentCrowd).sum();
    }

    public double getOverallOccupancy() {
        int totalCap = getTotalCapacity();
        return totalCap > 0 ? (double) getTotalCurrentCrowd() / totalCap : 0.0;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }
    public List<Platform> getPlatforms() { return Collections.unmodifiableList(platforms); }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Station station = (Station) o;
        return Objects.equals(code, station.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }

    @Override
    public String toString() {
        return String.format("Station[%s: %s (%s) | Platforms: %d]", code, name, zone, platforms.size());
    }
}
