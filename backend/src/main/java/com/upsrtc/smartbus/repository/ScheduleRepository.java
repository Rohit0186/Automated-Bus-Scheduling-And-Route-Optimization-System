package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByRouteSourceAndRouteDestinationAndDepartureDate(String source, String destination, LocalDate departureDate);
    List<Schedule> findByBusIdAndDepartureDate(Integer busId, LocalDate departureDate);

    @Query("SELECT s FROM Schedule s WHERE s.bus.id = :busId AND s.departureDate = :date AND " +
           "((s.departureTime <= :endTime AND s.estimatedArrivalTime >= :startTime))")
    List<Schedule> findOverlappingBusSchedules(Integer busId, LocalDate date, LocalTime startTime, LocalTime endTime);

    @Query("SELECT s FROM Schedule s WHERE s.driver.id = :driverId AND s.departureDate = :date AND " +
           "((s.departureTime <= :endTime AND s.estimatedArrivalTime >= :startTime))")
    List<Schedule> findOverlappingDriverSchedules(Integer driverId, LocalDate date, LocalTime startTime, LocalTime endTime);

    @Modifying
    void deleteByBusId(Integer busId);

    @Modifying
    void deleteByRouteId(Integer routeId);
}

