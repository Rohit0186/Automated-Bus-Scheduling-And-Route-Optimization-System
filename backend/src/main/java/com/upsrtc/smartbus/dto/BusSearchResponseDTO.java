package com.upsrtc.smartbus.dto;

import java.time.LocalTime;

public class BusSearchResponseDTO {
    private Integer tripId; // Maps to Schedule.id
    private Integer busId;
    private String busNumber;
    private String busType;
    private LocalTime arrivalAtSource;
    private LocalTime departureFromSource;
    private LocalTime arrivalTimeAtDest;
    private Integer availableSeats;
    private Double fare;

    // Getters and Setters
    public Integer getTripId() { return tripId; }
    public void setTripId(Integer tripId) { this.tripId = tripId; }
    public Integer getBusId() { return busId; }
    public void setBusId(Integer busId) { this.busId = busId; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }
    public LocalTime getArrivalAtSource() { return arrivalAtSource; }
    public void setArrivalAtSource(LocalTime arrivalAtSource) { this.arrivalAtSource = arrivalAtSource; }
    public LocalTime getDepartureFromSource() { return departureFromSource; }
    public void setDepartureFromSource(LocalTime departureFromSource) { this.departureFromSource = departureFromSource; }
    public LocalTime getArrivalTimeAtDest() { return arrivalTimeAtDest; }
    public void setArrivalTimeAtDest(LocalTime arrivalTimeAtDest) { this.arrivalTimeAtDest = arrivalTimeAtDest; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public Double getFare() { return fare; }
    public void setFare(Double fare) { this.fare = fare; }
}
