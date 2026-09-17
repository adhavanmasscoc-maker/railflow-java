package com.railflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request payload for updating a platform's passenger crowd count.
 */
public class CrowdUpdateRequest {

    @NotNull(message = "Crowd count is required")
    @Min(value = 0, message = "Crowd count cannot be negative")
    private Integer crowd;

    public CrowdUpdateRequest() {}

    public CrowdUpdateRequest(Integer crowd) {
        this.crowd = crowd;
    }

    public Integer getCrowd() {
        return crowd;
    }

    public void setCrowd(Integer crowd) {
        this.crowd = crowd;
    }
}
