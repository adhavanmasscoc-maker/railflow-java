package com.railflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.railflow.model.Train;
import com.railflow.model.TrainStop;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Train Route Mapper: Loads dynamic train schedules and ordered stop sequences
 * from trainroutes.json / trains.json.
 */
@Service
public class TrainRouteMapper {

    private static final Logger log = LoggerFactory.getLogger(TrainRouteMapper.class);

    private final StationMapper stationMapper;
    private final Map<String, Train> trainByNumber = new ConcurrentHashMap<>();
    private final Map<String, List<TrainStop>> stopsByTrain = new ConcurrentHashMap<>();
    private final List<Train> allTrains = new ArrayList<>();
    private int totalStopsCount = 0;
    private boolean loaded = false;

    @Autowired
    public TrainRouteMapper(StationMapper stationMapper) {
        this.stationMapper = stationMapper;
    }

    public synchronized void loadTrains(File file) {
        if (loaded && !trainByNumber.isEmpty()) return;
        long start = System.currentTimeMillis();

        if (file == null || !file.exists()) {
            log.warn("Train routes file not found at: {}", file != null ? file.getAbsolutePath() : "null");
            return;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(file);

            if (root.isArray()) {
                for (JsonNode tNode : root) {
                    String trainNumber = tNode.path("trainNumber").asText("").trim();
                    if (trainNumber.isEmpty()) continue;

                    String trainName = tNode.path("trainName").asText("Express").trim();
                    String type = tNode.path("type").asText("EXP").trim();

                    String srcCode = tNode.path("source").path("code").asText("").trim().toUpperCase();
                    String dstCode = tNode.path("destination").path("code").asText("").trim().toUpperCase();

                    double overallDist = tNode.path("overallDistanceKm").asDouble(0.0);

                    // Running days formatting
                    JsonNode daysNode = tNode.path("runningDays");
                    List<String> days = new ArrayList<>();
                    if (daysNode.isObject()) {
                        String[] dayKeys = {"SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"};
                        for (String d : dayKeys) {
                            if (daysNode.path(d).asBoolean(false)) {
                                days.add(d);
                            }
                        }
                    }
                    String freq = days.size() == 7 ? "Daily" : (days.isEmpty() ? "Special" : String.join(", ", days));

                    Train train = new Train(
                            "TRN-" + trainNumber,
                            trainNumber,
                            trainName,
                            srcCode + " ➔ " + dstCode,
                            srcCode,
                            dstCode,
                            type,
                            1000,
                            0
                    );
                    train.setTotalSeats((int) Math.max(500, overallDist > 0 ? overallDist : 1000));

                    List<TrainStop> stops = new ArrayList<>();
                    JsonNode routeArray = tNode.path("completeOrderedRoute");
                    if (routeArray.isArray()) {
                        for (JsonNode sNode : routeArray) {
                            int seq = sNode.path("sequence").asInt(stops.size() + 1);
                            String stnCode = sNode.path("stationCode").asText("").trim().toUpperCase();
                            String stnName = sNode.path("stationName").asText("").trim();

                            // Use station mapper to verify genuine name if available
                            if (stnName.isEmpty() && stationMapper != null) {
                                stnName = stationMapper.resolveStationName(stnCode);
                            }

                            String arr = sNode.hasNonNull("arrivalTime") ? sNode.path("arrivalTime").asText() : null;
                            String dep = sNode.hasNonNull("departureTime") ? sNode.path("departureTime").asText() : null;
                            int jDay = sNode.path("journeyDay").asInt(1);
                            double dist = sNode.path("distance").asDouble(0.0);

                            TrainStop stop = new TrainStop(trainNumber, seq, stnCode, stnName, arr, dep, jDay, dist);
                            stops.add(stop);
                        }
                    }

                    trainByNumber.put(trainNumber, train);
                    stopsByTrain.put(trainNumber, stops);
                    allTrains.add(train);
                    totalStopsCount += stops.size();
                }
            }

            loaded = true;
            log.info("TrainRouteMapper loaded {} trains with {} stops from {} in {} ms",
                    trainByNumber.size(), totalStopsCount, file.getName(), (System.currentTimeMillis() - start));

        } catch (Exception e) {
            log.error("Failed to parse trainroutes.json: {}", e.getMessage(), e);
        }
    }

    public Optional<Train> getTrain(String trainNumber) {
        if (trainNumber == null) return Optional.empty();
        return Optional.ofNullable(trainByNumber.get(trainNumber.trim()));
    }

    public List<TrainStop> getStops(String trainNumber) {
        if (trainNumber == null) return Collections.emptyList();
        return stopsByTrain.getOrDefault(trainNumber.trim(), Collections.emptyList());
    }

    public List<Train> getAllTrains() {
        return Collections.unmodifiableList(allTrains);
    }

    public Map<String, List<TrainStop>> getAllStopsByTrain() {
        return Collections.unmodifiableMap(stopsByTrain);
    }

    public int getTrainCount() {
        return trainByNumber.size();
    }

    public int getTotalStopsCount() {
        return totalStopsCount;
    }
}
