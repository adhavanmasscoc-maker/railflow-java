# 13 — Comparable & Comparator Sorting

## Overview
Natural ordering and custom multi-criteria sorting are implemented via `Comparable<T>` and `Comparator<T>`.

## Usage in RailFlow
1. **`Train` Natural Ordering**:
   `Train` implements `Comparable<Train>` ordering trains chronologically by `minutesToArrival` then by `trainNumber`:
   ```java
   @Override
   public int compareTo(Train other) {
       int cmp = Integer.compare(this.minutesToArrival, other.minutesToArrival);
       if (cmp != 0) return cmp;
       return this.trainNumber.compareTo(other.trainNumber);
   }
   ```
2. **Dynamic Heuristic Comparators**:
   - Sort by Occupancy Rate: `Comparator.comparingDouble(Platform::getOccupancyRate).reversed()`
   - Sort by Alert Severity & Age:
     ```java
     Comparator.comparing(Alert::getSeverity)
               .thenComparing(Alert::getCreatedAt, Comparator.reverseOrder());
     ```
   - Sort by Train Name: `Comparator.comparing(Train::getName, String.CASE_INSENSITIVE_ORDER)`

## Complexity
- Dual-Pivot Quicksort / TimSort: **$O(N \log N)$ Time**, **$O(N)$ Space**.
