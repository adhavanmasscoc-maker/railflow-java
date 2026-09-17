package com.railflow;

import com.railflow.algorithm.TrainSearch;
import com.railflow.model.Train;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Train Search DSA Algorithms (Linear vs Binary Search)")
class TrainSearchTest {

    private List<Train> trainList;
    private List<Train> sortedTrainList;

    @BeforeEach
    void setUp() {
        trainList = List.of(
                new Train("T1", "12301", "Howrah Rajdhani", "HWH-NDLS", "Howrah", "New Delhi", "EXP", 1000, 20),
                new Train("T2", "11037", "Pune Gorakhpur", "PUNE-GKP", "Pune", "Gorakhpur", "EXP", 1000, 20),
                new Train("T3", "12622", "Tamil Nadu Express", "NDLS-MAS", "New Delhi", "Chennai", "EXP", 1000, 20),
                new Train("T4", "17031", "Mumbai CST Express", "HYB-CSMT", "Hyderabad", "Mumbai", "EXP", 1000, 20)
        );

        // Pre-sorted list by trainNumber for Binary Search
        sortedTrainList = new ArrayList<>(trainList);
        sortedTrainList.sort(Comparator.comparing(Train::getTrainNumber));
    }

    @Test
    @DisplayName("Linear Search: should find existing train and return empty for non-existing")
    void testLinearSearch() {
        Optional<Train> found = TrainSearch.linearSearchByNumber(trainList, "12622");
        assertTrue(found.isPresent());
        assertEquals("Tamil Nadu Express", found.get().getName());

        Optional<Train> notFound = TrainSearch.linearSearchByNumber(trainList, "99999");
        assertTrue(notFound.isEmpty());
    }

    @Test
    @DisplayName("Binary Search: should correctly perform O(log N) search on sorted list")
    void testBinarySearch() {
        Optional<Train> found = TrainSearch.binarySearchByNumber(sortedTrainList, "12301");
        assertTrue(found.isPresent());
        assertEquals("Howrah Rajdhani", found.get().getName());

        Optional<Train> notFound = TrainSearch.binarySearchByNumber(sortedTrainList, "00000");
        assertTrue(notFound.isEmpty());
    }

    @Test
    @DisplayName("Partial Keyword Search: should return matching trains by route/city")
    void testKeywordSearch() {
        List<Train> results = TrainSearch.searchByNameOrRoute(trainList, "Chennai");
        assertEquals(1, results.size());
        assertEquals("12622", results.get(0).getTrainNumber());
    }
}
