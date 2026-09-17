package com.railflow.dto;

import com.railflow.model.Station;

/**
 * Data Transfer Object for Station records.
 */
public record StationResponse(
        String id,
        String stationCode,
        String name,
        String division,
        int platformCount
) {
    public static StationResponse from(Station s) {
        if (s == null) return null;
        return new StationResponse(
                s.getId(),
                s.getStationCode(),
                s.getName(),
                s.getDivision(),
                s.getPlatformCount()
        );
    }
}
