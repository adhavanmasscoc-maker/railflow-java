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
    private String state;
    private String zone; // NR, CR, SR, WR, etc.
    private String address;
    private double latitude;
    private double longitude;
    private final List<Platform> platforms = new ArrayList<>();

    public Station(String code, String name, String city, String zone) {
        this.code = Objects.requireNonNull(code, "Station code cannot be null").toUpperCase().trim();
        this.name = Objects.requireNonNull(name, "Station name cannot be null").trim();
        this.city = city != null ? city : "Unknown";
        this.zone = zone != null ? zone : "IR";
    }

    public Station(String code, String name, String city, String zone, int platformCount) {
        this(code, name, city, zone);
        for (int i = 1; i <= platformCount; i++) {
            this.platforms.add(new Platform("PLT-" + code + "-" + i, i, code, 500, 4));
        }
    }

    public Station(String code, String name, String state, String zone, String address, double latitude, double longitude) {
        this(code, name, address, zone);
        this.state = state != null ? state : "";
        this.address = address != null ? address : "";
        this.latitude = latitude;
        this.longitude = longitude;
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

    public String getId() { return "STN-" + code; }
    public String getCode() { return code; }
    public String getStationCode() { return code; }
    public String getName() { return name; }
    public String getStationName() { return name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state != null ? state : ""; }
    public void setState(String state) { this.state = state; }
    public String getAddress() { return address != null ? address : ""; }
    public void setAddress(String address) { this.address = address; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public String getZone() { return zone; }
    public String getDivision() { return zone; }
    public void setZone(String zone) { this.zone = zone; }
    public int getPlatformCount() { return platforms.isEmpty() ? 4 : platforms.size(); }
    public int getTotalPlatforms() { return getPlatformCount(); }
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
