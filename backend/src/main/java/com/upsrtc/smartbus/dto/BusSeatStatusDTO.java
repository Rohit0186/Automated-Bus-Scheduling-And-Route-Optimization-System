package com.upsrtc.smartbus.dto;






public class BusSeatStatusDTO {
    private Integer busId;
    private String busNumber;
    private String busType;
    private long totalSeats;
    private long bookedSeats;
    private long availableSeats;
    private double occupancyPercentage;

    // Manual Getters/Setters
    public Integer getBusId() { return busId; }
    public void setBusId(Integer busId) { this.busId = busId; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }
    public long getTotalSeats() { return totalSeats; }
    public void setTotalSeats(long totalSeats) { this.totalSeats = totalSeats; }
    public long getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(long bookedSeats) { this.bookedSeats = bookedSeats; }
    public long getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(long availableSeats) { this.availableSeats = availableSeats; }
    public double getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

    // Manual Constructors
    public BusSeatStatusDTO() {}
    public BusSeatStatusDTO(Integer busId, String busNumber, String busType, long totalSeats, long bookedSeats, long availableSeats, double occupancyPercentage) {
        this.busId = busId;
        this.busNumber = busNumber;
        this.busType = busType;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.availableSeats = availableSeats;
        this.occupancyPercentage = occupancyPercentage;
    }
}

