# 09 — Regular Expressions & High-Performance String Processing

## Overview
PDF text extractions and messy CSV records contain unstructured strings that must be tokenized, sanitized, and matched into domain entities.

## Regex Patterns in RailFlow
1. **5-Digit Train Number Detection**:
   ```java
   private static final Pattern TRAIN_PATTERN = Pattern.compile("\\b(\\d{5})\\b\\s+(.+)");
   ```
2. **Station Code and Name Extraction**:
   ```java
   private static final Pattern STATION_PATTERN = Pattern.compile("([A-Z]{2,6})\\s+-\\s+(.+)");
   ```
3. **Numeric Sanitization**:
   ```java
   String clean = raw.replaceAll("[^0-9.-]", "");
   ```

## Best Practices
- **Pre-compiled `Pattern` instances**: Compiling regexes into `static final Pattern` constants avoids recompilation overhead on every line parse ($O(1)$ pattern caching).
- **`StringBuilder` vs String Concatenation**: Used inside parser loops to avoid creating unnecessary string garbage in the Eden generation.
