package com.railflow.util;

import com.railflow.io.CsvReader;
import com.railflow.io.PdfReader;
import com.railflow.io.RailwayDataParser;
import com.railflow.model.Station;
import com.railflow.model.Train;
import com.railflow.repository.StationRepository;
import com.railflow.repository.TrainRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.logging.Logger;

/**
 * Bootstraps and synchronizes CSV, PDF, and Frontend assets on startup.
 */
@Component
public class DataBootstrap {

    private static final Logger logger = Logger.getLogger(DataBootstrap.class.getName());

    private final CsvReader csvReader;
    private final PdfReader pdfReader;
    private final RailwayDataParser parser;
    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;

    @Autowired
    public DataBootstrap(CsvReader csvReader, PdfReader pdfReader, RailwayDataParser parser,
                         StationRepository stationRepository, TrainRepository trainRepository) {
        this.csvReader = csvReader;
        this.pdfReader = pdfReader;
        this.parser = parser;
        this.stationRepository = stationRepository;
        this.trainRepository = trainRepository;
    }

    @PostConstruct
    public void initializeDatasets() {
        logger.info("Starting DataBootstrap railway datasets synchronization...");
        setupDataDirectories();
        syncFrontendAssets();
        loadPdfDataIfAvailable();
        loadCsvStatisticsIfAvailable();
        logger.info("DataBootstrap completed successfully. Stations: " + stationRepository.count() +
                    ", Trains: " + trainRepository.count());
    }

    private void setupDataDirectories() {
        try {
            Files.createDirectories(Paths.get("data/railway"));
            Files.createDirectories(Paths.get("data/stations"));
            Files.createDirectories(Paths.get("data/trains"));
            Files.createDirectories(Paths.get("data/processed"));

            // Check if source files exist in parent workspace and copy over
            copyIfSourceExists(Paths.get("../JAVA/ALL_RAILWAY_DATA.csv"), Paths.get("data/railway/ALL_RAILWAY_DATA.csv"));
            copyIfSourceExists(Paths.get("ALL_RAILWAY_DATA.csv"), Paths.get("data/railway/ALL_RAILWAY_DATA.csv"));

            copyIfSourceExists(Paths.get("../JAVA/RailwaySystem/DATA/station_name.pdf"), Paths.get("data/stations/station_name.pdf"));
            copyIfSourceExists(Paths.get("../JAVA/RailwaySystem/DATA/Train_No-Index.pdf"), Paths.get("data/trains/Train_No-Index.pdf"));
            copyIfSourceExists(Paths.get("../JAVA/RailwaySystem/DATA/List_of_Special_Trains_by_Indian_Railways.pdf"), Paths.get("data/trains/List_of_Special_Trains_by_Indian_Railways.pdf"));
        } catch (IOException e) {
            logger.fine("Directory setup notice: " + e.getMessage());
        }
    }

    private void syncFrontendAssets() {
        try {
            Files.createDirectories(Paths.get("frontend/css"));
            Files.createDirectories(Paths.get("frontend/js"));
            Files.createDirectories(Paths.get("src/main/resources/static/css"));
            Files.createDirectories(Paths.get("src/main/resources/static/js"));

            Path sourceFrontend = Paths.get("../JAVA/RailwaySystem/frontend");
            if (Files.exists(sourceFrontend)) {
                copyIfSourceExists(sourceFrontend.resolve("index.html"), Paths.get("frontend/index.html"));
                copyIfSourceExists(sourceFrontend.resolve("css/styles.css"), Paths.get("frontend/css/styles.css"));
                copyIfSourceExists(sourceFrontend.resolve("js/app.js"), Paths.get("frontend/js/app.js"));

                copyIfSourceExists(sourceFrontend.resolve("index.html"), Paths.get("src/main/resources/static/index.html"));
                copyIfSourceExists(sourceFrontend.resolve("css/styles.css"), Paths.get("src/main/resources/static/css/styles.css"));
                copyIfSourceExists(sourceFrontend.resolve("js/app.js"), Paths.get("src/main/resources/static/js/app.js"));
            }
        } catch (Exception ignored) {}
    }

    private void copyIfSourceExists(Path source, Path target) {
        try {
            if (Files.exists(source) && !Files.exists(target)) {
                Files.createDirectories(target.getParent());
                Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
                logger.info("Copied file: " + source.getFileName() + " -> " + target);
            }
        } catch (Exception ignored) {}
    }

    private void loadPdfDataIfAvailable() {
        Path stationPdf = Paths.get("data/stations/station_name.pdf");
        if (Files.exists(stationPdf)) {
            List<String> lines = pdfReader.extractLines(stationPdf);
            List<String> stationNames = parser.parseStationNames(lines);
            for (String name : stationNames) {
                String code = name.length() >= 3 ? name.substring(0, 3).toUpperCase() : name.toUpperCase();
                stationRepository.save(new Station(code, name, "India", "IR"));
            }
        }

        Path trainPdf = Paths.get("data/trains/Train_No-Index.pdf");
        if (Files.exists(trainPdf)) {
            List<String> lines = pdfReader.extractLines(trainPdf);
            List<Train> trains = parser.parseTrainsFromTextLines(lines, "REGULAR");
            for (Train t : trains) {
                if (!trainRepository.existsById(t.getId())) {
                    trainRepository.save(t);
                }
            }
        }
    }

    private void loadCsvStatisticsIfAvailable() {
        Path csvPath = Paths.get("data/railway/ALL_RAILWAY_DATA.csv");
        if (Files.exists(csvPath)) {
            List<String[]> rows = csvReader.readCsv(csvPath, 50);
            logger.info("Validated ALL_RAILWAY_DATA.csv with " + rows.size() + " sample rows loaded.");
        }
    }
}
