package com.railflow.exception;

/**
 * Thrown when an automated or manual platform reallocation violates safety headway, clearance, or occupancy constraints.
 */
public class PlatformConflictException extends RuntimeException {
    public PlatformConflictException(String message) {
        super(message);
    }

    public PlatformConflictException(String platformId, String reason) {
        super("Platform conflict on " + platformId + ": " + reason);
    }
}
