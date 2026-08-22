package com.railflow.controller;

import com.railflow.collection.StationRegistry;
import com.railflow.collection.TrainRegistry;
import com.railflow.io.RailwayDataLoader;
import com.railflow.model.RailwayRecord;
import com.railflow.model.Train;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * REST controller for exploring the actual Indian Railways empirical CSV and PDF datasets.
 */
@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class DatasetController {

    private final RailwayDataLoader dataLoader;
    private final TrainRegistry trainRegistry;
    private final StationRegistry stationRegistry;

    @Autowired
    public DatasetController(TrainRegistry trainRegistry, StationRegistry stationRegistry) {
        this.trainRegistry = trainRegistry;
        this.stationRegistry = stationRegistry;
        this.dataLoader = new RailwayDataLoader();
        this.dataLoader.loadAllData(trainRegistry, stationRegistry);
    }

    @GetMapping("/stats")
    public Map<String, Object> getDatasetStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalCsvRecords", dataLoader.getRawRecords().size());
        stats.put("uniqueTrainsCount", trainRegistry.getAll().size());
        stats.put("uniqueStationsCount", stationRegistry.getAll().size());
        stats.put("dataSource", "Official Indian Railways Master Dataset (1970–2013+)");
        stats.put("provenance", "REAL DATA");
        return stats;
    }

    @GetMapping("/quality")
    public Map<String, Object> getDataQuality() {
        return dataLoader.getValidator().getDataQualityReport();
    }

    @GetMapping("/records")
    public List<RailwayRecord> getRecords(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            @RequestParam(name = "category", required = false) String category) {
        List<RailwayRecord> all = dataLoader.getRawRecords();
        if (category != null && !category.trim().isEmpty()) {
            all = all.stream()
                    .filter(r -> r.getCategory().toLowerCase().contains(category.toLowerCase()))
                    .collect(Collectors.toList());
        }

        int start = Math.min(page * size, all.size());
        int end = Math.min(start + size, all.size());
        return all.subList(start, end);
    }

    @GetMapping("/popular-trains")
    public List<Train> getPopularTrains() {
        return trainRegistry.getAll().stream()
                .filter(t -> {
                    String name = t.getName().toUpperCase();
                    return name.contains("RAJDHANI") || name.contains("SHATABDI")
                            || name.contains("VANDE BHARAT") || name.contains("DURONTO")
                            || name.contains("EXPRESS");
                })
                .sorted(Comparator.comparing(Train::getTrainNumber))
                .collect(Collectors.toList());
    }

    @GetMapping("/tamil-trains")
    public List<Train> getTamilNaduTrains() {
        return trainRegistry.getAll().stream()
                .filter(t -> {
                    String name = t.getName().toUpperCase();
                    String route = (t.getRoute() != null ? t.getRoute() : "").toUpperCase();
                    return name.contains("CHENNAI") || name.contains("MADURAI") || name.contains("COIMBATORE")
                            || name.contains("TAMIL") || name.contains("KANYAKUMARI") || name.contains("KOVAI")
                            || name.contains("PANDIAN") || name.contains("CHOLAN") || name.contains("PALLAVAN")
                            || name.contains("NELLAI") || name.contains("PEARL CITY") || name.contains("VAIGAI")
                            || name.contains("ROCKFORT") || route.contains("MAS") || route.contains("MS");
                })
                .sorted(Comparator.comparing(Train::getName))
                .collect(Collectors.toList());
    }

    @GetMapping("/architecture")
    public List<Map<String, String>> getArchitectureInfo() {
        List<Map<String, String>> concepts = new ArrayList<>();

        addConcept(concepts, "Object-Oriented Programming (OOP)", 
                "Clean encapsulation of Platform, Train, Station, and polymorphism for PlatformRecommendation hierarchy.",
                "com.railflow.model.PlatformRecommendation", "O(1) Domain Encapsulation");

        addConcept(concepts, "Generic Thread-Safe Registries",
                "DataRegistry<K, V> wrapping ConcurrentHashMap with computeIfAbsent and atomic updates.",
                "com.railflow.collection.DataRegistry", "O(1) Average Lookup");

        addConcept(concepts, "DSA — Binary & Linear Search",
                "TrainSearch implements both Linear Search O(N) for substrings and Binary Search O(log N) on sorted train numbers.",
                "com.railflow.algorithm.TrainSearch", "O(log N) Time Complexity");

        addConcept(concepts, "DSA — PriorityQueue Binary Heap",
                "PlatformRanking uses Min-Heap and Max-Heap PriorityQueues to extract top-K congested platforms efficiently.",
                "com.railflow.algorithm.PlatformRanking", "O(N log K) Time Complexity");

        addConcept(concepts, "Java Stream API & Collectors",
                "Stream pipelines with filter, map, sorted, groupingBy, and distinct for data aggregations.",
                "com.railflow.service.PlatformServiceImpl", "Functional Data Pipelines");

        addConcept(concepts, "Multithreading & Scheduled Concurrency",
                "ScheduledExecutorService running CrowdUpdateTask and TrainSyncTask on dedicated daemon threads.",
                "com.railflow.concurrency.ThreadPoolManager", "Non-blocking Asynchronous Execution");

        addConcept(concepts, "Strategy Design Pattern",
                "Pluggable platform allocation algorithms via PlatformOptimizationStrategy interface.",
                "com.railflow.strategy.PlatformOptimizationStrategy", "Open/Closed Principle");

        addConcept(concepts, "Java File I/O & Streaming",
                "BufferedReader with NIO2 and RFC 4180 CsvParser for streaming 22.1 MB CSV rows without memory bloat.",
                "com.railflow.io.RailwayDataLoader", "Stream Pipeline");

        return concepts;
    }

    private void addConcept(List<Map<String, String>> list, String title, String description, String className, String complexity) {
        Map<String, String> c = new LinkedHashMap<>();
        c.put("title", title);
        c.put("description", description);
        c.put("className", className);
        c.put("complexity", complexity);
        list.add(c);
    }
}
