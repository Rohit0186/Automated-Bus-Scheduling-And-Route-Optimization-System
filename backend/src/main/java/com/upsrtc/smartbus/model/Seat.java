package com.upsrtc.smartbus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seats", indexes = {
    @Index(name = "idx_seat_bus_id", columnList = "bus_id")
})
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Bus bus;

    @Column(nullable = false)
    private String seatNumber; // e.g. "1A", "2B"

    @Enumerated(EnumType.STRING)
    private SeatType seatType;

    public enum SeatType { SEATER, SLEEPER }

    @Enumerated(EnumType.STRING)
    private Position position;

    public enum Position { WINDOW, AISLE, MIDDLE }

    private Double price = 0.0;

    @Enumerated(EnumType.STRING)
    private Deck deck;

    public enum Deck { LOWER, UPPER }

    private Boolean isBooked = false;

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public Boolean getIsBooked() { return isBooked; }
    public void setIsBooked(Boolean booked) { isBooked = booked; }

    public SeatType getSeatType() { return seatType; }
    public void setSeatType(SeatType seatType) { this.seatType = seatType; }

    public Position getPosition() { return position; }
    public void setPosition(Position position) { this.position = position; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Deck getDeck() { return deck; }
    public void setDeck(Deck deck) { this.deck = deck; }
}

