package com.upsrtc.smartbus.model;

import jakarta.persistence.*;



@Entity
@Table(name = "stations")
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne
    @JoinColumn(name = "depot_id")
    private Depot depot;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    private StationType type;

    public enum StationType {
        BUS_STATION, BUS_STOP
    }

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public Depot getDepot() { return depot; }
    public void setDepot(Depot depot) { this.depot = depot; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public StationType getType() { return type; }
    public void setType(StationType type) { this.type = type; }
}

