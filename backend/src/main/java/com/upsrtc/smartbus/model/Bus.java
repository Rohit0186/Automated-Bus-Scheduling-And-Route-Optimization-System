package com.upsrtc.smartbus.model;

import jakarta.persistence.*;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "buses")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String busNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "route_id")
    private Route route;

    private LocalTime departureTime;
    private LocalTime arrivalTime;

    private String busName;

    @Enumerated(EnumType.STRING)
    private BusType busType;

    public enum BusType {
        AC, NON_AC, SLEEPER, SEATER
    }

    public enum Status {
        ACTIVE, MAINTENANCE, INACTIVE
    }

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    private Integer totalSeats;
    private Integer availableSeats;
    private Boolean isMultiDeck = false;
    private Boolean isActive = true;
    private LocalTime startTime;

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }
    public BusType getBusType() { return busType; }
    public void setBusType(BusType busType) { this.busType = busType; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public Boolean getIsMultiDeck() { return isMultiDeck; }
    public void setIsMultiDeck(Boolean isMultiDeck) { this.isMultiDeck = isMultiDeck; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
}

