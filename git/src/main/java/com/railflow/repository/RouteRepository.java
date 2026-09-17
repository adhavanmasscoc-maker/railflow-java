package com.railflow.repository;

import com.railflow.model.TrainStop;

import java.util.List;
import java.util.Map;

/**
 * Repository interface for train stop sequences and route pathing.
 */
public interface RouteRepository {

    /**
     * Retrieves the strictly ordered route sequence for a given train.
     */
    List<TrainStop> getStopsByTrainNumber(String trainNumber);

    /**
     * Retrieves all scheduled stops passing through a given station code.
     */
    List<TrainStop> getStopsByStationCode(String stationCode, int limit);

    /**
     * Finds direct trains operating between fromStationCode and toStationCode
     * strictly verifying that from_sequence < to_sequence within the same train route.
     */
    List<Map<String, Object>> findDirectTrains(String fromStationCode, String toStationCode);

    /**
     * Returns total count of stop sequences recorded in the database.
     */
    long countStops();
}
