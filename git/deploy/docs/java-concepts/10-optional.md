# 10 — Java Optional<T> Pattern in RailFlow

## Concept Overview
`Optional<T>` is a container object used exclusively for return types of methods where a value may legally be absent, preventing `NullPointerException` (NPE).

## Where it is used in RailFlow
- Repository lookups: `Optional<Platform> findById(String id)`.
- Search algorithms: `Optional<Train> binarySearchByNumber(List<Train> list, String number)`.
- Optimization strategies: `Optional<Platform> selectOptimalPlatform(...)`.

## Code Example
```java
// Safe query execution without null returns
@Override
public PlatformResponse getPlatformById(String id) {
    return platformRepository.findById(id)
            .map(PlatformResponse::from)
            .orElseThrow(() -> new PlatformNotFoundException(id));
}
```

## Why it was chosen
Forces callers to explicitly handle presence or absence of data instead of assuming objects exist.
