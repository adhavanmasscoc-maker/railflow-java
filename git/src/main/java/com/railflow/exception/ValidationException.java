package com.railflow.exception;

/**
 * Thrown when domain or incoming request payload validation fails.
 */
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
