package com.railflow.exception;

/**
 * Thrown when a provided PNR number does not conform to the 10-digit Indian Railways standard.
 */
public class InvalidPnrException extends RuntimeException {
    public InvalidPnrException(String pnr) {
        super("Invalid PNR number: '" + pnr + "'. A valid Indian Railways PNR must contain exactly 10 numeric digits.");
    }
}
