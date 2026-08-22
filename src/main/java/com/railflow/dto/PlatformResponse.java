package com.railflow.dto;

import com.railflow.model.Platform;

/**
 * Data Transfer Object for Platform information sent across REST endpoints.
 */
public record PlatformResponse(
        String id,
        String name,
        String stationId,
        String stationName,
        int capacity,
        int currentCrowd,
        double occupancyRate,
        int occupancyPercentage,
        String status,
        String platformType,
        String trainId,
        String trainName,
        String trainStatus,
        int trainDelay,
        int gateCount,
        int activeGates,
        int inflow,
        int outflow,
        double avgWaitTime,
        String lastUpdated
) {
    public static PlatformResponse from(Platform p) {
        if (p == null) return null;
        return new PlatformResponse(
                p.getId(),
                p.getName(),
                p.getStationId(),
                p.getStationName(),
                p.getCapacity(),
                p.getCurrentCrowd(),
                p.getOccupancyRate(),
                (int) Math.round(p.getOccupancyRate() * 100),
                p.getStatus() != null ? p.getStatus().name() : "NORMAL",
                p.getPlatformType(),
                p.getCurrentTrainId(),
                p.getCurrentTrainName(),
                p.getTrainStatus(),
                p.getTrainDelayMinutes(),
                p.getTotalGateCount(),
                p.getActiveGateCount(),
                p.getInflowRate(),
                p.getOutflowRate(),
                p.getAvgWaitTimeMinutes(),
                p.getLastUpdated() != null ? p.getLastUpdated().toString() : ""
        );
    }
}
