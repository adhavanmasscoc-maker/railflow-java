package com.railflow.concurrency;

import com.railflow.enums.TrainStatus;
import com.railflow.model.Train;
import com.railflow.repository.TrainRepository;

import java.util.List;
import java.util.logging.Logger;

/**
 * Concurrency worker task: Advances train ETA clocks and transitions train arrival states.
 */
public class TrainSyncTask implements Runnable {

    private static final Logger logger = Logger.getLogger(TrainSyncTask.class.getName());

    private final TrainRepository trainRepository;

    public TrainSyncTask(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    @Override
    public void run() {
        try {
            List<Train> trains = trainRepository.findAll();
            for (Train t : trains) {
                if (t.getStatus() == TrainStatus.DEPARTED || t.getStatus() == TrainStatus.CANCELLED) {
                    continue;
                }

                int eta = t.getMinutesToArrival();
                if (eta > 1) {
                    t.setMinutesToArrival(eta - 1);
                } else if (eta == 1) {
                    t.setMinutesToArrival(0);
                    t.setStatus(TrainStatus.ARRIVING);
                }
            }
        } catch (Exception e) {
            logger.warning("Error during train sync execution: " + e.getMessage());
        }
    }
}
