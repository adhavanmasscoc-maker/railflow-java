package com.railflow.exception;

/**
 * Thrown when an alert is referenced by an invalid or non-existent identifier.
 */
public class AlertNotFoundException extends RuntimeException {
    public AlertNotFoundException(String id) {
        super("Alert not found with ID: " + id);
    }
}
