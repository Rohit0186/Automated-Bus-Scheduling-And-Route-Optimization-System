package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Integer> {
    List<Route> findBySourceAndDestination(String source, String destination);
    List<Route> findByIsActiveTrue();
    
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT r.destination FROM Route r WHERE :source LIKE CONCAT('%', r.source, '%') AND r.isActive = true")
    List<String> findDestinationsBySource(@org.springframework.data.repository.query.Param("source") String source);

    Optional<Route> findByRouteNameAndSourceAndDestination(String routeName, String source, String destination);
}
