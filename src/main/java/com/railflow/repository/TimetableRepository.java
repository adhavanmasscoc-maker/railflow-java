package com.railflow.repository;

import com.railflow.model.TrainStop;

import java.util.List;
import java.util.Map;

/**
 * Repository interface for train timetables and running day schedules.
 */
public interface TimetableRepository {

    /**
     * Retrieves active running days for a train (Monday - Sunday).
     */
    Map<String, Boolean> getRunningDays(String trainNumber);

    /**
     * Retrieves the human-readable frequency text for a train (e.g. Daily, Mon, Wed, Fri).
     */
    String getFrequencyText(String trainNumber);

    /**
     * Retrieves the live/static timetable for a station.
     */
    List<TrainStop> getStationTimetable(String stationCode, int limit);

    /**
     * Total number of train running day schedules recorded.
     */
    long countRunningDays();
}
