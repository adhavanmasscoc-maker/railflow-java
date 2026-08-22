package com.railflow;

import com.railflow.collection.DataRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Generic DataRegistry Collections Tests")
class DataRegistryTest {

    private DataRegistry<String, String> registry;

    @BeforeEach
    void setUp() {
        registry = new DataRegistry<>();
    }

    @Test
    @DisplayName("Should put, retrieve, and remove generic elements")
    void testBasicCrud() {
        registry.put("K1", "Value 1");
        registry.put("K2", "Value 2");

        assertEquals(2, registry.size());
        assertTrue(registry.containsKey("K1"));

        Optional<String> val = registry.get("K1");
        assertTrue(val.isPresent());
        assertEquals("Value 1", val.get());

        registry.remove("K1");
        assertFalse(registry.containsKey("K1"));
        assertEquals(1, registry.size());
    }

    @Test
    @DisplayName("Should filter elements using Predicate correctly")
    void testPredicateFilter() {
        registry.put("A", "Apple");
        registry.put("B", "Banana");
        registry.put("C", "Avocado");

        List<String> aFruits = registry.filter(s -> s.startsWith("A"));
        assertEquals(2, aFruits.size());
        assertTrue(aFruits.contains("Apple"));
        assertTrue(aFruits.contains("Avocado"));
    }
}
