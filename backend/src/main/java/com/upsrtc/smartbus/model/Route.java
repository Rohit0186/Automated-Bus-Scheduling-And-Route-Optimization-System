package com.upsrtc.smartbus.model;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "routes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String routeName;
    private String source;
    private String destination;
    private Double totalDistance;
    private Double farePerKm;
    private Boolean isActive = true;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<RouteStop> stops = new java.util.ArrayList<>();

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public Double getTotalDistance() { return totalDistance; }
    public void setTotalDistance(Double totalDistance) { this.totalDistance = totalDistance; }
    public Double getFarePerKm() { return farePerKm; }
    public void setFarePerKm(Double farePerKm) { this.farePerKm = farePerKm; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public java.util.List<RouteStop> getStops() { return stops; }
    public void setStops(java.util.List<RouteStop> stops) { this.stops = stops; }
}

