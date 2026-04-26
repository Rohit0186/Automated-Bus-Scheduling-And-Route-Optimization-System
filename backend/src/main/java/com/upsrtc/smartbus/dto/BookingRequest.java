package com.upsrtc.smartbus.dto;


import java.time.LocalDate;
import java.util.List;


public class BookingRequest {
    private Integer busId;
    private Integer scheduleId;
    private List<String> seatNumbers;
    private Double totalAmount;
    private String sourceStop;
    private String destinationStop;
    private LocalDate travelDate;

    // Manual Getters/Setters
    public Integer getBusId() { return busId; }
    public void setBusId(Integer busId) { this.busId = busId; }
    public Integer getScheduleId() { return scheduleId; }
    public void setScheduleId(Integer scheduleId) { this.scheduleId = scheduleId; }
    public List<String> getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(List<String> seatNumbers) { this.seatNumbers = seatNumbers; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public String getSourceStop() { return sourceStop; }
    public void setSourceStop(String sourceStop) { this.sourceStop = sourceStop; }
    public String getDestinationStop() { return destinationStop; }
    public void setDestinationStop(String destinationStop) { this.destinationStop = destinationStop; }
    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }
}

