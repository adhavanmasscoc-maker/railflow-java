package com.railflow.service;

import com.railflow.dto.PlatformResponse;
import com.railflow.exception.PlatformNotFoundException;
import com.railflow.model.Platform;
import com.railflow.repository.PlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for platform operations.
 */
@Service
public class PlatformServiceImpl implements PlatformService {

    private final PlatformRepository platformRepository;

    @Autowired
    public PlatformServiceImpl(PlatformRepository platformRepository) {
        this.platformRepository = platformRepository;
    }

    @Override
    public List<PlatformResponse> getAllPlatforms() {
        return platformRepository.findAll().stream()
                .map(PlatformResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public PlatformResponse getPlatformById(String id) {
        return PlatformResponse.from(getPlatformDomain(id));
    }

    @Override
    public List<PlatformResponse> getPlatformsByStatus(String status) {
        if (status == null || status.isBlank()) {
            return getAllPlatforms();
        }
        return platformRepository.findAll().stream()
                .filter(p -> p.getStatus().name().equalsIgnoreCase(status.trim()))
                .map(PlatformResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlatformResponse> getCriticalPlatforms() {
        return platformRepository.findCritical().stream()
                .map(PlatformResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public PlatformResponse updatePlatformCrowd(String id, int newCrowd) {
        Platform p = getPlatformDomain(id);
        p.updateCrowd(newCrowd);
        platformRepository.save(p);
        return PlatformResponse.from(p);
    }

    @Override
    public Platform getPlatformDomain(String id) {
        return platformRepository.findById(id)
                .orElseThrow(() -> new PlatformNotFoundException(id));
    }
}
