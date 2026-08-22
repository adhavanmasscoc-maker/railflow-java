package com.railflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.asynchttpclient.AsyncHttpClient;
import org.asynchttpclient.DefaultAsyncHttpClient;
import org.asynchttpclient.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Service managing asynchronous HTTP calls to external IRCTC live endpoints using AsyncHttpClient and CompletableFuture.
 */
@Service
public class IrctcApiService {

    private static final Logger logger = Logger.getLogger(IrctcApiService.class.getName());

    @Value("${rapidapi.key:mock_key}")
    private String rapidApiKey;

    @Value("${rapidapi.host:irctc1.p.rapidapi.com}")
    private String rapidApiHost;

    private AsyncHttpClient client;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        this.client = new DefaultAsyncHttpClient();
        logger.info("Initialized AsyncHttpClient for IRCTC Live Integration");
    }

    @PreDestroy
    public void cleanup() {
        if (this.client != null) {
            try {
                this.client.close();
            } catch (IOException e) {
                logger.log(Level.SEVERE, "Failed to close AsyncHttpClient", e);
            }
        }
    }

    public JsonNode getTrainsByStation(String stationCode) {
        String url = "https://" + rapidApiHost + "/api/v3/getTrainsByStation?stationCode=" + stationCode;
        return executeRequest(url);
    }

    public JsonNode searchStation(String query) {
        String url = "https://" + rapidApiHost + "/api/v1/searchStation?query=" + query;
        return executeRequest(url);
    }

    public JsonNode trainBetweenStations(String fromStation, String toStation) {
        String url = "https://" + rapidApiHost + "/api/v3/trainBetweenStations?fromStationCode=" + fromStation + "&toStationCode=" + toStation;
        return executeRequest(url);
    }

    private JsonNode executeRequest(String url) {
        try {
            Response response = client.prepare("GET", url)
                    .setHeader("x-rapidapi-key", rapidApiKey)
                    .setHeader("x-rapidapi-host", rapidApiHost)
                    .setHeader("Content-Type", "application/json")
                    .execute()
                    .toCompletableFuture()
                    .join();

            if (response.getStatusCode() == 200) {
                return objectMapper.readTree(response.getResponseBody());
            }
        } catch (Exception e) {
            logger.fine("External IRCTC live API unreachable or mock mode active: " + e.getMessage());
        }
        return objectMapper.createObjectNode();
    }
}
