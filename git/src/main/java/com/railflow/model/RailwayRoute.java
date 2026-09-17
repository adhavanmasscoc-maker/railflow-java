package com.railflow.model;

import com.railflow.enums.DataSourceType;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Encapsulates an Indian Railways physical route connecting stations.
 * Represents vertices and edges in the railway network graph.
 */
public class RailwayRoute {

    private final String routeId;
    private final String originStation;
    private final String destinationStation;
    private final double totalDistanceKm;
    private final List<String> intermediateStations;
    private final DataSourceType dataSource;

    public RailwayRoute(String routeId, String originStation, String destinationStation, double totalDistanceKm) {
        this(routeId, originStation, destinationStation, totalDistanceKm, new ArrayList<>(), DataSourceType.REAL);
    }

    public RailwayRoute(String routeId, String originStation, String destinationStation, 
                        double totalDistanceKm, List<String> intermediateStations, DataSourceType dataSource) {
        this.routeId = Objects.requireNonNull(routeId, "routeId cannot be null");
        this.originStation = Objects.requireNonNull(originStation, "originStation cannot be null");
        this.destinationStation = Objects.requireNonNull(destinationStation, "destinationStation cannot be null");
        this.totalDistanceKm = totalDistanceKm >= 0 ? totalDistanceKm : 0.0;
        this.intermediateStations = intermediateStations != null ? new ArrayList<>(intermediateStations) : new ArrayList<>();
        this.dataSource = dataSource != null ? dataSource : DataSourceType.REAL;
    }

    public String getRouteId() {
        return routeId;
    }

    public String getOriginStation() {
        return originStation;
    }

    public String getDestinationStation() {
        return destinationStation;
    }

    public double getTotalDistanceKm() {
        return totalDistanceKm;
    }

    public List<String> getIntermediateStations() {
        return Collections.unmodifiableList(intermediateStations);
    }

    public DataSourceType getDataSource() {
        return dataSource;
    }

    public String getFormattedRoute() {
        return originStation + " ➔ " + destinationStation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RailwayRoute)) return false;
        RailwayRoute that = (RailwayRoute) o;
        return Objects.equals(routeId, that.routeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(routeId);
    }

    @Override
    public String toString() {
        return "RailwayRoute{" +
                "routeId='" + routeId + '\'' +
                ", route='" + getFormattedRoute() + '\'' +
                ", totalDistanceKm=" + totalDistanceKm +
                ", source=" + dataSource +
                '}';
    }
}
