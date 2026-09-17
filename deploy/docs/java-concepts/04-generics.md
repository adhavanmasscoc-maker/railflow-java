# 04 — Generics in RailFlow

## Concept Overview
Java Generics provide compile-time type safety, eliminate manual type casting, and enable generic container structures reusable across diverse domain models.

## Where it is used in RailFlow
- Generic repository base: [`DataRegistry<K, V>`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/collection/DataRegistry.java).
- Asynchronous task wrapper: `submitAsyncTask(Callable<T> task) -> CompletableFuture<T>`.
- Functional filter predicates: `filter(Predicate<V> predicate)`.

## Relevant Java Classes
- [`com.railflow.collection.DataRegistry<K, V>`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/collection/DataRegistry.java)
- [`com.railflow.concurrency.ThreadPoolManager`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/concurrency/ThreadPoolManager.java)

## Code Example
```java
public class DataRegistry<K, V> {
    protected final Map<K, V> storage = new ConcurrentHashMap<>();

    public void put(K key, V value) {
        Objects.requireNonNull(key, "Key must not be null");
        storage.put(key, value);
    }

    public Optional<V> get(K key) {
        return Optional.ofNullable(storage.get(key));
    }

    public List<V> filter(Predicate<V> predicate) {
        return storage.values().stream().filter(predicate).collect(Collectors.toList());
    }
}
```

## Why it was chosen
Replaces duplicated in-memory map CRUD logic across Platforms, Trains, and Alerts with a single type-safe, generic foundation.
