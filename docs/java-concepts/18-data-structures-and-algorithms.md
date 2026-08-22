# 18 — Data Structures & Algorithms in RailFlow

## Overview
RailFlow implements core DSA algorithms to achieve high throughput and predictable Big-O performance across train searching, platform ranking, and route analysis.

## Key Algorithms

### 1. Train Search (`TrainSearch.java`)
- **Binary Search ($O(\log N)$)**:
  Searches for exact 5-digit train numbers in a pre-sorted array of `Train` objects.
- **Linear Search ($O(N)$)**:
  Scans across train names and route corridors for partial substring matching.
- **Hash Table Lookup ($O(1)$)**:
  Direct constant-time query in `Map<String, Train>`.

### 2. Platform Ranking Binary Heap (`PlatformRanking.java`)
- **Top-$K$ Congested ($O(N \log K)$)**:
  Maintains a Min-Heap of size $K$ to extract the $K$ most congested platforms.
- **Top-$K$ Safest ($O(N \log K)$)**:
  Maintains a Max-Heap of size $K$ to extract platforms with the lowest occupancy.

### 3. Route Network Graph (`RouteAnalyzer.java`)
- **Graph Representation**:
  Adjacency list `Map<String, Set<String>> routeGraph` representing station connections.
- **BFS Shortest Path ($O(V + E)$)**:
  Computes minimum junction transfers between any origin and destination station.

## Summary Complexity Table
| Operation | Algorithm / Data Structure | Time Complexity | Space Complexity |
|---|---|---|---|
| Exact Train Lookup | Binary Search | $O(\log N)$ | $O(1)$ |
| Exact Train ID | Hash Map | $O(1)$ | $O(N)$ |
| Partial Name Search | Linear Search | $O(N)$ | $O(1)$ |
| Top-$K$ Critical Platforms | PriorityQueue Min-Heap | $O(N \log K)$ | $O(K)$ |
| Station Connection Path | Breadth-First Search (BFS) | $O(V + E)$ | $O(V)$ |
