# 05 — Exception Handling in RailFlow

## Concept Overview
Explicit domain exceptions prevent invalid system states, protect data integrity, and provide informative debugging telemetry for both CLI operators and REST API consumers.

## Where it is used in RailFlow
1. **Model Invariant Enforcement**:
   - `InvalidCrowdCountException` thrown when negative crowd numbers are passed.
   - `InvalidPlatformCapacityException` thrown when capacity $\le 0$.
2. **Lookup Failures**:
   - `PlatformNotFoundException`
   - `TrainNotFoundException`
   - `StationNotFoundException`
3. **Centralized REST Error Translation**:
   - [`GlobalExceptionHandler`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/exception/GlobalExceptionHandler.java) uses `@RestControllerAdvice` to translate Java exceptions to standard HTTP 400/404/500 JSON envelopes.

## Code Example
```java
@ExceptionHandler({PlatformNotFoundException.class, TrainNotFoundException.class})
public ResponseEntity<Map<String, Object>> handleNotFound(RuntimeException ex) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", LocalDateTime.now().toString());
    body.put("status", 404);
    body.put("error", "Not Found");
    body.put("message", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
}
```
