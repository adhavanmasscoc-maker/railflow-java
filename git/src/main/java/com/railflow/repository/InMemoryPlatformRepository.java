package com.railflow.repository;

import com.railflow.collection.PlatformRegistry;
import com.railflow.enums.PlatformStatus;
import com.railflow.model.Platform;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * In-Memory implementation of PlatformRepository backed by thread-safe PlatformRegistry.
 */
@Repository
public class InMemoryPlatformRepository implements PlatformRepository {

    private final PlatformRegistry registry;

    @Autowired
    public InMemoryPlatformRepository(PlatformRegistry registry) {
        this.registry = registry;
        seedDefaultPlatforms();
    }

    @Override
    public Optional<Platform> findById(String id) {
        return registry.get(id);
    }

    @Override
    public List<Platform> findAll() {
        return registry.getAll();
    }

    @Override
    public Platform save(Platform platform) {
        registry.put(platform.getId(), platform);
        return platform;
    }

    @Override
    public Optional<Platform> deleteById(String id) {
        return registry.remove(id);
    }

    @Override
    public List<Platform> findByStatus(PlatformStatus status) {
        return registry.findByStatus(status);
    }

    @Override
    public List<Platform> findCritical() {
        return registry.findCriticalPlatforms();
    }

    @Override
    public List<Platform> findAllRankedByCrowd() {
        return registry.getPlatformsRankedByCrowd();
    }

    @Override
    public boolean existsById(String id) {
        return registry.containsKey(id);
    }

    @Override
    public long count() {
        return registry.size();
    }

    private void seedDefaultPlatforms() {
        if (registry.size() == 0) {
            String[][] initialData = {
                {"PLT-001", "Platform 1", "STN-001", "Central Railway Station", "600", "EXPRESS"},
                {"PLT-002", "Platform 2", "STN-001", "Central Railway Station", "550", "EXPRESS"},
                {"PLT-003", "Platform 3", "STN-001", "Central Railway Station", "500", "SUBURBAN"},
                {"PLT-004", "Platform 4", "STN-001", "Central Railway Station", "480", "SUBURBAN"},
                {"PLT-005", "Platform 5", "STN-001", "Central Railway Station", "520", "EXPRESS"},
                {"PLT-006", "Platform 6", "STN-001", "Central Railway Station", "450", "PASSENGER"},
                {"PLT-007", "Platform 7", "STN-001", "Central Railway Station", "400", "SUBURBAN"},
                {"PLT-008", "Platform 8", "STN-001", "Central Railway Station", "650", "EXPRESS"},
                {"PLT-009", "Platform 9", "STN-001", "Central Railway Station", "500", "PASSENGER"},
                {"PLT-010", "Platform 10", "STN-001", "Central Railway Station", "550", "FREIGHT"}
            };

            int[] initialCrowds = {505, 318, 450, 201, 377, 180, 290, 480, 210, 80};

            for (int i = 0; i < initialData.length; i++) {
                String[] d = initialData[i];
                Platform p = new Platform(d[0], d[1], d[2], d[3], Integer.parseInt(d[4]), d[5]);
                p.updateCrowd(initialCrowds[i]);
                registry.put(p.getId(), p);
            }
        }
    }
}
