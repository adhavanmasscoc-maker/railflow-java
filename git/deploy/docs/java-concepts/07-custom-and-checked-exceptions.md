# 07 — Custom Exceptions & Error Handling

## Overview
RailFlow enforces clean domain boundaries by defining specific, semantic runtime exceptions mapped to descriptive HTTP status codes via `@RestControllerAdvice`.

## Domain Exception Hierarchy
- `RailFlowException` (Base runtime exception)
  - `PlatformNotFoundException` (Mapped to HTTP 404)
  - `TrainNotFoundException` (Mapped to HTTP 404)
  - `StationNotFoundException` (Mapped to HTTP 404)
  - `InvalidCrowdCountException` (Mapped to HTTP 400 Bad Request)
  - `InvalidPlatformCapacityException` (Mapped to HTTP 400 Bad Request)
  - `DataParsingException` (Mapped to HTTP 500)

## Global Exception Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({PlatformNotFoundException.class, TrainNotFoundException.class})
    public ResponseEntity<Map<String, Object>> handleNotFound(RuntimeException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", 404);
        body.put("error", "Resource Not Found");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }
}
```
