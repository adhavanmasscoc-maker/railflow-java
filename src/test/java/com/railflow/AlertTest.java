package com.railflow;

import com.railflow.enums.AlertSeverity;
import com.railflow.model.Alert;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Alert Lifecycle & Severity Priority Tests")
class AlertTest {

    @Test
    @DisplayName("Should initialize active alert and handle acknowledge / resolve lifecycle")
    void testAlertLifecycle() {
        Alert alert = new Alert("ALT-001", "CRITICAL_OVERCROWDING", AlertSeverity.CRITICAL,
                "Overcrowding", "Platform 1 is at 95% capacity");

        assertTrue(alert.isActive());
        assertFalse(alert.isAcknowledged());
        assertNull(alert.getResolvedAt());

        alert.acknowledge();
        assertTrue(alert.isAcknowledged());

        alert.resolve();
        assertFalse(alert.isActive());
        assertNotNull(alert.getResolvedAt());
    }

    @Test
    @DisplayName("Should sort alerts with CRITICAL severity first in natural order")
    void testAlertSeverityPriorityQueueOrder() {
        Alert low = new Alert("A1", "INFO", AlertSeverity.LOW, "Low", "Low alert");
        Alert crit = new Alert("A2", "CRIT", AlertSeverity.CRITICAL, "Crit", "Critical alert");
        Alert med = new Alert("A3", "MED", AlertSeverity.MEDIUM, "Med", "Medium alert");

        List<Alert> list = new ArrayList<>(List.of(low, crit, med));
        Collections.sort(list);

        assertEquals(AlertSeverity.CRITICAL, list.get(0).getSeverity());
        assertEquals(AlertSeverity.MEDIUM, list.get(1).getSeverity());
        assertEquals(AlertSeverity.LOW, list.get(2).getSeverity());
    }
}
