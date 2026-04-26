package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    // Find bookings by bus
    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.bus.id = :busId")
    List<Booking> findByBusId(@org.springframework.data.repository.query.Param("busId") Integer busId);

    List<Booking> findByBusScheduleId(Integer scheduleId);

    // Find bookings for a specific user
    // Find bookings for a specific user
    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b JOIN FETCH b.bus bus JOIN FETCH bus.route WHERE b.user.id = :userId")
    List<Booking> findByUserId(@org.springframework.data.repository.query.Param("userId") Integer userId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Booking b WHERE b.bus.id = :busId")
    void deleteByBusId(@org.springframework.data.repository.query.Param("busId") Integer busId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Booking b WHERE b.bus IN (SELECT bus FROM Bus bus WHERE bus.route.id = :routeId)")
    void deleteByRouteId(@org.springframework.data.repository.query.Param("routeId") Integer routeId);
}
