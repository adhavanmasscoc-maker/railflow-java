package com.railflow.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Domain exception thrown when a feedback submission violates business rules.
 *
 * Demonstrates: Custom Exception hierarchy, @ResponseStatus for HTTP mapping,
 * and clean exception handling without exposing stack traces.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidFeedbackException extends RuntimeException {

    public InvalidFeedbackException(String message) {
        super(message);
    }

    public InvalidFeedbackException(String message, Throwable cause) {
        super(message, cause);
    }
}
