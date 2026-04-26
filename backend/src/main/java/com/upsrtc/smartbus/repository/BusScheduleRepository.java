package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.BusSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, Integer> {
    List<BusSchedule> findByBusIdAndTravelDate(Integer busId, LocalDate date);
    
    List<BusSchedule> findByRouteIdAndTravelDate(Integer routeId, LocalDate date);

    @Query("SELECT bs FROM BusSchedule bs WHERE bs.status = 'ONGOING' AND bs.arrivalTime < :currentTime")
    List<BusSchedule> findCompletedSchedules(@Param("currentTime") java.time.LocalTime currentTime);

    List<BusSchedule> findByStatus(BusSchedule.Status status);
}
