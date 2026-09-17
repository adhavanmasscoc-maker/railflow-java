package com.railflow;

import com.railflow.enums.TrainStatus;
import com.railflow.model.Train;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Train Domain & Comparable Ordering Tests")
class TrainTest {

    @Test
    @DisplayName("Should initialize train with correct defaults and calculate delays")
    void testTrainDelayAndETA() {
        Train train = new Train("TRN-001", "12301", "Howrah Rajdhani", "HWH-NDLS",
                "Howrah", "New Delhi", "RAJDHANI", 1200, 22);

        assertEquals(TrainStatus.ON_TIME, train.getStatus());
        assertFalse(train.isDelayed());

        train.setDelayMinutes(25);
        assertTrue(train.isDelayed());
        assertEquals(TrainStatus.DELAYED, train.getStatus());
        assertEquals(25, train.getDelayMinutes());
    }

    @Test
    @DisplayName("Should sort trains primarily by minutesToArrival using Comparable interface")
    void testTrainComparableSorting() {
        Train t1 = new Train("T1", "11111", "Train A", "R1", "S1", "D1", "EXP", 1000, 20);
        t1.setMinutesToArrival(20);

        Train t2 = new Train("T2", "22222", "Train B", "R2", "S2", "D2", "EXP", 1000, 20);
        t2.setMinutesToArrival(5);

        Train t3 = new Train("T3", "33333", "Train C", "R3", "S3", "D3", "EXP", 1000, 20);
        t3.setMinutesToArrival(12);

        List<Train> trains = new ArrayList<>(List.of(t1, t2, t3));
        Collections.sort(trains);

        assertEquals("22222", trains.get(0).getTrainNumber()); // 5 min
        assertEquals("33333", trains.get(1).getTrainNumber()); // 12 min
        assertEquals("11111", trains.get(2).getTrainNumber()); // 20 min
    }
}
