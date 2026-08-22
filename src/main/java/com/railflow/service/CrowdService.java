package com.railflow.service;

import com.railflow.dto.DashboardStatsResponse;
import com.railflow.model.CrowdSnapshot;

import java.util.List;
import java.util.Map;

/**
 * Service interface for crowd monitoring and dashboard metrics.
 */
public interface CrowdService {
    DashboardStatsResponse getDashboardStatistics();
    List<Map<String, Object>> getHourlyCrowdTrend();
    void recordSnapshot(CrowdSnapshot snapshot);
    List<CrowdSnapshot> getRecentSnapshots();
}
