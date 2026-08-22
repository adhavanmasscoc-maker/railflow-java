package com.railflow.collection;

import com.railflow.enums.TrainStatus;
import com.railflow.model.Train;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Dedicated registry for Train schedules and live operations.
 */
@Component
public class TrainRegistry extends DataRegistry<String, Train> {

    public List<Train> findArrivingTrains(int thresholdMinutes) {
        return filter(t -> t.isArrivingSoon(thresholdMinutes));
    }

    public List<Train> findDelayedTrains() {
        return storage.values().stream()
                .filter(Train::isDelayed)
                .sorted(Comparator.comparingInt(Train::getDelayMinutes).reversed())
                .collect(Collectors.toList());
    }

    public List<Train> findByStatus(TrainStatus status) {
        return filter(t -> t.getStatus() == status);
    }
}
