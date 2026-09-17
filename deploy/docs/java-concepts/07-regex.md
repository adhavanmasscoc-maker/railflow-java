# 07 — Regular Expressions (Regex) in RailFlow

## Concept Overview
Java `java.util.regex.Pattern` and `Matcher` classes perform pattern matching, structural validation, and field extraction on railway text lines and schedule codes.

## Where it is used in RailFlow
- Parsing 5-digit Indian Railways train numbers and train descriptions from extracted PDF documents.
- Parsing station codes and parenthesized metadata from station lists.

## Relevant Java Classes
- [`com.railflow.io.RailwayDataParser`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/io/RailwayDataParser.java)

## Code Example
```java
// Pattern for matching 5-digit train number followed by name
private static final Pattern TRAIN_PATTERN = Pattern.compile("^(\\d{5})\\s+([A-Za-z0-9\\s\\-\\./]+)$");

public List<Train> parseTrainsFromTextLines(List<String> lines, String defaultType) {
    List<Train> trains = new ArrayList<>();
    for (String line : lines) {
        Matcher matcher = TRAIN_PATTERN.matcher(line.trim());
        if (matcher.find()) {
            String trainNumber = matcher.group(1).trim();
            String name = matcher.group(2).trim();
            trains.add(new Train("TRN-" + trainNumber, trainNumber, name, ...));
        }
    }
    return trains;
}
```

## Why it was chosen
Regex compiles once (`static final Pattern`) and validates thousands of lines with minimal garbage collection overhead.
