package com.railflow.model;

import com.railflow.enums.GateStatus;

import java.util.Objects;

/**
 * Represents a physical station gate controlling passenger entry/exit.
 */
public class Gate {

    private final String id;
    private final String name;
    private GateStatus status;
    private int flowRatePerMinute; // capacity per minute

    public Gate(String id, String name) {
        this(id, name, GateStatus.OPEN, 60);
    }

    public Gate(String id, String name, GateStatus status, int flowRatePerMinute) {
        this.id = Objects.requireNonNull(id, "Gate id must not be null");
        this.name = Objects.requireNonNull(name, "Gate name must not be null");
        this.status = status != null ? status : GateStatus.OPEN;
        this.flowRatePerMinute = Math.max(10, flowRatePerMinute);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public GateStatus getStatus() {
        return status;
    }

    public void setStatus(GateStatus status) {
        this.status = status;
    }

    public boolean isOpen() {
        return status == GateStatus.OPEN || status == GateStatus.INFLOW_ONLY || status == GateStatus.OUTFLOW_ONLY;
    }

    public int getFlowRatePerMinute() {
        return flowRatePerMinute;
    }

    public void setFlowRatePerMinute(int flowRatePerMinute) {
        this.flowRatePerMinute = flowRatePerMinute;
    }

    @Override
    public String toString() {
        return "Gate{" + "id='" + id + '\'' + ", name='" + name + '\'' + ", status=" + status + '}';
    }
}
