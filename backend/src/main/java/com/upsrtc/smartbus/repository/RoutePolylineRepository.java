package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.RoutePolyline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoutePolylineRepository extends JpaRepository<RoutePolyline, Integer> {
    List<RoutePolyline> findByRouteIdOrderByPointOrderAsc(Integer routeId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM RoutePolyline r WHERE r.routeId = :routeId")
    void deleteByRouteId(Integer routeId);
}

