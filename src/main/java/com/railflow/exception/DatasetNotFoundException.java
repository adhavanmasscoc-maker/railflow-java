package com.railflow.exception;

/**
 * Thrown when the empirical Indian Railways CSV or PDF source files cannot be loaded from any resolved paths.
 */
public class DatasetNotFoundException extends RuntimeException {
    public DatasetNotFoundException(String datasetName) {
        super("Required master dataset not found: " + datasetName + ". Please verify file storage paths.");
    }
}
