package com.railflow.repository;

import com.railflow.collection.TrainRegistry;
import com.railflow.enums.TrainStatus;
import com.railflow.model.Train;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * In-Memory implementation of TrainRepository backed by TrainRegistry.
 */
@Repository
public class InMemoryTrainRepository implements TrainRepository {

    private final TrainRegistry registry;

    @Autowired
    public InMemoryTrainRepository(TrainRegistry registry) {
        this.registry = registry;
        seedDefaultTrains();
    }

    @Override
    public Optional<Train> findById(String id) {
        return registry.get(id);
    }

    @Override
    public Optional<Train> findByTrainNumber(String trainNumber) {
        if (trainNumber == null) return Optional.empty();
        return registry.getAll().stream()
                .filter(t -> trainNumber.equalsIgnoreCase(t.getTrainNumber()))
                .findFirst();
    }

    @Override
    public List<Train> findAll() {
        return registry.getAll();
    }

    @Override
    public Train save(Train train) {
        registry.put(train.getId(), train);
        return train;
    }

    @Override
    public Optional<Train> deleteById(String id) {
        return registry.remove(id);
    }

    @Override
    public List<Train> findArrivingWithin(int minutes) {
        return registry.findArrivingTrains(minutes);
    }

    @Override
    public List<Train> findDelayed() {
        return registry.findDelayedTrains();
    }

    @Override
    public List<Train> findByStatus(TrainStatus status) {
        return registry.findByStatus(status);
    }

    @Override
    public boolean existsById(String id) {
        return registry.containsKey(id);
    }

    @Override
    public long count() {
        return registry.size();
    }

    private void seedDefaultTrains() {
        if (registry.size() == 0) {
            String[][] trainData = {
                {"TRN-001", "12301", "Howrah Rajdhani Express", "HWH-NDLS", "Howrah", "New Delhi", "RAJDHANI", "1200", "22", "PLT-001", "ARRIVING", "0", "2"},
                {"TRN-002", "17031", "Mumbai CST Express", "HYB-CSMT", "Hyderabad", "Mumbai", "EXPRESS", "1000", "20", "PLT-005", "ON_TIME", "0", "8"},
                {"TRN-003", "22119", "Tejas Express", "CSMT-MAO", "Mumbai", "Madgaon", "SUPERFAST", "800", "16", "PLT-003", "ON_TIME", "0", "14"},
                {"TRN-004", "11037", "Pune Gorakhpur Express", "PUNE-GKP", "Pune", "Gorakhpur", "EXPRESS", "1100", "21", "PLT-002", "DELAYED", "35", "45"},
                {"TRN-005", "12431", "Trivandrum Rajdhani", "TVC-NZM", "Trivandrum", "Hazrat Nizamuddin", "RAJDHANI", "1150", "22", "PLT-004", "ON_TIME", "0", "22"},
                {"TRN-006", "12622", "Tamil Nadu Express", "NDLS-MAS", "New Delhi", "Chennai", "SUPERFAST", "1300", "24", "PLT-008", "ON_TIME", "0", "30"},
                {"TRN-007", "12004", "Lucknow Shatabdi", "NDLS-LKO", "New Delhi", "Lucknow", "SUPERFAST", "900", "18", "PLT-001", "DELAYED", "15", "18"},
                {"TRN-008", "12952", "Mumbai Rajdhani", "NDLS-MMCT", "New Delhi", "Mumbai Central", "RAJDHANI", "1200", "22", "PLT-005", "ON_TIME", "0", "50"}
            };

            for (String[] d : trainData) {
                Train t = new Train(d[0], d[1], d[2], d[3], d[4], d[5], d[6],
                        Integer.parseInt(d[7]), Integer.parseInt(d[8]));
                t.setAssignedPlatformId(d[9]);
                t.setStatus(TrainStatus.valueOf(d[10]));
                t.setDelayMinutes(Integer.parseInt(d[11]));
                t.setMinutesToArrival(Integer.parseInt(d[12]));
                t.setCurrentPassengers((int) (t.getTotalCapacity() * 0.75));
                registry.put(t.getId(), t);
            }
        }
    }
}
