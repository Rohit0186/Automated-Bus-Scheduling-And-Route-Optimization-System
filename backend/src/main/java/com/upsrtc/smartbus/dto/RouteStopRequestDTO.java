package com.upsrtc.smartbus.dto;

public class RouteStopRequestDTO {
    private String stopName;
    private Integer stopOrder;
    private Integer durationFromStart; // minutes
    private Double distanceFromStart; // km
    private Double latitude;
    private Double longitude;

    // Getters and Setters
    public String getStopName() { return stopName; }
    public void setStopName(String stopName) { this.stopName = stopName; }
    public Integer getStopOrder() { return stopOrder; }
    public void setStopOrder(Integer stopOrder) { this.stopOrder = stopOrder; }
    public Integer getDurationFromStart() { return durationFromStart; }
    public void setDurationFromStart(Integer durationFromStart) { this.durationFromStart = durationFromStart; }
    public Double getDistanceFromStart() { return distanceFromStart; }
    public void setDistanceFromStart(Double distanceFromStart) { this.distanceFromStart = distanceFromStart; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
