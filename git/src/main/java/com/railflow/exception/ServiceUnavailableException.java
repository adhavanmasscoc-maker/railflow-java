package com.railflow.exception;

/**
 * Thrown when an internal subsystem or external railway gateway is temporarily unreachable.
 */
public class ServiceUnavailableException extends RuntimeException {
    public ServiceUnavailableException(String message) {
        super(message);
    }

    public ServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
