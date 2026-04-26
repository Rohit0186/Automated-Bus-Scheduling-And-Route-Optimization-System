package com.upsrtc.smartbus.model;

import jakarta.persistence.*;



@Entity
@Table(name = "route_polylines")
public class RoutePolyline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer routeId;
    private Integer pointOrder;
    private Double latitude;
    private Double longitude;

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getRouteId() { return routeId; }
    public void setRouteId(Integer routeId) { this.routeId = routeId; }
    public Integer getPointOrder() { return pointOrder; }
    public void setPointOrder(Integer pointOrder) { this.pointOrder = pointOrder; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}

