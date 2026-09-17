package com.railflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request payload for setting train delay minutes.
 */
public class DelayUpdateRequest {

    @NotNull(message = "Delay minutes is required")
    @Min(value = 0, message = "Delay cannot be negative")
    private Integer delayMinutes;

    public DelayUpdateRequest() {}

    public DelayUpdateRequest(Integer delayMinutes) {
        this.delayMinutes = delayMinutes;
    }

    public Integer getDelayMinutes() {
        return delayMinutes;
    }

    public void setDelayMinutes(Integer delayMinutes) {
        this.delayMinutes = delayMinutes;
    }
}
