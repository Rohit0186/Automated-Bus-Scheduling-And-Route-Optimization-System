package com.upsrtc.smartbus.dto;

import com.upsrtc.smartbus.model.Booking;
import java.util.List;


public class TicketDTO {
    private Integer bookingId;
    private String username;
    private String source;
    private String destination;
    private String departureTime;
    private String busNumber;
    private Double totalAmount;
    private List<String> seatNumbers;
    private String status;
    private String bookingDate;

    public TicketDTO(Booking booking) {
        this.bookingId = booking.getId();
        this.username = booking.getUser().getUsername();
        this.source = booking.getBus().getRoute().getSource();
        this.destination = booking.getBus().getRoute().getDestination();
        this.departureTime = booking.getBus().getStartTime() != null ? booking.getBus().getStartTime().toString() : "08:00:00";
        this.busNumber = booking.getBus().getBusNumber();
        this.totalAmount = booking.getTotalAmount();
        this.status = booking.getStatus().toString();
        this.bookingDate = booking.getBookingDate().toString();
        
        if (booking.getSeatNumbers() != null && !booking.getSeatNumbers().isEmpty()) {
            this.seatNumbers = java.util.Arrays.asList(booking.getSeatNumbers().split(","));
        } else {
            this.seatNumbers = new java.util.ArrayList<>();
        }
    }

    // Manual Getters/Setters
    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public List<String> getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(List<String> seatNumbers) { this.seatNumbers = seatNumbers; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
}

