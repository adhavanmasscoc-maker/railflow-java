package com.railflow.ingestion;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * PDF Structured Data Extractor:
 * Mines structured tabular records from Indian Railways reference PDFs:
 * 1. List_of_Special_Trains_by_Indian_Railways.pdf -> special_trains table
 * 2. station_name.pdf -> stations metadata & station_aliases table
 */
public class PdfExtractor {

    private static final Logger log = LoggerFactory.getLogger(PdfExtractor.class);

    // Matches lines like: 1 01015 LTT GKP SPL Lokmanyatilak (T) 22:45 1 Gorakhpur 07:05 3 Daily All Days
    private static final Pattern SPECIAL_TRAIN_PATTERN = Pattern.compile(
        "^\\s*(\\d+)\\s+(\\d{5})\\s+(.+?)\\s+([A-Za-z\\s()./-]+?)\\s+(\\d{2}:\\d{2})\\s+(\\d+)\\s+([A-Za-z\\s()./-]+?)\\s+(\\d{2}:\\d{2})\\s+(\\d+)\\s+(Daily|Bi-Weekly|Tri-Weekly|Weekly|Spl|[A-Za-z-]+)(?:\\s+([A-Z]{2,4}))?\\s+(.+)$"
    );

    // Matches station_name.pdf line: S.No StationName Code OldCat NewCat Div Zone District State
    // e.g.: 1 BHORAS BUDRUKH BFJ F HG2 BSL CR JALGAON MAHARASHTRA
    private static final Pattern STATION_ROW_PATTERN = Pattern.compile(
        "^\\s*\\d+\\s+(.+?)\\s+([A-Z0-9]{2,6})\\s+([A-Z0-9]+)\\s+([A-Z0-9]+)\\s+([A-Z]{2,5})\\s+([A-Z]{2,5})\\s+(.+?)\\s+([A-Z\\s]+)$"
    );

    public static class SpecialTrainRecord {
        public String trainNumber;
        public String trainName;
        public String fromStation;
        public String departureTime;
        public String toStation;
        public String arrivalTime;
        public String frequency;
        public String owningRailway;
        public String daysOfOperation;
        public String rawText;
    }

    public static class StationPdfMetadata {
        public String stationName;
        public String stationCode;
        public String category;
        public String division;
        public String zone;
        public String district;
        public String state;
    }

    public List<SpecialTrainRecord> extractSpecialTrains(File pdfFile) {
        List<SpecialTrainRecord> list = new ArrayList<>();
        if (!pdfFile.exists()) return list;

        try (PDDocument doc = PDDocument.load(pdfFile)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);
            String[] lines = text.split("\\r?\\n");

            for (String line : lines) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("S.NO") || line.startsWith("Train No")) continue;

