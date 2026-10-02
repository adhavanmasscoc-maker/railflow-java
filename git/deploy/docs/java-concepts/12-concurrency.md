# 12 — Thread-Safety & Shared Mutable State in RailFlow

## Shared State Analysis & Thread-Safety Design
| Shared Resource | Access Pattern | Mechanism Used | Why It Prevents Race Conditions |
| :--- | :--- | :--- | :--- |
| `Platform.currentCrowd` | HTTP Controller updates crowd, background thread adjusts crowd | `synchronized` method on Platform | Mutual exclusion ensures atomic read-modify-write on crowd count. |
| Platform & Train Registries | Concurrent reads by REST API, periodic writes by background tasks | `ConcurrentHashMap` | Segmented locks allow concurrent non-blocking reads and safe writes. |
| ID Sequence Counters | Concurrent alert & recommendation generation | `AtomicInteger` | Hardware-level lock-free CAS (Compare-And-Swap) operations. |
| Historical Snapshots | Read during dashboard rendering, appended on interval | `CopyOnWriteArrayList` | Safe iteration snapshot guarantee without `ConcurrentModificationException`. |

## Code Example
```java
// Atomic sequence ID generator
private final AtomicInteger recommendationSeq = new AtomicInteger(100);

private String nextRecId() {
    return "REC-" + recommendationSeq.getAndIncrement(); // Thread-safe CAS
}
```
