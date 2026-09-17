package com.railflow.model;

/**
 * Model representing an Indian Railways Zonal Administrative Division.
 */
public class RailwayZone {
    private final String code; // e.g., "NR", "SR", "CR", "WR", "ER"
    private final String name; // e.g., "Northern Railway", "Southern Railway"
    private final String headquarters; // e.g., "New Delhi", "Chennai Central"

    public RailwayZone(String code, String name, String headquarters) {
        this.code = code;
        this.name = name;
        this.headquarters = headquarters;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public String getHeadquarters() { return headquarters; }

    @Override
    public String toString() {
        return code + " - " + name + " (" + headquarters + ")";
    }
}
