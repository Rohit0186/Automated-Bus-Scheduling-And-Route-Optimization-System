package com.upsrtc.smartbus.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "fuel_logs")
public class FuelLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    private LocalDateTime date;
    private Double liters;
    private Double totalCost;
    private String receiptNumber;

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public Double getLiters() { return liters; }
    public void setLiters(Double liters) { this.liters = liters; }
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
}

