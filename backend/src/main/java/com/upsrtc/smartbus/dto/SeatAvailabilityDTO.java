package com.upsrtc.smartbus.dto;

import com.upsrtc.smartbus.model.Seat;
import com.upsrtc.smartbus.model.Seat.SeatType;
import com.upsrtc.smartbus.model.Seat.Position;
import com.upsrtc.smartbus.model.Seat.Deck;

public class SeatAvailabilityDTO {
    private Integer seatId;
    private String seatNumber;
    private SeatType seatType;
    private Position position;
    private Double price;
    private Deck deck;
    private boolean available;

    public SeatAvailabilityDTO(Seat seat, boolean available) {
        this.seatId = seat.getId();
        this.seatNumber = seat.getSeatNumber();
        this.seatType = seat.getSeatType();
        this.position = seat.getPosition();
        this.price = seat.getPrice();
        this.deck = seat.getDeck();
        this.available = available;
    }

    // Manual Getters/Setters
    public Integer getSeatId() { return seatId; }
    public void setSeatId(Integer seatId) { this.seatId = seatId; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public SeatType getSeatType() { return seatType; }
    public void setSeatType(SeatType seatType) { this.seatType = seatType; }
    public Position getPosition() { return position; }
    public void setPosition(Position position) { this.position = position; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Deck getDeck() { return deck; }
    public void setDeck(Deck deck) { this.deck = deck; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}

