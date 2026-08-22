package com.railflow.service;

import com.railflow.dto.TrainResponse;
import com.railflow.model.Train;

import java.util.List;

/**
 * Service interface for train scheduling and delay management.
 */
public interface TrainService {
    List<TrainResponse> getAllTrains();
    TrainResponse getTrainById(String id);
    TrainResponse getTrainByNumber(String trainNumber);
    List<TrainResponse> getArrivingTrains(int withinMinutes);
    List<TrainResponse> getDelayedTrains();
    TrainResponse updateTrainDelay(String id, int delayMinutes);
    List<TrainResponse> searchTrains(String keyword);
    Train getTrainDomain(String id);
}
