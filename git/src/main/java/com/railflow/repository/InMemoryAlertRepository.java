package com.railflow.repository;

import com.railflow.collection.AlertRegistry;
import com.railflow.enums.AlertSeverity;
import com.railflow.model.Alert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * In-Memory implementation of AlertRepository backed by AlertRegistry.
 */
@Repository
public class InMemoryAlertRepository implements AlertRepository {

    private final AlertRegistry registry;

    @Autowired
    public InMemoryAlertRepository(AlertRegistry registry) {
        this.registry = registry;
        seedDefaultAlerts();
    }

    @Override
    public Optional<Alert> findById(String id) {
        return registry.get(id);
    }

    @Override
    public List<Alert> findAll() {
        return registry.getAll();
    }

    @Override
    public List<Alert> findActive() {
        return registry.getActiveAlertsPrioritized();
    }

    @Override
    public List<Alert> findBySeverity(AlertSeverity severity) {
        return registry.findBySeverity(severity);
    }

    @Override
    public Alert save(Alert alert) {
        registry.put(alert.getId(), alert);
        return alert;
    }

    @Override
    public Optional<Alert> deleteById(String id) {
        return registry.remove(id);
    }

    @Override
    public void purgeResolvedOlderThan(int hours) {
        registry.removeResolvedOlderThan(hours);
    }

    @Override
    public long count() {
        return registry.size();
    }

    private void seedDefaultAlerts() {
        if (registry.size() == 0) {
            Alert a1 = new Alert("ALT-0001", "CRITICAL_OVERCROWDING", AlertSeverity.HIGH,
                    "Platform 1 Near Capacity (84%)", "High footfall due to arriving Howrah Rajdhani.");
            a1.setPlatformId("PLT-001");
            a1.setPlatformName("Platform 1");
            a1.setRecommendedAction("Open Gate 3 & 4; divert incoming commuters.");
            registry.put(a1.getId(), a1);

            Alert a2 = new Alert("ALT-0002", "TRAIN_DELAY", AlertSeverity.MEDIUM,
                    "Train 11037 Delayed by 35 mins", "Pune-Gorakhpur Express delayed due to signal congestion.");
            a2.setTrainId("TRN-004");
            a2.setTrainName("Pune Gorakhpur Express");
            a2.setRecommendedAction("Hold platform assignment and update station passenger displays.");
            registry.put(a2.getId(), a2);
        }
    }
}
