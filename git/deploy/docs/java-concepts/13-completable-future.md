# 13 — CompletableFuture & Async Integration in RailFlow

## Concept Overview
`CompletableFuture<T>` provides non-blocking, promise-based asynchronous task orchestration in Java, allowing outbound I/O calls to complete without holding caller threads.

## Where it is used in RailFlow
- External IRCTC live train feed requests in [`IrctcApiService.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/service/IrctcApiService.java).
- Asynchronous task dispatching via [`ThreadPoolManager.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/concurrency/ThreadPoolManager.java).

## Code Example
```java
public <T> CompletableFuture<T> submitAsyncTask(Callable<T> task) {
    CompletableFuture<T> future = new CompletableFuture<>();
    asyncWorkerPool.submit(() -> {
        try {
            future.complete(task.call());
        } catch (Exception e) {
            future.completeExceptionally(e);
        }
    });
    return future;
}
```

## Why it was chosen
Allows non-blocking network operations and resilient fallback handling if external endpoints experience latency or timeouts.
