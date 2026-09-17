package com.railflow.model;

/**
 * Model representing an intelligent search alias mapping informal/colloquial
 * names to official station codes (e.g., "Trichy" -> "TPJ", "Madurai" -> "MDU").
 */
public class SearchAlias {
    private final String id;
    private final String alias;
    private final String stationCode;
    private final String aliasType; // "CITY", "COLLOQUIAL", "HISTORICAL", "PREFIX"

    public SearchAlias(String id, String alias, String stationCode, String aliasType) {
        this.id = id;
        this.alias = alias;
        this.stationCode = stationCode;
        this.aliasType = aliasType;
    }

    public String getId() { return id; }
    public String getAlias() { return alias; }
    public String getStationCode() { return stationCode; }
    public String getAliasType() { return aliasType; }
}
