package com.railflow.exception;

/**
 * Thrown when client query frequency exceeds maximum allowable throughput thresholds.
 */
public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException(String message) {
        super(message);
    }
}
