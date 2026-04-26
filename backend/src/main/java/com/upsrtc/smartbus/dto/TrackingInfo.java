package com.upsrtc.smartbus.dto;








public class TrackingInfo {
    private String stopName;
    private Double currentLat;
    private Double currentLng;
    private String eta;
    private Double distanceKm;
    private String status;

    // Manual Getters/Setters
    public String getStopName() { return stopName; }
    public void setStopName(String stopName) { this.stopName = stopName; }
    public Double getCurrentLat() { return currentLat; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }
    public Double getCurrentLng() { return currentLng; }
    public void setCurrentLng(Double currentLng) { this.currentLng = currentLng; }
    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Manual Constructors
    public TrackingInfo() {}
    public TrackingInfo(String stopName, Double currentLat, Double currentLng, String eta, Double distanceKm, String status) {
        this.stopName = stopName;
        this.currentLat = currentLat;
        this.currentLng = currentLng;
        this.eta = eta;
        this.distanceKm = distanceKm;
        this.status = status;
    }
}

