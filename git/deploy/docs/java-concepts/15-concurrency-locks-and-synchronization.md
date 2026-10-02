# 15 — Concurrency: Locks, Mutexes & Synchronization

## Overview
When multiple threads update shared platform states or append historical time-series datapoints, synchronization ensures mutual exclusion and consistency.

## Concurrency Techniques Used
1. **Synchronized Blocks**:
   - Synchronized history buffer pruning:
     ```java
     public void addCrowdHistoryEntry(int totalCrowd, double avgOccupancy) {
         synchronized (crowdHistory) {
             crowdHistory.add(entry);
             if (crowdHistory.size() > 144) {
                 crowdHistory.remove(0);
             }
         }
     }
     ```
2. **Lock-Free Read Strategies**:
   - `ConcurrentHashMap` read operations do not acquire locks, achieving maximum read throughput while background writers perform updates.
3. **Atomic CAS (Compare-And-Swap)**:
   - `AtomicInteger` and `AtomicLong` use hardware-level CPU CAS operations avoiding heavy OS context switching.