                Matcher m = SPECIAL_TRAIN_PATTERN.matcher(line);
                if (m.find()) {
                    SpecialTrainRecord r = new SpecialTrainRecord();
                    r.trainNumber = m.group(2).trim();
                    r.trainName = m.group(3).trim();
                    r.fromStation = m.group(4).trim();
                    r.departureTime = m.group(5).trim();
                    r.toStation = m.group(7).trim();
                    r.arrivalTime = m.group(8).trim();
                    r.frequency = m.group(10).trim();
                    r.owningRailway = m.group(11) != null ? m.group(11).trim() : "IR";
                    r.daysOfOperation = m.group(12).trim();
                    r.rawText = line;
                    list.add(r);
                } else {
                    // Fallback pattern if line starts with 5-digit number
                    Pattern simplePattern = Pattern.compile("^\\s*\\d+\\s+(\\d{5})\\s+(.+)$");
                    Matcher sm = simplePattern.matcher(line);
                    if (sm.find()) {
                        SpecialTrainRecord r = new SpecialTrainRecord();
                        r.trainNumber = sm.group(1);
                        r.trainName = sm.group(2);
                        r.rawText = line;
                        r.frequency = "Special";
                        list.add(r);
                    }
                }
            }
            log.info("Extracted {} special train records from {}", list.size(), pdfFile.getName());
        } catch (IOException e) {
            log.error("Failed to extract special trains from {}: {}", pdfFile.getName(), e.getMessage());
        }
        return list;
    }

    public List<StationPdfMetadata> extractStationMetadata(File pdfFile, int maxPages) {
        List<StationPdfMetadata> list = new ArrayList<>();
        if (!pdfFile.exists()) return list;

        try (PDDocument doc = PDDocument.load(pdfFile)) {
            PDFTextStripper stripper = new PDFTextStripper();
            int totalPages = doc.getNumberOfPages();
            stripper.setStartPage(1);
            stripper.setEndPage(maxPages > 0 ? Math.min(maxPages, totalPages) : totalPages);

            String text = stripper.getText(doc);
            String[] lines = text.split("\\r?\\n");

            for (String line : lines) {
                line = line.trim();
                Matcher m = STATION_ROW_PATTERN.matcher(line);
                if (m.find()) {
                    StationPdfMetadata meta = new StationPdfMetadata();
                    meta.stationName = m.group(1).trim();
                    meta.stationCode = m.group(2).trim();
                    meta.category = m.group(4).trim();
                    meta.division = m.group(5).trim();
                    meta.zone = m.group(6).trim();
                    meta.district = m.group(7).trim();
                    meta.state = m.group(8).trim();
                    list.add(meta);
                }
            }
            log.info("Extracted {} station metadata rows from {} (pages 1 to {})",
                    list.size(), pdfFile.getName(), stripper.getEndPage());
        } catch (IOException e) {
            log.error("Failed to extract station metadata from {}: {}", pdfFile.getName(), e.getMessage());
        }
        return list;
    }

    public void insertSpecialTrains(Connection conn, List<SpecialTrainRecord> records, int sourceId, String sourceFile) throws SQLException {
        String sql = """
            INSERT INTO special_trains (
                train_number, train_name, from_station, to_station, departure_time, arrival_time,
                frequency, days_of_operation, owning_railway, source_id, source_file, raw_text
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """;

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            for (SpecialTrainRecord r : records) {
                ps.setString(1, r.trainNumber);
                ps.setString(2, r.trainName != null ? r.trainName : "Special Train");
                ps.setString(3, r.fromStation);
                ps.setString(4, r.toStation);
                ps.setString(5, r.departureTime);
                ps.setString(6, r.arrivalTime);
                ps.setString(7, r.frequency);
                ps.setString(8, r.daysOfOperation);
                ps.setString(9, r.owningRailway);
                ps.setInt(10, sourceId);
                ps.setString(11, sourceFile);
                ps.setString(12, r.rawText);
                ps.addBatch();
            }
            ps.executeBatch();
        }
    }

    public void enrichStationsFromPdf(Connection conn, List<StationPdfMetadata> metadataList, int sourceId, String sourceFile) throws SQLException {
        String updateStnSql = """
            UPDATE stations 
            SET category = COALESCE(?, category),
                division = COALESCE(?, division),
                state = CASE WHEN state IS NULL OR state = '' THEN ? ELSE state END,
                zone = CASE WHEN zone IS NULL OR zone = '' OR zone = 'IR' THEN ? ELSE zone END
            WHERE station_code = ?;
        """;

        String insertAliasSql = """
            INSERT OR IGNORE INTO station_aliases (station_id, station_code, alias, normalized_alias, alias_type, source_id, source_file)
            SELECT id, station_code, ?, ?, 'OFFICIAL_NAME', ?, ?
            FROM stations WHERE station_code = ?;
        """;

        try (PreparedStatement updatePs = conn.prepareStatement(updateStnSql);
             PreparedStatement aliasPs = conn.prepareStatement(insertAliasSql)) {

            for (StationPdfMetadata m : metadataList) {
                updatePs.setString(1, m.category);
                updatePs.setString(2, m.division);
                updatePs.setString(3, m.state);
                updatePs.setString(4, m.zone);
                updatePs.setString(5, m.stationCode);
                updatePs.addBatch();

                if (m.stationName != null && !m.stationName.isEmpty()) {
                    aliasPs.setString(1, m.stationName);
                    aliasPs.setString(2, m.stationName.toUpperCase().replaceAll("[^A-Z0-9 ]", "").trim());
                    aliasPs.setInt(3, sourceId);
                    aliasPs.setString(4, sourceFile);
                    aliasPs.setString(5, m.stationCode);
                    aliasPs.addBatch();
                }
            }
            updatePs.executeBatch();
            aliasPs.executeBatch();
        }
    }
}
