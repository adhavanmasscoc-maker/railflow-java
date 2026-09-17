package com.railflow.service;

import com.railflow.dao.StationDAO;
import com.railflow.exception.StationNotFoundException;
import com.railflow.model.Station;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service implementation for Station master operations backed by SQLite StationDAO.
 */
@Service
public class StationServiceImpl implements StationService {

    private final StationDAO stationDAO;
    private final StationMapper stationMapper;

    @Autowired
    public StationServiceImpl(StationDAO stationDAO, StationMapper stationMapper) {
        this.stationDAO = stationDAO;
        this.stationMapper = stationMapper;
    }

    @Override
    public List<Station> getAllStations() {
        List<Station> dbList = stationDAO.findAll();
        if (dbList.isEmpty() && stationMapper != null) {
            return stationMapper.getAllStations();
        }
        return dbList;
    }

    @Override
    public Station getStationByCode(String code) {
        return stationDAO.findByCode(code)
                .or(() -> stationMapper != null ? stationMapper.getStation(code) : java.util.Optional.empty())
                .orElseThrow(() -> new StationNotFoundException(code));
    }

    @Override
    public List<Station> searchStations(String query) {
        List<Station> results = stationDAO.search(query, 25);
        if (results.isEmpty() && stationMapper != null) {
            return stationMapper.searchStations(query, 25);
        }
        return results;
    }
}
