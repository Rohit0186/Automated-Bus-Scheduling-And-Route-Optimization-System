package com.upsrtc.smartbus.model;

import jakarta.persistence.*;



@Entity
@Table(name = "depots")
public class Depot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String location;
    private Integer capacity;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public User getManager() { return manager; }
    public void setManager(User manager) { this.manager = manager; }
}

