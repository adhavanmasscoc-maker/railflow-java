package com.railflow.service;

import com.railflow.dao.DataQualityDAO;
import com.railflow.model.DataQualityMetrics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service calculating live, dynamically-derived database health and data quality metrics.
 */
@Service
public class DataQualityService {

    private final DataQualityDAO dataQualityDAO;

    @Autowired
    public DataQualityService(DataQualityDAO dataQualityDAO) {
        this.dataQualityDAO = dataQualityDAO;
    }

    public DataQualityMetrics getLiveMetrics() {
        return dataQualityDAO.calculateMetrics();
    }
}
