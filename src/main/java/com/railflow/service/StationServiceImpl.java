package com.railflow.service;

import com.railflow.exception.StationNotFoundException;
import com.railflow.model.Station;
import com.railflow.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service implementation for Station master operations.
 */
@Service
public class StationServiceImpl implements StationService {

    private final StationRepository stationRepository;

    @Autowired
    public StationServiceImpl(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    @Override
    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    @Override
    public Station getStationByCode(String code) {
        return stationRepository.findByCode(code)
                .orElseThrow(() -> new StationNotFoundException(code));
    }

    @Override
    public List<Station> searchStations(String query) {
        return stationRepository.searchByNameOrCode(query);
    }
}
