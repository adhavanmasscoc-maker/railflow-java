package com.railflow.service;

import com.railflow.dto.AlertResponse;
import com.railflow.exception.PlatformNotFoundException;
import com.railflow.model.Alert;
import com.railflow.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Alert management.
 */
@Service
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;

    @Autowired
    public AlertServiceImpl(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @Override
    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findAll().stream()
                .map(AlertResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlertResponse> getActiveAlerts() {
        return alertRepository.findActive().stream()
                .map(AlertResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public AlertResponse getAlertById(String id) {
        return alertRepository.findById(id)
                .map(AlertResponse::from)
                .orElseThrow(() -> new PlatformNotFoundException("Alert " + id));
    }

    @Override
    public AlertResponse acknowledgeAlert(String id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new PlatformNotFoundException("Alert " + id));
        alert.acknowledge();
        alertRepository.save(alert);
        return AlertResponse.from(alert);
    }

    @Override
    public AlertResponse dismissAlert(String id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new PlatformNotFoundException("Alert " + id));
        alert.resolve();
        alertRepository.save(alert);
        return AlertResponse.from(alert);
    }

    @Override
    public Alert saveAlert(Alert alert) {
        return alertRepository.save(alert);
    }
}
