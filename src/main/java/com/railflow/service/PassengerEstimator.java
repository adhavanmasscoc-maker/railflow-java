package com.railflow.service;

/**
 * PassengerEstimator — Zero-Resource Live Passenger Estimation.
 * Calculates expected station platform crowd influx and deboarding surge using deterministic
 * Indian Railways ICF / LHB coach capacity mathematical heuristics instead of heavy ML models.
 */
public class PassengerEstimator {

    // Standard Indian Railways ICF / LHB Coach Capacity Constants
    public static final int SEATS_PER_SLEEPER = 72;
    public static final int SEATS_PER_AC3TIER = 64;
    public static final int SEATS_PER_AC2TIER = 48;
    public static final int SEATS_PER_AC1ST = 24;
    public static final int SEATS_PER_GENERAL = 100;
    public static final int SEATS_PER_CHAIR_CAR = 78;

    /**
     * Calculates expected deboarding crowd surge without external passenger manifests.
     *
     * @param coaches Array of coach codes (e.g., ["ENG", "GS", "S1", "S2", "B1", "A1", "GS"])
     * @param stationFactor Typical deboarding ratio for the hub (e.g., 0.30 for 30% surge)
     * @return Estimated headcount of passengers arriving on platform
     */
    public static int estimateArrivingCrowd(String[] coaches, double stationFactor) {
        if (coaches == null || coaches.length == 0) {
            return 0;
        }

        int totalCapacity = 0;
        for (String coach : coaches) {
            if (coach == null) continue;
            String normalized = coach.trim().toUpperCase();

            if (normalized.startsWith("GS") || normalized.startsWith("GEN") || normalized.startsWith("UR")) {
                totalCapacity += SEATS_PER_GENERAL;
            } else if (normalized.startsWith("S")) {
                totalCapacity += SEATS_PER_SLEEPER;
            } else if (normalized.startsWith("B") || normalized.startsWith("M")) {
                totalCapacity += SEATS_PER_AC3TIER;
            } else if (normalized.startsWith("A")) {
                totalCapacity += SEATS_PER_AC2TIER;
            } else if (normalized.startsWith("H")) {
                totalCapacity += SEATS_PER_AC1ST;
            } else if (normalized.startsWith("C") || normalized.startsWith("D")) {
                totalCapacity += SEATS_PER_CHAIR_CAR;
            } else if (!normalized.startsWith("ENG") && !normalized.startsWith("SLR") && !normalized.startsWith("EOG")) {
                // Default passenger coach fallback
                totalCapacity += SEATS_PER_SLEEPER;
            }
        }

        // Apply station specific deboarding ratio with bounds checking
        double factor = Math.max(0.05, Math.min(1.0, stationFactor));
        return (int) Math.round(totalCapacity * factor);
    }

    /**
     * Calculates coach-wise crowd occupancy status.
     * Returns "LOW" (<50%), "MODERATE" (50-80%), or "HIGH" (>80%).
     */
    public static String getCoachDensityTier(int passengerCount, int coachCapacity) {
        if (coachCapacity <= 0) return "LOW";
        double ratio = (double) passengerCount / coachCapacity;
        if (ratio < 0.50) return "LOW";
        if (ratio <= 0.80) return "MODERATE";
        return "HIGH";
    }
}
