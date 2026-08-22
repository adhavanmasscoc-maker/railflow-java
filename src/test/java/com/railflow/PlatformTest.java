package com.railflow;

import com.railflow.enums.PlatformStatus;
import com.railflow.exception.InvalidCrowdCountException;
import com.railflow.exception.InvalidPlatformCapacityException;
import com.railflow.model.Platform;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Platform Domain & Encapsulation Tests")
class PlatformTest {

    private Platform platform;

    @BeforeEach
    void setUp() {
        platform = new Platform("PLT-001", "Platform 1", "STN-001", "Central Station", 500, "EXPRESS");
    }

    @Test
    @DisplayName("Should initialize platform with correct default values")
    void testInitialValues() {
        assertEquals("PLT-001", platform.getId());
        assertEquals("Platform 1", platform.getName());
        assertEquals(500, platform.getCapacity());
        assertEquals(0, platform.getCurrentCrowd());
        assertEquals(0.0, platform.getOccupancyRate());
        assertEquals(PlatformStatus.EMPTY, platform.getStatus());
        assertEquals(4, platform.getTotalGateCount());
        assertEquals(4, platform.getActiveGateCount());
    }

    @Test
    @DisplayName("Should correctly recalculate occupancy rate and status on crowd update")
    void testCrowdUpdate() {
        platform.updateCrowd(250);
        assertEquals(0.50, platform.getOccupancyRate(), 0.001);
        assertEquals(PlatformStatus.NORMAL, platform.getStatus());
        assertFalse(platform.isCritical());

        platform.updateCrowd(460); // 92%
        assertEquals(0.92, platform.getOccupancyRate(), 0.001);
        assertEquals(PlatformStatus.CRITICAL, platform.getStatus());
        assertTrue(platform.isCritical());
        assertTrue(platform.isOvercrowded());
    }

    @Test
    @DisplayName("Should throw InvalidCrowdCountException on negative crowd count")
    void testNegativeCrowdThrowsException() {
        assertThrows(InvalidCrowdCountException.class, () -> platform.updateCrowd(-50));
    }

    @Test
    @DisplayName("Should throw InvalidPlatformCapacityException on zero or negative capacity")
    void testInvalidCapacityThrowsException() {
        assertThrows(InvalidPlatformCapacityException.class, () ->
                new Platform("PLT-002", "Platform 2", "STN-001", "Central", 0, "EXPRESS"));
        assertThrows(InvalidPlatformCapacityException.class, () ->
                new Platform("PLT-003", "Platform 3", "STN-001", "Central", -100, "EXPRESS"));
    }

    @Test
    @DisplayName("Should calculate available capacity accurately")
    void testAvailableCapacity() {
        platform.updateCrowd(350);
        assertEquals(150, platform.getAvailableCapacity());

        platform.updateCrowd(600); // Exceeds capacity
        assertEquals(0, platform.getAvailableCapacity());
    }
}
