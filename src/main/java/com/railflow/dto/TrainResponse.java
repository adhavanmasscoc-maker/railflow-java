package com.railflow.dto;

import com.railflow.model.Train;

/**
 * Data Transfer Object for Train details.
 */
public record TrainResponse(
        String id,
        String trainNumber,
        String name,
        String route,
        String sourceStation,
        String destinationStation,
        String type,
        int totalCapacity,
        int coachCount,
        int currentPassengers,
        String assignedPlatformId,
        String status,
        int delayMinutes,
        int minutesToArrival,
        String scheduledArrival,
        String scheduledDeparture
) {
    public static TrainResponse from(Train t) {
        if (t == null) return null;
        return new TrainResponse(
                t.getId(),
                t.getTrainNumber(),
                t.getName(),
                t.getRoute(),
                t.getSourceStation(),
                t.getDestinationStation(),
                t.getType(),
                t.getTotalCapacity(),
                t.getCoachCount(),
                t.getCurrentPassengers(),
                t.getAssignedPlatformId(),
                t.getStatus() != null ? t.getStatus().name() : "ON_TIME",
                t.getDelayMinutes(),
                t.getMinutesToArrival(),
                t.getScheduledArrival() != null ? t.getScheduledArrival().toString() : "",
                t.getScheduledDeparture() != null ? t.getScheduledDeparture().toString() : ""
        );
    }
}
