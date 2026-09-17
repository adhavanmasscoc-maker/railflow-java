package com.railflow.exception;

/**
 * Thrown when an invalid platform capacity is defined (e.g. <= 0).
 */
public class InvalidPlatformCapacityException extends IllegalArgumentException {
    public InvalidPlatformCapacityException(int capacity) {
        super("Invalid platform capacity: " + capacity + ". Capacity must be strictly positive (> 0).");
    }
}
