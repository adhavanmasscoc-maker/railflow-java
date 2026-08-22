package com.railflow.concurrency;

import com.railflow.model.Platform;
import com.railflow.repository.PlatformRepository;

import java.util.List;
import java.util.Random;
import java.util.logging.Logger;

/**
 * Concurrency worker task: Simulates realistic passenger crowd delta updates on active platforms.
 * Demonstrates Runnable implementation executed by managed thread pools.
 */
public class CrowdUpdateTask implements Runnable {

    private static final Logger logger = Logger.getLogger(CrowdUpdateTask.class.getName());

    private final PlatformRepository platformRepository;
    private final Random random = new Random();

    public CrowdUpdateTask(PlatformRepository platformRepository) {
        this.platformRepository = platformRepository;
    }

    @Override
    public void run() {
        try {
            List<Platform> platforms = platformRepository.findAll();
            for (Platform p : platforms) {
                // Generate realistic delta (-15 to +20 people per tick)
                int delta = random.nextInt(36) - 15;
                p.adjustCrowd(delta);

                // Update simulated inflow and outflow rates
                p.setInflowRate(Math.max(5, random.nextInt(40) + 10));
                p.setOutflowRate(Math.max(5, random.nextInt(35) + 5));
            }
        } catch (Exception e) {
            logger.warning("Error during crowd update execution: " + e.getMessage());
        }
    }
}
