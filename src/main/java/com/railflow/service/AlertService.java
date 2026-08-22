package com.railflow.service;

import com.railflow.dto.AlertResponse;
import com.railflow.model.Alert;

import java.util.List;

/**
 * Service interface for alert lifecycle management.
 */
public interface AlertService {
    List<AlertResponse> getAllAlerts();
    List<AlertResponse> getActiveAlerts();
    AlertResponse getAlertById(String id);
    AlertResponse acknowledgeAlert(String id);
    AlertResponse dismissAlert(String id);
    Alert saveAlert(Alert alert);
}
