package com.railflow.repository;

import com.railflow.enums.PlatformStatus;
import com.railflow.model.Platform;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Platform data access.
 */
public interface PlatformRepository {
    Optional<Platform> findById(String id);
    List<Platform> findAll();
    Platform save(Platform platform);
    Optional<Platform> deleteById(String id);
    List<Platform> findByStatus(PlatformStatus status);
    List<Platform> findCritical();
    List<Platform> findAllRankedByCrowd();
    boolean existsById(String id);
    long count();
}
