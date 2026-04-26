package com.upsrtc.smartbus.dto;

import java.util.List;

public class RouteRequestDTO {
    private String routeName;
    private String source;
    private String destination;
    private Double totalDistance;
    private Double farePerKm;
    private Boolean isActive = true;
    private List<RouteStopRequestDTO> stops;

    // Getters and Setters
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public Double getTotalDistance() { return totalDistance; }
    public void setTotalDistance(Double totalDistance) { this.totalDistance = totalDistance; }
    public Double getFarePerKm() { return farePerKm; }
    public void setFarePerKm(Double farePerKm) { this.farePerKm = farePerKm; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public List<RouteStopRequestDTO> getStops() { return stops; }
    public void setStops(List<RouteStopRequestDTO> stops) { this.stops = stops; }
}
