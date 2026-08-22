package com.railflow.io;

import com.railflow.model.Train;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Dedicated parser applying Java Regular Expressions (Regex) to extract structured train and station records.
 */
@Component
public class RailwayDataParser {

    // Regex for 5-digit Indian Railways train number followed by name: e.g. "12301 RAJDHANI EXP"
    private static final Pattern TRAIN_PATTERN = Pattern.compile("^(\\d{5})\\s+([A-Za-z0-9\\s\\-\\./]+)$");

    // Regex for station with code in parentheses or suffix: e.g. "NEW DELHI (NDLS)"
    private static final Pattern STATION_PATTERN = Pattern.compile("^(.*?)(?:\\s*\\(([A-Z0-9]{2,6})\\))?$");

    /**
     * Parses raw line items into Train domain objects using Regex Pattern and Matcher.
     */
    public List<Train> parseTrainsFromTextLines(List<String> lines, String defaultType) {
        if (lines == null || lines.isEmpty()) return Collections.emptyList();

        List<Train> trains = new ArrayList<>();
        int idCounter = 1000;

        for (String line : lines) {
            Matcher matcher = TRAIN_PATTERN.matcher(line.trim());
            if (matcher.find()) {
                String trainNumber = matcher.group(1).trim();
                String rawName = matcher.group(2).trim();

                Train train = new Train(
                        "TRN-PDF-" + (idCounter++),
                        trainNumber,
                        rawName,
                        "Route-" + trainNumber,
                        "Origin",
                        "Destination",
                        defaultType != null ? defaultType : "EXPRESS",
                        1000,
                        20
                );
                trains.add(train);
            }
        }
        return trains;
    }

    /**
     * Extracts station names from raw text lines.
     */
    public List<String> parseStationNames(List<String> lines) {
        if (lines == null) return Collections.emptyList();
        List<String> stations = new ArrayList<>();

        for (String line : lines) {
            Matcher matcher = STATION_PATTERN.matcher(line.trim());
            if (matcher.find()) {
                String name = matcher.group(1).trim();
                if (!name.isEmpty() && name.length() > 2) {
                    stations.add(name);
                }
            }
        }
        return stations;
    }
}
