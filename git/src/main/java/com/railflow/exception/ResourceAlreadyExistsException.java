package com.railflow.exception;

/**
 * Thrown when attempting to register a duplicate train number, station code, or platform.
 */
public class ResourceAlreadyExistsException extends RuntimeException {
    public ResourceAlreadyExistsException(String resourceType, String identifier) {
        super(resourceType + " already exists with identifier: " + identifier);
    }
}
