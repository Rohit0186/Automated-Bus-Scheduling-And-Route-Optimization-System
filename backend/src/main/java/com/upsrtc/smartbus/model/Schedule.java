package com.upsrtc.smartbus.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "schedules")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "conductor_id")
    private Conductor conductor;

    private LocalDate departureDate;
    private LocalTime departureTime;
    private LocalTime estimatedArrivalTime;
    private Double price;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ON_TIME;

    public enum Status {
        ON_TIME, DELAYED, CANCELLED
    }

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }
    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }
    public Conductor getConductor() { return conductor; }
    public void setConductor(Conductor conductor) { this.conductor = conductor; }
    public LocalDate getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDate departureDate) { this.departureDate = departureDate; }
    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
    public LocalTime getEstimatedArrivalTime() { return estimatedArrivalTime; }
    public void setEstimatedArrivalTime(LocalTime estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}

