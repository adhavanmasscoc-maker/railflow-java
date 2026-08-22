package com.railflow.service;

import com.railflow.algorithm.TrainSearch;
import com.railflow.dto.TrainResponse;
import com.railflow.exception.TrainNotFoundException;
import com.railflow.model.Train;
import com.railflow.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Train management.
 */
@Service
public class TrainServiceImpl implements TrainService {

    private final TrainRepository trainRepository;

    @Autowired
    public TrainServiceImpl(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    @Override
    public List<TrainResponse> getAllTrains() {
        return trainRepository.findAll().stream()
                .map(TrainResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public TrainResponse getTrainById(String id) {
        return TrainResponse.from(getTrainDomain(id));
    }

    @Override
    public TrainResponse getTrainByNumber(String trainNumber) {
        return trainRepository.findByTrainNumber(trainNumber)
                .map(TrainResponse::from)
                .orElseThrow(() -> new TrainNotFoundException(trainNumber));
    }

    @Override
    public List<TrainResponse> getArrivingTrains(int withinMinutes) {
        return trainRepository.findArrivingWithin(withinMinutes).stream()
                .map(TrainResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<TrainResponse> getDelayedTrains() {
        return trainRepository.findDelayed().stream()
                .map(TrainResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public TrainResponse updateTrainDelay(String id, int delayMinutes) {
        Train train = getTrainDomain(id);
        train.setDelayMinutes(delayMinutes);
        trainRepository.save(train);
        return TrainResponse.from(train);
    }

    @Override
    public List<TrainResponse> searchTrains(String keyword) {
        List<Train> results = TrainSearch.searchByNameOrRoute(trainRepository.findAll(), keyword);
        return results.stream().map(TrainResponse::from).collect(Collectors.toList());
    }

    @Override
    public Train getTrainDomain(String id) {
        return trainRepository.findById(id)
                .or(() -> trainRepository.findByTrainNumber(id))
                .orElseThrow(() -> new TrainNotFoundException(id));
    }
}
