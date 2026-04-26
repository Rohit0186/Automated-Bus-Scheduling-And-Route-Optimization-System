package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RouteStopRepository extends JpaRepository<RouteStop, Integer> {
    List<RouteStop> findByRouteIdOrderByStopOrderAsc(Integer routeId);
}

