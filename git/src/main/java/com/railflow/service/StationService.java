package com.railflow.service;

import com.railflow.model.Station;

import java.util.List;

/**
 * Service interface for station directory and search operations.
 */
public interface StationService {
    List<Station> getAllStations();
    Station getStationByCode(String code);
    List<Station> searchStations(String query);
}
