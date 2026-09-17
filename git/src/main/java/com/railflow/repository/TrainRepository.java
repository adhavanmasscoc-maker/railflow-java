package com.railflow.repository;

import com.railflow.enums.TrainStatus;
import com.railflow.model.Train;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Train data access.
 */
public interface TrainRepository {
    Optional<Train> findById(String id);
    Optional<Train> findByTrainNumber(String trainNumber);
    List<Train> findAll();
    Train save(Train train);
    Optional<Train> deleteById(String id);
    List<Train> findArrivingWithin(int minutes);
    List<Train> findDelayed();
    List<Train> findByStatus(TrainStatus status);
    boolean existsById(String id);
    long count();
}
