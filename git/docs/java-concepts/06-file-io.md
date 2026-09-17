# 06 — Java File I/O in RailFlow

## Concept Overview
Java NIO (`java.nio.file.Path`, `Files`) and traditional buffered character streams (`BufferedReader`, `BufferedWriter`) provide efficient reading, writing, and export of railway datasets.

## Pipeline Architecture
```text
Raw CSV / PDF File
        ↓
Java NIO Path & File Checker
        ↓
BufferedReader / PDFBox Text Stripper
        ↓
Regex Tokenizer & Validator
        ↓
Strong Domain Entities (Station / Train / Platform)
        ↓
Thread-Safe In-Memory Repositories
```

## Relevant Java Classes
- [`com.railflow.io.CsvReader`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/io/CsvReader.java)
- [`com.railflow.io.PdfReader`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/io/PdfReader.java)
- [`com.railflow.io.FileExporter`](file:///d:/CS-ML-JAVA/RailFlow/src/main/java/com/railflow/io/FileExporter.java)

## Code Example
```java
public List<String[]> readCsv(Path filePath, int maxRows) {
    List<String[]> records = new ArrayList<>();
    try (BufferedReader reader = Files.newBufferedReader(filePath, StandardCharsets.UTF_8)) {
        String line;
        int count = 0;
        while ((line = reader.readLine()) != null) {
            records.add(parseCsvLine(line));
            if (maxRows > 0 && ++count >= maxRows) break;
        }
    } catch (IOException e) {
        logger.log(Level.SEVERE, "Failed to read CSV: " + filePath, e);
    }
    return records;
}
```
