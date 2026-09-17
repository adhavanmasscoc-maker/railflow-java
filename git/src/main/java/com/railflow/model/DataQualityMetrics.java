package com.railflow.model;

/**
 * Model representing real-time derived data quality metrics calculated from SQLite tables.
 */
public class DataQualityMetrics {
    private final long totalRecords;
    private final long validRecords;
    private final long missingValues;
    private final long duplicateKeyCollisions;
    private final long invalidStationCodes;
    private final long invalidTrainNumbers;
    private final String schemaStatus;
    private final double importSuccessRate;
    private final String lastRefreshTimestamp;

    public DataQualityMetrics(long totalRecords, long validRecords, long missingValues,
                              long duplicateKeyCollisions, long invalidStationCodes,
                              long invalidTrainNumbers, String schemaStatus,
                              double importSuccessRate, String lastRefreshTimestamp) {
        this.totalRecords = totalRecords;
        this.validRecords = validRecords;
        this.missingValues = missingValues;
        this.duplicateKeyCollisions = duplicateKeyCollisions;
        this.invalidStationCodes = invalidStationCodes;
        this.invalidTrainNumbers = invalidTrainNumbers;
        this.schemaStatus = schemaStatus;
        this.importSuccessRate = importSuccessRate;
        this.lastRefreshTimestamp = lastRefreshTimestamp;
    }

    public long getTotalRecords() { return totalRecords; }
    public long getValidRecords() { return validRecords; }
    public long getMissingValues() { return missingValues; }
    public long getDuplicateKeyCollisions() { return duplicateKeyCollisions; }
    public long getInvalidStationCodes() { return invalidStationCodes; }
    public long getInvalidTrainNumbers() { return invalidTrainNumbers; }
    public String getSchemaStatus() { return schemaStatus; }
    public double getImportSuccessRate() { return importSuccessRate; }
    public String getLastRefreshTimestamp() { return lastRefreshTimestamp; }
}
