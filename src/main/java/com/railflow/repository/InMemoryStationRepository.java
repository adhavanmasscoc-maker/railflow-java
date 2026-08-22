package com.railflow.repository;

import com.railflow.model.Station;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-Memory implementation of StationRepository.
 */
@Repository
public class InMemoryStationRepository implements StationRepository {

    private final Map<String, Station> stationMap = new ConcurrentHashMap<>();

    public InMemoryStationRepository() {
        seedMajorStations();
    }

    @Override
    public Optional<Station> findByCode(String code) {
        if (code == null) return Optional.empty();
        return Optional.ofNullable(stationMap.get(code.toUpperCase().trim()));
    }

    @Override
    public List<Station> findAll() {
        return new ArrayList<>(stationMap.values());
    }

    @Override
    public Station save(Station station) {
        stationMap.put(station.getCode(), station);
        return station;
    }

    @Override
    public List<Station> searchByNameOrCode(String query) {
        if (query == null || query.isBlank()) return Collections.emptyList();
        String q = query.toLowerCase().trim();
        return stationMap.values().stream()
                .filter(s -> s.getCode().toLowerCase().contains(q) || s.getName().toLowerCase().contains(q) || s.getCity().toLowerCase().contains(q))
                .sorted(Comparator.comparing(Station::getName))
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return stationMap.size();
    }

    private void seedMajorStations() {
        Station[] stations = {
                new Station("NDLS", "New Delhi Railway Station", "New Delhi", "NR"),
                new Station("CSMT", "Chhatrapati Shivaji Maharaj Terminus", "Mumbai", "CR"),
                new Station("HWH", "Howrah Junction", "Kolkata", "ER"),
                new Station("MAS", "Chennai Central", "Chennai", "SR"),
                new Station("SBC", "KSR Bengaluru City Junction", "Bengaluru", "SWR"),
                new Station("HYB", "Hyderabad Deccan", "Hyderabad", "SCR"),
                new Station("ADI", "Ahmedabad Junction", "Ahmedabad", "WR"),
                new Station("PUNE", "Pune Junction", "Pune", "CR")
        };
        for (Station s : stations) {
            stationMap.put(s.getCode(), s);
        }
    }
}
