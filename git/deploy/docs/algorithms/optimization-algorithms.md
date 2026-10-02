# RailFlow — Algorithms & Heuristic Optimization Specification

## 1. Platform Optimization Strategies (Strategy Pattern)

RailFlow implements pluggable strategies for allocating incoming trains:

1. **Least-Crowded Strategy (`LeastCrowdedStrategy.java`)**:
   $$\text{Platform}^* = \arg\min_{p \in \text{AvailablePlatforms}} \left( \frac{\text{CurrentCrowd}_p}{\text{Capacity}_p} \right)$$
2. **Capacity-Headroom Matching Strategy (`CapacityBasedStrategy.java`)**:
   Filters platforms where available capacity $\ge 60\%$ of incoming train passenger volume, selecting the lowest occupancy match.
3. **Nearest-Adjacent Strategy (`NearestPlatformStrategy.java`)**:
   Selects the nearest unoccupied adjacent platform with $< 75\%$ occupancy to minimize pedestrian transit times.

## 2. Searching Algorithms (`TrainSearch.java`)
- **Linear Search**: $O(N)$ sequential comparison for partial name/route searches.
- **Binary Search**: $O(\log N)$ search on sorted train lists by 5-digit Indian Railway code.

## 3. Prioritization via Heap DSA (`PlatformRanking.java`)
- Uses `java.util.PriorityQueue` to maintain dynamic min/max binary heaps for extracting top-$K$ congested platforms in $O(N \log K)$ time.
