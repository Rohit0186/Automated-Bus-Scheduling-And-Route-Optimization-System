package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BusRepository extends JpaRepository<Bus, Integer> {
    java.util.Optional<Bus> findByBusNumber(String busNumber);
    List<Bus> findByBusNumberContainingIgnoreCase(String busNumber);
    boolean existsByBusNumber(String busNumber);
    List<Bus> findByRouteId(Integer routeId);
    List<Bus> findByRouteIdAndIsActiveTrue(Integer routeId);
    List<Bus> findByStatus(com.upsrtc.smartbus.model.Bus.Status status);
}
