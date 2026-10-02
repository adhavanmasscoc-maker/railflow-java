# 05 — Collections Framework Internals

## Overview
RailFlow makes extensive use of the Java Collections Framework (`Map`, `List`, `Set`, `Queue`) choosing optimal implementations based on algorithmic time and space complexity requirements.

## Collection Structures Used

| Structure | RailFlow Class Usage | Internal Implementation | Time Complexity |
|---|---|---|---|
| `ConcurrentHashMap<K, V>` | `DataRegistry<K, V>` (Platforms, Trains, Alerts) | Array of Bins + Red-Black Trees (TreeBins) with lock-free reads | $O(1)$ amortized get/put |
| `ArrayList<T>` | Train schedule stops, CSV records | Dynamic contiguous array with $1.5\times$ growth | $O(1)$ random access |
| `PriorityQueue<Platform>` | `PlatformRanking` Heap | Binary Min/Max-Heap in contiguous array | $O(\log N)$ push/poll |
| `HashSet<String>` | `RailwayDataValidator` seen row hashes | Hash table backed by `HashMap` | $O(1)$ duplicate check |
| `SynchronizedList` | Time-series crowd history | Synchronized wrapper over `ArrayList` | $O(1)$ append |

## Code Example
```java
// Top-K Most Congested Platforms using Min-Heap PriorityQueue
public static List<Platform> getTopKCongested(List<Platform> platforms, int k) {
    PriorityQueue<Platform> minHeap = new PriorityQueue<>(k, 
        Comparator.comparingDouble(Platform::getOccupancyRate));

    for (Platform p : platforms) {
        minHeap.offer(p);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }
    List<Platform> result = new ArrayList<>(minHeap);
    result.sort(Comparator.comparingDouble(Platform::getOccupancyRate).reversed());
    return result;
}
```
