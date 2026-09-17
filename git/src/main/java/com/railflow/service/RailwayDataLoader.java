package com.railflow.service;

import com.railflow.model.ValidationReport;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;

/**
 * Master Data Loader:
 * Automatically discovers stations.json and trainroutes.json / trains.json,
 * executes validation, normalizes records, and builds the in-memory directed railway graph.
 */
@Service
public class RailwayDataLoader {

    private static final Logger log = LoggerFactory.getLogger(RailwayDataLoader.class);

    private final StationMapper stationMapper;
    private final TrainRouteMapper trainRouteMapper;
    private final RailwayGraphBuilder graphBuilder;

    private ValidationReport validationReport = new ValidationReport();
    private boolean initialized = false;

    @Autowired
    public RailwayDataLoader(StationMapper stationMapper, TrainRouteMapper trainRouteMapper, RailwayGraphBuilder graphBuilder) {
        this.stationMapper = stationMapper;
        this.trainRouteMapper = trainRouteMapper;
        this.graphBuilder = graphBuilder;
    }

    @PostConstruct
    public void initialize() {
        if (initialized) return;
        loadData();
    }

    public synchronized ValidationReport loadData() {
        if (initialized) return validationReport;
        long start = System.currentTimeMillis();

        log.info("Starting master Indian Railways data load from stations.json and trainroutes.json...");

        File stationsFile = findFile("stations.json");
        File trainsFile = findFile("trainroutes.json", "trains.json");

        if (stationsFile != null && stationsFile.exists()) {
            stationMapper.loadStations(stationsFile);
        } else {
            log.error("Could not locate stations.json in DATA/, data/, or root directory.");
        }

        if (trainsFile != null && trainsFile.exists()) {
            trainRouteMapper.loadTrains(trainsFile);
        } else {
            log.error("Could not locate trainroutes.json or trains.json in DATA/, data/, or root directory.");
        }

        graphBuilder.buildGraph();

        validationReport.setStationsLoaded(stationMapper.getStationCount());
        validationReport.setTrainsLoaded(trainRouteMapper.getTrainCount());
        validationReport.setTrainStopsLoaded(trainRouteMapper.getTotalStopsCount());
        validationReport.setGraphEdgesCreated(graphBuilder.getTotalEdgeCount());
        validationReport.setUnresolvedStationCodes(stationMapper.getUnresolvedCodes().size());
        validationReport.setDuplicateRecords(0);
        validationReport.setInvalidRecordsSkipped(0);
        validationReport.setLoadTimeMs(System.currentTimeMillis() - start);

        log.info("\n{}", validationReport.toString());
        initialized = true;
        return validationReport;
    }

    private File findFile(String... filenames) {
        String[] candidateDirs = {"DATA", "data", "."};
        for (String dir : candidateDirs) {
            for (String fn : filenames) {
                File f = new File(dir, fn);
                if (f.exists() && f.isFile()) {
                    return f;
                }
            }
        }
        return null;
    }

    public ValidationReport getValidationReport() {
        return validationReport;
    }

    public StationMapper getStationMapper() {
        return stationMapper;
    }

    public TrainRouteMapper getTrainRouteMapper() {
        return trainRouteMapper;
    }

    public RailwayGraphBuilder getGraphBuilder() {
        return graphBuilder;
    }
}
