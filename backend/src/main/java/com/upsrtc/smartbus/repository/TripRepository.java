package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Integer> {
    List<Trip> findByStatus(Trip.TripStatus status);
    List<Trip> findByBusBusNumberAndStatus(String busNumber, Trip.TripStatus status);
    
    @org.springframework.data.jpa.repository.Modifying
    void deleteByRouteId(Integer routeId);

    @org.springframework.data.jpa.repository.Modifying
    void deleteByBusId(Integer busId);
}

