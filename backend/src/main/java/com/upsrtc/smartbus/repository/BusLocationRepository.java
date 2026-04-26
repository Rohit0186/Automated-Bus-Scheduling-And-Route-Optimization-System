package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.BusLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BusLocationRepository extends JpaRepository<BusLocation, Integer> {
    List<BusLocation> findByBusId(Integer busId);
    List<BusLocation> findByBusIdAndTripStatus(Integer busId, BusLocation.TripStatus tripStatus);
    List<BusLocation> findAllByTripStatus(BusLocation.TripStatus tripStatus);
    List<BusLocation> findByScheduleId(Integer scheduleId);
    List<BusLocation> findAllByScheduleId(Integer scheduleId);
    long countByTripStatus(BusLocation.TripStatus tripStatus);

    @org.springframework.transaction.annotation.Transactional
    @Modifying
    @Query("DELETE FROM BusLocation b WHERE b.bus.id IN (SELECT b2.id FROM Bus b2 WHERE b2.route.id = :routeId)")
    void deleteByRouteId(@Param("routeId") Integer routeId);

    @org.springframework.transaction.annotation.Transactional
    @Modifying
    void deleteByBusId(Integer busId);
}
