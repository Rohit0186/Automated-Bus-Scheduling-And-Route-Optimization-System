package com.upsrtc.smartbus.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "bus_locations")
public class BusLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    private Double latitude;
    private Double longitude;
    private Double speed;
    private Integer scheduleId;
    private java.time.LocalDateTime lastUpdated;
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum TripStatus {
        ONGOING, COMPLETED, NOT_STARTED
    }

    @Enumerated(EnumType.STRING)
    private TripStatus tripStatus = TripStatus.NOT_STARTED;

    // Manual Getters/Setters for compatibility
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }
    public Integer getScheduleId() { return scheduleId; }
    public void setScheduleId(Integer scheduleId) { this.scheduleId = scheduleId; }
    public TripStatus getTripStatus() { return tripStatus; }
    public void setTripStatus(TripStatus tripStatus) { this.tripStatus = tripStatus; }
    public java.time.LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(java.time.LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

