package com.railflow.exception;

/**
 * Thrown when a requested platform ID cannot be found.
 */
public class PlatformNotFoundException extends RuntimeException {
    public PlatformNotFoundException(String platformId) {
        super("Platform with identifier '" + platformId + "' was not found in the registry.");
    }
}
