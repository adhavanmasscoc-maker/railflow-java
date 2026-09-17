package com.railflow.exception;

/**
 * Thrown when an invalid crowd number is submitted (e.g. negative values).
 */
public class InvalidCrowdCountException extends IllegalArgumentException {
    public InvalidCrowdCountException(int crowd) {
        super("Invalid passenger crowd count: " + crowd + ". Crowd count cannot be negative.");
    }
}
