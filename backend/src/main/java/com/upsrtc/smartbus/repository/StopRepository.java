package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StopRepository extends JpaRepository<Stop, Integer> {
    List<Stop> findByRouteIdOrderByOrderIndexAsc(Integer routeId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Stop s WHERE s.route.id = :routeId")
    void deleteByRouteId(Integer routeId);
}

