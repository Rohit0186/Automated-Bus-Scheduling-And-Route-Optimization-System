package com.upsrtc.smartbus.dto;

public class FareCalculationResponseDTO {
    private Double distance; // km
    private Double fare;     // currency

    public FareCalculationResponseDTO(Double distance, Double fare) {
        this.distance = distance;
        this.fare = fare;
    }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
    public Double getFare() { return fare; }
    public void setFare(Double fare) { this.fare = fare; }
}
