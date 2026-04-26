package com.upsrtc.smartbus.model;

import jakarta.persistence.*;



@Entity
@Table(name = "route_stops")
public class RouteStop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Route route;

    private String stopName;
    private Integer stopOrder;

    // Duration in minutes from the start of the route
    private Integer durationFromStart;
    private Double distanceFromStart;

    private String arrivalTime;
    private String departureTime;

    private Double latitude;
    private Double longitude;

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
    public String getStopName() { return stopName; }
    public void setStopName(String stopName) { this.stopName = stopName; }
    public Integer getStopOrder() { return stopOrder; }
    public void setStopOrder(Integer stopOrder) { this.stopOrder = stopOrder; }
    public Integer getDurationFromStart() { return durationFromStart; }
    public void setDurationFromStart(Integer durationFromStart) { this.durationFromStart = durationFromStart; }
    public Double getDistanceFromStart() { return distanceFromStart; }
    public void setDistanceFromStart(Double distanceFromStart) { this.distanceFromStart = distanceFromStart; }
    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}

