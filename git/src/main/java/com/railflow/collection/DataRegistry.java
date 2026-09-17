package com.railflow.collection;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Generic Thread-Safe In-Memory Data Registry demonstrating Java Generics and Collections.
 *
 * @param <K> The type of the unique key / identifier.
 * @param <V> The type of the stored domain entity.
 */
public class DataRegistry<K, V> {

    protected final Map<K, V> storage = new ConcurrentHashMap<>();

    public void put(K key, V value) {
        Objects.requireNonNull(key, "Registry key cannot be null");
        Objects.requireNonNull(value, "Registry value cannot be null");
        storage.put(key, value);
    }

    public Optional<V> get(K key) {
        if (key == null) return Optional.empty();
        return Optional.ofNullable(storage.get(key));
    }

    public boolean containsKey(K key) {
        return key != null && storage.containsKey(key);
    }

    public Optional<V> remove(K key) {
        if (key == null) return Optional.empty();
        return Optional.ofNullable(storage.remove(key));
    }

    public List<V> getAll() {
        return new ArrayList<>(storage.values());
    }

    public List<V> filter(Predicate<V> predicate) {
        Objects.requireNonNull(predicate, "Filter predicate cannot be null");
        return storage.values().stream().filter(predicate).collect(Collectors.toList());
    }

    public int size() {
        return storage.size();
    }

    public void clear() {
        storage.clear();
    }

    public Set<K> keySet() {
        return Collections.unmodifiableSet(storage.keySet());
    }
}
