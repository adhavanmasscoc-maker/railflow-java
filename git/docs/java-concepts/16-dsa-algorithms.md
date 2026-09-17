# 16 — Data Structures & Algorithms (DSA) in RailFlow

## Algorithms Implemented in RailFlow

### 1. Searching Algorithms ([`TrainSearch.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/algorithm/TrainSearch.java))
- **Linear Search**: $O(N)$ sequential scan for unsorted collections and substring searches.
- **Binary Search**: $O(\log N)$ logarithmic divide-and-conquer on collections sorted by 5-digit train number.
- **Hash-based Lookup**: $O(1)$ constant time lookup in `ConcurrentHashMap`.

### 2. Heap / PriorityQueue Prioritization ([`PlatformRanking.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/algorithm/PlatformRanking.java))
- **Max-Heap**: Extracts Top-$K$ most overcrowded platforms in $O(N \log K)$ time.
- **Min-Heap**: Extracts Top-$K$ most available underutilized platforms for dynamic train diversions.

### 3. Rule-Based / Heuristic Optimization Engine ([`PlatformOptimizer.java`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/algorithm/PlatformOptimizer.java))
- Deterministic heuristic balancing passenger density against physical gate capacity, transit headroom, and delay risks.
*(Note: Clarified as deterministic heuristic rule-based optimization rather than artificial intelligence/machine learning).*
