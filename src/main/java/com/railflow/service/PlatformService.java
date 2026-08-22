package com.railflow.service;

import com.railflow.dto.PlatformResponse;
import com.railflow.model.Platform;

import java.util.List;

/**
 * Service interface defining platform operations.
 */
public interface PlatformService {
    List<PlatformResponse> getAllPlatforms();
    PlatformResponse getPlatformById(String id);
    List<PlatformResponse> getPlatformsByStatus(String status);
    List<PlatformResponse> getCriticalPlatforms();
    PlatformResponse updatePlatformCrowd(String id, int newCrowd);
    Platform getPlatformDomain(String id);
}
