package com.upsrtc.smartbus.dto;

import java.time.LocalTime;

public class BusTimingResponseDTO {
    private Integer busId;
    private Integer scheduleId;
    private String busNumber;
    private String busName;
    private String busType;
    private Integer availableSeats;
    private LocalTime sourceArrivalTime;
    private LocalTime destinationArrivalTime;

    // Getters and Setters
    public Integer getBusId() { return busId; }
    public void setBusId(Integer busId) { this.busId = busId; }
    public Integer getScheduleId() { return scheduleId; }
    public void setScheduleId(Integer scheduleId) { this.scheduleId = scheduleId; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }
    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public LocalTime getSourceArrivalTime() { return sourceArrivalTime; }
    public void setSourceArrivalTime(LocalTime sourceArrivalTime) { this.sourceArrivalTime = sourceArrivalTime; }
    public LocalTime getDestinationArrivalTime() { return destinationArrivalTime; }
    public void setDestinationArrivalTime(LocalTime destinationArrivalTime) { this.destinationArrivalTime = destinationArrivalTime; }
}
