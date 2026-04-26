package com.upsrtc.smartbus.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    public enum Status { PENDING, CONFIRMED, CANCELLED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id")
    private BusSchedule busSchedule;

    @Column(name = "seat_numbers")
    private String seatNumbers;

    @Column(name = "source_stop")
    private String sourceStop;

    @Column(name = "destination_stop")
    private String destinationStop;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private LocalDateTime bookingTime = LocalDateTime.now();
    private LocalDate travelDate;

    // Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }
    public String getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(String seatNumbers) { this.seatNumbers = seatNumbers; }
    public String getSourceStop() { return sourceStop; }
    public void setSourceStop(String sourceStop) { this.sourceStop = sourceStop; }
    public String getDestinationStop() { return destinationStop; }
    public void setDestinationStop(String destinationStop) { this.destinationStop = destinationStop; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }
    public BusSchedule getBusSchedule() { return busSchedule; }
    public void setBusSchedule(BusSchedule busSchedule) { this.busSchedule = busSchedule; }
    public LocalDateTime getBookingDate() { return bookingTime; }
}

