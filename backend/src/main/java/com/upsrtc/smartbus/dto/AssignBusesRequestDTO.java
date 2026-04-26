package com.upsrtc.smartbus.dto;

import java.util.List;

public class AssignBusesRequestDTO {
    private List<Integer> busIds;

    public List<Integer> getBusIds() {
        return busIds;
    }

    public void setBusIds(List<Integer> busIds) {
        this.busIds = busIds;
    }
}
