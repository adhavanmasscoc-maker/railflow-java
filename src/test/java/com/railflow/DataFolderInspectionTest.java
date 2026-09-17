package com.railflow;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public class DataFolderInspectionTest {

    @Test
    public void inspectRailwayDb() throws Exception {
        File dbFile = new File("DATA/railway.db");
        System.out.println("=== INSPECTING DATA/railway.db ===");
        System.out.println("File exists: " + dbFile.exists() + ", Size: " + dbFile.length() + " bytes");
        if (dbFile.exists() && dbFile.length() > 0) {
            String url = "jdbc:sqlite:DATA/railway.db";
            try (Connection conn = DriverManager.getConnection(url);
                 Statement stmt = conn.createStatement()) {
                ResultSet rs = stmt.executeQuery("SELECT name, sql FROM sqlite_master WHERE type='table'");
                while (rs.next()) {
                    String tableName = rs.getString("name");
                    String sql = rs.getString("sql");
                    System.out.println("\nTable: " + tableName);
                    System.out.println("Schema: " + sql);
                }
                
                // Print row counts
                ResultSet rs2 = stmt.executeQuery("SELECT name FROM sqlite_master WHERE type='table'");
                while (rs2.next()) {
                    String tName = rs2.getString("name");
                    try (Statement stmtCount = conn.createStatement();
                         ResultSet countRs = stmtCount.executeQuery("SELECT COUNT(*) FROM \"" + tName + "\"")) {
                        if (countRs.next()) {
                            System.out.println("Count for " + tName + ": " + countRs.getInt(1));
                        }
                    } catch (Exception e) {
                        System.out.println("Could not count " + tName + ": " + e.getMessage());
                    }
                }

                // Sample 2 rows from each table
                ResultSet rs3 = stmt.executeQuery("SELECT name FROM sqlite_master WHERE type='table'");
                while (rs3.next()) {
                    String tName = rs3.getString("name");
                    System.out.println("\nSample rows from: " + tName);
                    try (Statement stmtSample = conn.createStatement();
                         ResultSet sampleRs = stmtSample.executeQuery("SELECT * FROM \"" + tName + "\" LIMIT 2")) {
                        int cols = sampleRs.getMetaData().getColumnCount();
                        while (sampleRs.next()) {
                            StringBuilder sb = new StringBuilder("  ROW: ");
                            for (int i = 1; i <= cols; i++) {
                                sb.append(sampleRs.getMetaData().getColumnName(i)).append("=").append(sampleRs.getString(i)).append("; ");
                            }
                            System.out.println(sb.toString());
                        }
                    } catch (Exception e) {
                        System.out.println("Could not sample " + tName + ": " + e.getMessage());
                    }
                }
            }
        }
    }

    @Test
    public void inspectPdfs() throws Exception {
        System.out.println("\n=== INSPECTING PDF FILES IN DATA/ ===");
        
        // 1. List_of_Special_Trains_by_Indian_Railways.pdf
        File f1 = new File("DATA/List_of_Special_Trains_by_Indian_Railways.pdf");
        System.out.println("\n--- " + f1.getName() + " ---");
        try (PDDocument doc = PDDocument.load(f1)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);
            String[] lines = text.split("\r?\n");
            System.out.println("Total lines: " + lines.length);
            for (int i = 0; i < Math.min(20, lines.length); i++) {
                System.out.println("  L" + (i + 1) + ": " + lines[i]);
            }
        }

        // 2. Train_No-Index.pdf
        File f2 = new File("DATA/Train_No-Index.pdf");
        System.out.println("\n--- " + f2.getName() + " ---");
        try (PDDocument doc = PDDocument.load(f2)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);
            String[] lines = text.split("\r?\n");
            System.out.println("Total lines: " + lines.length);
            for (int i = 0; i < Math.min(25, lines.length); i++) {
                System.out.println("  L" + (i + 1) + ": " + lines[i]);
            }
        }

        // 3. station_name.pdf
        File f3 = new File("DATA/station_name.pdf");
        System.out.println("\n--- " + f3.getName() + " ---");
        try (PDDocument doc = PDDocument.load(f3)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setStartPage(1);
            stripper.setEndPage(2);
            String text = stripper.getText(doc);
            String[] lines = text.split("\r?\n");
            System.out.println("Lines from first 2 pages: " + lines.length);
            for (int i = 0; i < Math.min(20, lines.length); i++) {
                System.out.println("  L" + (i + 1) + ": " + lines[i]);
            }
        }
    }

    @Test
    public void inspectJsonFiles() throws Exception {
        System.out.println("\n=== INSPECTING JSON FILES & ZIP ===");
        File zipFile = new File("DATA/Indian-Railway-Data-main.zip");
        if (zipFile.exists()) {
            try (ZipFile zf = new ZipFile(zipFile)) {
                System.out.println("Entries in " + zipFile.getName() + ":");
                zf.stream().forEach(entry -> {
                    System.out.println("  " + entry.getName() + " (size: " + entry.getSize() + ", compressed: " + entry.getCompressedSize() + ")");
                });
            }
        }

        File sJson = new File("DATA/stations.json");
        File tJson = new File("DATA/trains.json");
        File trJson = new File("DATA/trainroutes.json");

        System.out.println("DATA/stations.json size: " + sJson.length());
        System.out.println("DATA/trains.json size: " + tJson.length());
        System.out.println("DATA/trainroutes.json size: " + trJson.length());
    }
}
