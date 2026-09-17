package com.railflow.repository;

import com.railflow.model.Station;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Station master data access.
 */
public interface StationRepository {
    Optional<Station> findByCode(String code);
    List<Station> findAll();
    Station save(Station station);
    List<Station> searchByNameOrCode(String query);
    long count();
}
