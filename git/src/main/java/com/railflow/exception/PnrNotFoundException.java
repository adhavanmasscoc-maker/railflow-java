package com.railflow.exception;

/**
 * Thrown when a PNR record cannot be located in the local SQLite store or live gateway.
 */
public class PnrNotFoundException extends RuntimeException {
    public PnrNotFoundException(String pnr) {
        super("PNR record not found for ticket: " + pnr + ". Please verify the 10-digit number.");
    }
}
