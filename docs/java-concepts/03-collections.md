# 03 — Java Collections Framework in RailFlow

## Concept Overview
The Java Collections Framework (`List`, `Set`, `Map`, `Queue`, `PriorityQueue`, `ConcurrentHashMap`, `CopyOnWriteArrayList`) provides specialized data containers chosen intentionally for optimal time and space complexity.

## Collection Selection Matrix in RailFlow
| Collection Type | Specific Class | Used In | Why Selected |
| :--- | :--- | :--- | :--- |
| **Map** | `ConcurrentHashMap<K, V>` | [`DataRegistry`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/collection/DataRegistry.java) | $O(1)$ fast key-based retrieval and thread-safe concurrent segment mutations. |
| **Priority Queue** | `PriorityQueue<Platform>` | [`PlatformRegistry`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/collection/PlatformRegistry.java) | Heap DSA extracting top-$K$ overcrowded platforms in $O(N \log K)$ time. |
| **Priority Queue** | `PriorityQueue<Alert>` | [`AlertRegistry`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/collection/AlertRegistry.java) | Real-time sorting of active alerts by critical severity level. |
| **Thread-Safe List** | `CopyOnWriteArrayList<T>` | [`CrowdServiceImpl`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/service/CrowdServiceImpl.java) | Safe iteration of historical snapshot audit logs with low write contention. |
| **Unmodifiable List**| `Collections.unmodifiableList` | Domain models (`Platform`, `Station`) | Defensive encapsulation preventing external callers from mutating lists directly. |

## Code Example
```java
public List<Platform> getPlatformsRankedByCrowd() {
    PriorityQueue<Platform> maxHeap = new PriorityQueue<>(
            (p1, p2) -> Double.compare(p2.getOccupancyRate(), p1.getOccupancyRate())
    );
    maxHeap.addAll(storage.values());
    List<Platform> sortedList = new ArrayList<>();
    while (!maxHeap.isEmpty()) {
        sortedList.add(maxHeap.poll());
    }
    return sortedList;
}
```
