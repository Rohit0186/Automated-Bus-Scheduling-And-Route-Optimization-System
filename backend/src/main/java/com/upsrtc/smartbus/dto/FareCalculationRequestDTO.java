package com.upsrtc.smartbus.dto;

public class FareCalculationRequestDTO {
    private Integer routeId;
    private Integer sourceStopId;
    private Integer destinationStopId;

    public Integer getRouteId() { return routeId; }
    public void setRouteId(Integer routeId) { this.routeId = routeId; }
    public Integer getSourceStopId() { return sourceStopId; }
    public void setSourceStopId(Integer sourceStopId) { this.sourceStopId = sourceStopId; }
    public Integer getDestinationStopId() { return destinationStopId; }
    public void setDestinationStopId(Integer destinationStopId) { this.destinationStopId = destinationStopId; }
}
