package com.railflow.model;

/**
 * Data Validation Report capturing statistics and integrity audits during dataset ingestion.
 */
public class ValidationReport {
    private int stationsLoaded;
    private int trainsLoaded;
    private int trainStopsLoaded;
    private int graphEdgesCreated;
    private int unresolvedStationCodes;
    private int duplicateRecords;
    private int invalidRecordsSkipped;
    private long loadTimeMs;

    public ValidationReport() {}

    public int getStationsLoaded() { return stationsLoaded; }
    public void setStationsLoaded(int stationsLoaded) { this.stationsLoaded = stationsLoaded; }

    public int getTrainsLoaded() { return trainsLoaded; }
    public void setTrainsLoaded(int trainsLoaded) { this.trainsLoaded = trainsLoaded; }

    public int getTrainStopsLoaded() { return trainStopsLoaded; }
    public void setTrainStopsLoaded(int trainStopsLoaded) { this.trainStopsLoaded = trainStopsLoaded; }

    public int getGraphEdgesCreated() { return graphEdgesCreated; }
    public void setGraphEdgesCreated(int graphEdgesCreated) { this.graphEdgesCreated = graphEdgesCreated; }

    public int getUnresolvedStationCodes() { return unresolvedStationCodes; }
    public void setUnresolvedStationCodes(int unresolvedStationCodes) { this.unresolvedStationCodes = unresolvedStationCodes; }

    public int getDuplicateRecords() { return duplicateRecords; }
    public void setDuplicateRecords(int duplicateRecords) { this.duplicateRecords = duplicateRecords; }

    public int getInvalidRecordsSkipped() { return invalidRecordsSkipped; }
    public void setInvalidRecordsSkipped(int invalidRecordsSkipped) { this.invalidRecordsSkipped = invalidRecordsSkipped; }

    public long getLoadTimeMs() { return loadTimeMs; }
    public void setLoadTimeMs(long loadTimeMs) { this.loadTimeMs = loadTimeMs; }

    @Override
    public String toString() {
        return String.format("""
            === REAL INDIAN RAILWAYS DATA VALIDATION REPORT ===
            Stations loaded:          %d
            Trains loaded:            %d
            Train stops loaded:       %d
            Graph edges created:      %d
            Unresolved station codes: %d
            Duplicate records:        %d
            Invalid records skipped:  %d
            Load & Ingestion Time:    %d ms
            ===================================================
            """, stationsLoaded, trainsLoaded, trainStopsLoaded, graphEdgesCreated,
            unresolvedStationCodes, duplicateRecords, invalidRecordsSkipped, loadTimeMs);
    }
}
