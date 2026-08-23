package com.railflow.exception;

import com.railflow.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Enterprise Centralized Exception Handler for RailFlow REST API.
 * Maps domain and platform exceptions to standard RFC 7807 problem details with correlation IDs.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ─── 404 NOT FOUND ────────────────────────────────────────────────────────
    @ExceptionHandler({
            PlatformNotFoundException.class,
            TrainNotFoundException.class,
            StationNotFoundException.class,
            PnrNotFoundException.class,
            AlertNotFoundException.class,
            DatasetNotFoundException.class
    })
    public ResponseEntity<ErrorResponse> handleNotFound(RuntimeException ex, HttpServletRequest request) {
        log.warn("Resource not found: {} on {}", ex.getMessage(), request.getRequestURI());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                "RESOURCE_NOT_FOUND",
                ex.getMessage(),
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // ─── 400 BAD REQUEST ──────────────────────────────────────────────────────
    @ExceptionHandler({
            InvalidCrowdCountException.class,
            InvalidPlatformCapacityException.class,
            InvalidFeedbackException.class,
            InvalidPnrException.class,
            ValidationException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequest(RuntimeException ex, HttpServletRequest request) {
        log.warn("Bad request: {} on {}", ex.getMessage(), request.getRequestURI());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "INVALID_REQUEST_PARAMETERS",
                ex.getMessage(),
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // ─── 409 CONFLICT ─────────────────────────────────────────────────────────
    @ExceptionHandler({
            PlatformConflictException.class,
            ResourceAlreadyExistsException.class
    })
    public ResponseEntity<ErrorResponse> handleConflict(RuntimeException ex, HttpServletRequest request) {
        log.warn("Operational conflict: {} on {}", ex.getMessage(), request.getRequestURI());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.getReasonPhrase(),
                "RESOURCE_STATE_CONFLICT",
                ex.getMessage(),
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // ─── 401 / 403 UNAUTHORIZED / FORBIDDEN ───────────────────────────────────
    @ExceptionHandler(UnauthorizedOperationException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedOperationException ex, HttpServletRequest request) {
        log.warn("Unauthorized access: {} on {}", ex.getMessage(), request.getRequestURI());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                HttpStatus.FORBIDDEN.getReasonPhrase(),
                "UNAUTHORIZED_OPERATION",
                ex.getMessage(),
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // ─── 429 TOO MANY REQUESTS ────────────────────────────────────────────────
    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleRateLimit(RateLimitExceededException ex, HttpServletRequest request) {
        log.warn("Rate limit exceeded: {} on {}", ex.getMessage(), request.getRequestURI());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.TOO_MANY_REQUESTS.value(),
                HttpStatus.TOO_MANY_REQUESTS.getReasonPhrase(),
                "RATE_LIMIT_EXCEEDED",
                ex.getMessage(),
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.TOO_MANY_REQUESTS);
    }

    // ─── 503 SERVICE UNAVAILABLE ──────────────────────────────────────────────
    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleServiceUnavailable(ServiceUnavailableException ex, HttpServletRequest request) {
        log.error("Service unavailable error: {} on {}", ex.getMessage(), request.getRequestURI());
        ErrorResponse error = new ErrorResponse(
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase(),
                "SERVICE_TEMPORARILY_UNAVAILABLE",
                ex.getMessage(),
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE);
    }

    // ─── BEAN VALIDATION FAILURES ─────────────────────────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "VALIDATION_FAILED",
                "Request validation failed for " + fieldErrors.size() + " field(s)",
                request.getRequestURI()
        );
        error.setFieldErrors(fieldErrors);
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // ─── PARAMETER & TYPE MISMATCH ────────────────────────────────────────────
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "MISSING_PARAMETER",
                "Required parameter '" + ex.getParameterName() + "' of type " + ex.getParameterType() + " is missing.",
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "TYPE_MISMATCH",
                "Parameter '" + ex.getName() + "' invalid value '" + ex.getValue() + "'",
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.METHOD_NOT_ALLOWED.value(),
                HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase(),
                "METHOD_NOT_ALLOWED",
                "HTTP method " + ex.getMethod() + " is not supported for this endpoint.",
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.METHOD_NOT_ALLOWED);
    }

    // ─── SQL / DATABASE FAILURES ──────────────────────────────────────────────
    @ExceptionHandler({DatabaseOperationException.class, DataAccessException.class})
    public ResponseEntity<ErrorResponse> handleDatabaseErrors(Exception ex, HttpServletRequest request) {
        log.error("SQLite Database error on {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "DATABASE_ERROR",
                "An unexpected database error occurred while querying the persistent storage.",
                request.getRequestURI()
        );
        error.setCorrelationId(generateCorrelationId());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ─── CATCH-ALL 500 INTERNAL SERVER ERROR ─────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        String corrId = generateCorrelationId();
        log.error("[CorrelationId: {}] Unhandled exception processing {}: {}", corrId, request.getRequestURI(), ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "INTERNAL_SERVER_ERROR",
                "An unexpected internal error occurred. Ref: " + corrId,
                request.getRequestURI()
        );
        error.setCorrelationId(corrId);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private String generateCorrelationId() {
        return "ERR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
