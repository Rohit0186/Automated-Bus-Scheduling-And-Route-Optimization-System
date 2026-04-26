package com.upsrtc.smartbus.dto;

import java.util.List;

public class BookingRequestDTO {
    private Integer busId;
    private List<String> seatNumbers;

    public Integer getBusId() {
        return busId;
    }

    public void setBusId(Integer busId) {
        this.busId = busId;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
}
