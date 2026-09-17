package com.railflow.exception;

/**
 * Thrown when a requested train identifier or number is not found.
 */
public class TrainNotFoundException extends RuntimeException {
    public TrainNotFoundException(String trainIdOrNumber) {
        super("Train with identifier or number '" + trainIdOrNumber + "' was not found in the schedule.");
    }
}
