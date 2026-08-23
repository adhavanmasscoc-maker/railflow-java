package com.railflow.exception;

/**
 * Thrown when an underlying SQLite transaction, query execution, or connection fails.
 */
public class DatabaseOperationException extends RuntimeException {
    public DatabaseOperationException(String message, Throwable cause) {
        super(message, cause);
    }

    public DatabaseOperationException(String message) {
        super(message);
    }
}
