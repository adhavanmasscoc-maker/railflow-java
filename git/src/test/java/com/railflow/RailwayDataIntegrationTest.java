package com.railflow;

import com.railflow.cli.RailwayDataCliRunner;
import com.railflow.database.DatabaseManager;
import com.railflow.ingestion.DataIngestionEngine;
import com.railflow.model.GraphEdge;
import com.railflow.model.Station;
import com.railflow.model.Train;
import com.railflow.model.TrainStop;
import com.railflow.repository.jdbc.*;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.io.File;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * End-to-End Integration and Validation Test for Railway Data Ingestion.
 * Executes the full ingestion pipeline against DATA/ and validates all queries
 * against the generated SQLite database (database/railway.db).
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RailwayDataIntegrationTest {

    private static final DatabaseManager dbManager = new DatabaseManager("database/railway.db");

    @Test
    @Order(1)
    public void testFullDataIngestionPipeline() {
        System.out.println("\n========================================================");
        System.out.println("  EXECUTING RAILWAY DATA IMPORT: DATA/ -> database/railway.db");
        System.out.println("========================================================");

        RailwayDataCliRunner runner = new RailwayDataCliRunner(dbManager);
        DataIngestionEngine.ImportMetrics metrics = runner.executeImport(true, false);

        assertNotNull(metrics);
        assertEquals("SUCCESS", metrics.status);
        assertTrue(metrics.stationsImported >= 8000, "Should import at least 8,000 stations");
        assertTrue(metrics.trainsImported >= 5000, "Should import at least 5,000 trains");
        assertTrue(metrics.trainStopsImported >= 400000, "Should import at least 400,000 train stops");
        assertTrue(metrics.graphEdgesCreated >= 400000, "Should create at least 400,000 graph edges");
        assertTrue(metrics.runningDayRecordsImported >= 5000, "Should import running day schedules");
    }

    @Test
    @Order(2)
    public void testDatabaseTableCounts() throws Exception {
        System.out.println("\n=== VALIDATING DATABASE TABLE ROW COUNTS ===");
        String[] tables = {
            "data_sources",
            "import_runs",
            "stations",
            "station_aliases",
            "trains",
            "train_stops",
            "train_running_days",
            "rail_edges",
            "special_trains"
        };

        try (Connection conn = dbManager.getConnection();
             Statement stmt = conn.createStatement()) {
            for (String tbl : tables) {
                try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM " + tbl)) {
                    if (rs.next()) {
                        long count = rs.getLong(1);
                        System.out.printf("  ✓ Table %-20s : %,d rows%n", tbl, count);
                        assertTrue(count > 0, "Table " + tbl + " should have records");
                    }
                }
            }
        }
    }

    @Test
    @Order(3)
    public void testStationLookupAndSearch() {
        System.out.println("\n=== VALIDATING STATION LOOKUP & AUTOCOMPLETE ===");
        JdbcStationRepository stationRepo = new JdbcStationRepository(dbManager);

        // 1. Direct Lookup by Code
        Optional<Station> ndlsOpt = stationRepo.findByCode("NDLS");
        assertTrue(ndlsOpt.isPresent(), "NDLS station should exist");
        Station ndls = ndlsOpt.get();
        System.out.printf("  Found Station: %s (%s), City: %s, Zone: %s, Lat: %.4f, Lon: %.4f%n",
                ndls.getName(), ndls.getCode(), ndls.getCity(), ndls.getZone(), ndls.getLatitude(), ndls.getLongitude());
        assertEquals("NDLS", ndls.getCode());

        Optional<Station> masOpt = stationRepo.findByCode("MAS");
        assertTrue(masOpt.isPresent(), "MAS station should exist");
        System.out.printf("  Found Station: %s (%s)%n", masOpt.get().getName(), masOpt.get().getCode());

        // 2. Lookup by Alias (e.g. "DELHI" -> NDLS, "MUMBAI" -> CSMT, "MADRAS" -> MAS)
        Optional<Station> delhiAlias = stationRepo.findByCode("DELHI");
        assertTrue(delhiAlias.isPresent(), "Alias DELHI should resolve");
        System.out.printf("  Alias 'DELHI' resolved to: %s (%s)%n", delhiAlias.get().getName(), delhiAlias.get().getCode());

        // 3. Search Autocomplete
        List<Station> searchResults = stationRepo.searchByNameOrCode("CHENNAI", 5);
        assertFalse(searchResults.isEmpty(), "Search for CHENNAI should yield results");
        System.out.println("  Search 'CHENNAI' top results:");
        for (Station s : searchResults) {
            System.out.printf("    -> %s (%s)%n", s.getName(), s.getCode());
        }

        // 4. Unknown Station Test (Must return empty, never invent data)
        Optional<Station> unknown = stationRepo.findByCode("XYZ99");
        assertTrue(unknown.isEmpty(), "Non-existent station XYZ99 must return empty");
        System.out.println("  ✓ Negative test: Non-existent station 'XYZ99' correctly returned Optional.empty()");
    }

    @Test
    @Order(4)
    public void testTrainLookupAndOrderedRoute() {
        System.out.println("\n=== VALIDATING TRAIN LOOKUP & ORDERED ROUTE ===");
        JdbcTrainRepository trainRepo = new JdbcTrainRepository(dbManager);
        JdbcRouteRepository routeRepo = new JdbcRouteRepository(dbManager);

        // 1. Train Lookup: 12622 (Tamil Nadu Express)
        Optional<Train> trainOpt = trainRepo.findByTrainNumber("12622");
        assertTrue(trainOpt.isPresent(), "Train 12622 should exist in database");
        Train train = trainOpt.get();
        System.out.printf("  Found Train: %s (%s), Type: %s, Route: %s -> %s%n",
                train.getName(), train.getTrainNumber(), train.getType(),
                train.getSourceStation(), train.getDestinationStation());

        // 2. Train Ordered Stops Sequence Verification
        List<TrainStop> stops = routeRepo.getStopsByTrainNumber("12622");
        assertFalse(stops.isEmpty(), "Train 12622 must have ordered stops");
        System.out.printf("  Train 12622 has %d stops. First 3 and last 2 stops:%n", stops.size());

        for (int i = 0; i < Math.min(3, stops.size()); i++) {
            TrainStop ts = stops.get(i);
            System.out.printf("    Seq %2d: %-6s (%s) Arr: %-5s Dep: %-5s Dist: %6.1f km Halt: %s%n",
                    ts.getSequence(), ts.getStationCode(), ts.getStationName(),
                    ts.getArrivalTime(), ts.getDepartureTime(), ts.getDistanceKm(), ts.getHalt());
        }
        System.out.println("    ...");
        for (int i = Math.max(0, stops.size() - 2); i < stops.size(); i++) {
            TrainStop ts = stops.get(i);
            System.out.printf("    Seq %2d: %-6s (%s) Arr: %-5s Dep: %-5s Dist: %6.1f km Halt: %s%n",
                    ts.getSequence(), ts.getStationCode(), ts.getStationName(),
                    ts.getArrivalTime(), ts.getDepartureTime(), ts.getDistanceKm(), ts.getHalt());
        }

        // Verify sequence is strictly increasing (no alphabetical sorting!)
        for (int i = 0; i < stops.size() - 1; i++) {
            assertTrue(stops.get(i).getSequence() < stops.get(i + 1).getSequence(),
                    "Stops sequence must be strictly ascending");
        }

        // 3. Unknown Train Negative Test
        Optional<Train> unknownTrain = trainRepo.findByTrainNumber("00000");
        assertTrue(unknownTrain.isEmpty(), "Non-existent train 00000 must return empty");
        System.out.println("  ✓ Negative test: Non-existent train '00000' correctly returned Optional.empty()");
    }

    @Test
    @Order(5)
    public void testDirectTrainSearch() {
        System.out.println("\n=== VALIDATING DIRECT TRAIN SEARCH (SQL SEQUENCE ENFORCEMENT) ===");
        JdbcRouteRepository routeRepo = new JdbcRouteRepository(dbManager);

        // 1. NDLS -> MAS
        List<Map<String, Object>> directTrains = routeRepo.findDirectTrains("NDLS", "MAS");
        System.out.printf("  Direct trains for NDLS -> MAS: %d found%n", directTrains.size());
        assertFalse(directTrains.isEmpty(), "Should find direct trains between NDLS and MAS");

        for (Map<String, Object> t : directTrains) {
            int seq1 = (int) t.get("fromSequence");
            int seq2 = (int) t.get("toSequence");
            assertTrue(seq1 < seq2, "From sequence MUST be less than to sequence!");
            System.out.printf("    -> Train %s (%s): Seq %d -> Seq %d, Dep: %s, Arr: %s, Dist: %s km%n",
                    t.get("trainNumber"), t.get("trainName"), seq1, seq2,
                    t.get("departureTime"), t.get("arrivalTime"), t.get("distanceKm"));
        }

        // 2. MAS -> SBC (Chennai to Bangalore)
        List<Map<String, Object>> masSbc = routeRepo.findDirectTrains("MAS", "SBC");
        System.out.printf("  Direct trains for MAS -> SBC: %d found%n", masSbc.size());
        assertFalse(masSbc.isEmpty(), "Should find direct trains between MAS and SBC");

        // 3. Reverse MAS -> NDLS
        List<Map<String, Object>> masNdls = routeRepo.findDirectTrains("MAS", "NDLS");
        System.out.printf("  Direct trains for MAS -> NDLS: %d found%n", masNdls.size());
        assertFalse(masNdls.isEmpty(), "Should find direct trains between MAS and NDLS");
    }

    @Test
    @Order(6)
    public void testConnectedStationsAndGraphEdges() {
        System.out.println("\n=== VALIDATING GRAPH TOPOLOGY & CONNECTED STATIONS ===");
        JdbcGraphRepository graphRepo = new JdbcGraphRepository(dbManager);

        // Connected stations from NDLS
        List<String> connectedToNdls = graphRepo.getConnectedStations("NDLS");
        System.out.printf("  Distinct stations directly connected to NDLS: %d%n", connectedToNdls.size());
        assertFalse(connectedToNdls.isEmpty(), "NDLS should have connected stations");
        System.out.println("  First 10 connected stations: " + connectedToNdls.subList(0, Math.min(10, connectedToNdls.size())));

        // Outgoing edges with multi-train preservation
        List<GraphEdge> edges = graphRepo.getOutgoingEdges("NDLS");
        assertFalse(edges.isEmpty(), "NDLS should have outgoing graph edges");
        System.out.printf("  Outgoing corridor edges from NDLS: %d distinct destination hubs%n", edges.size());
        for (int i = 0; i < Math.min(3, edges.size()); i++) {
            GraphEdge edge = edges.get(i);
            System.out.printf("    Edge NDLS -> %s: Dist: %.1f km, Trains operating: %d%n",
                    edge.getToStationCode(), edge.getDistanceKm(), edge.getTrains().size());
        }
    }

    @Test
    @Order(7)
    public void testTransferRouteSearch() {
        System.out.println("\n=== VALIDATING TRANSFER ROUTE SEARCH ===");
        JdbcGraphRepository graphRepo = new JdbcGraphRepository(dbManager);

        // Route search with transfers
        List<Map<String, Object>> routes = graphRepo.findRoutes("NDLS", "MAS", 1);
        assertFalse(routes.isEmpty(), "Route search should find routes between NDLS and MAS");
        System.out.printf("  Routes found between NDLS and MAS: %d%n", routes.size());
        for (int i = 0; i < Math.min(3, routes.size()); i++) {
            Map<String, Object> r = routes.get(i);
            System.out.printf("    Option %d: Type=%s, Transfers=%s%n",
                    i + 1, r.get("type"), r.get("transfers"));
        }
    }
}
