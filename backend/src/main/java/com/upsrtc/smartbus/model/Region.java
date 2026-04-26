package com.upsrtc.smartbus.model;

import jakarta.persistence.*;



@Entity
@Table(name = "regions")
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @com.fasterxml.jackson.annotation.JsonProperty("id")
    public Integer id;

    @Column(unique = true, nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty("name")
    public String name;

    // Manual Getters for redundancy
    public Integer getId() { return id; }
    public String getName() { return (name != null && !name.isEmpty()) ? name : "Region #" + id; }
}
