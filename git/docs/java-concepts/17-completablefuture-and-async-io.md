# 17 — CompletableFuture & Non-Blocking Asynchronous I/O

## Overview
External network calls (e.g. querying RapidAPI IRCTC live train and PNR endpoints) run non-blockingly via `CompletableFuture` and `AsyncHttpClient`.

## Asynchronous Architecture
1. **Non-blocking Dispatch**:
   ```java
   public CompletableFuture<String> fetchLiveTrainStatusAsync(String trainNumber) {
       return client.prepareGet(apiUrl + "/train/" + trainNumber)
               .setHeader("X-RapidAPI-Key", apiKey)
               .execute()
               .toCompletableFuture()
               .thenApply(Response::getResponseBody)
               .exceptionally(ex -> fallbackLocalTrainStatus(trainNumber));
   }
   ```
2. **Graceful Fallbacks**:
   - If RapidAPI is unreachable or network times out, `exceptionally(...)` seamlessly falls back to the in-memory timetable without throwing exceptions to the user.

## Benefits
- Prevents HTTP worker thread starvation during external API latency spikes.
- Enables reactive, composable promise pipelines (`thenApply`, `thenCombine`, `thenAccept`).
