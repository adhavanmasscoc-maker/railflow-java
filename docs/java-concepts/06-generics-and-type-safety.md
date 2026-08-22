# 06 — Generics & Compile-Time Type Safety

## Overview
Java Generics provide compile-time type safety, eliminate boilerplate casting, and enable generic data access patterns across entity registries.

## Key Usages in RailFlow

### 1. Generic Data Storage (`DataRegistry<K, V>`)
```java
public class DataRegistry<K, V> {
    private final Map<K, V> storage = new ConcurrentHashMap<>();

    public V save(K key, V value) {
        Objects.requireNonNull(key, "Key cannot be null");
        Objects.requireNonNull(value, "Value cannot be null");
        storage.put(key, value);
        return value;
    }

    public Optional<V> findById(K key) {
        return Optional.ofNullable(storage.get(key));
    }

    public List<V> getAll() {
        return new ArrayList<>(storage.values());
    }
}
```

### 2. Type-Safe Repositories
- `PlatformRegistry extends DataRegistry<String, Platform>`
- `TrainRegistry extends DataRegistry<String, Train>`
- `AlertRegistry extends DataRegistry<String, Alert>`
- `StationRegistry extends DataRegistry<String, Station>`

## Generic Wildcards and Bounds
```java
// Upper bounded wildcard allowing any recommendation subtype
public void executeBatchRecommendations(List<? extends PlatformRecommendation> recommendations) {
    for (PlatformRecommendation rec : recommendations) {
        processRecommendation(rec);
    }
}
```
