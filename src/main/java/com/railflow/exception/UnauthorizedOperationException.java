package com.railflow.exception;

/**
 * Thrown when an operator attempts an action exceeding their security clearances.
 */
public class UnauthorizedOperationException extends RuntimeException {
    public UnauthorizedOperationException(String message) {
        super(message);
    }
}
