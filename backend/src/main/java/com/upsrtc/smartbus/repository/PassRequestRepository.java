package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.PassRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PassRequestRepository extends JpaRepository<PassRequest, Integer> {
    List<PassRequest> findByUserId(Integer userId);
    List<PassRequest> findByStatus(PassRequest.Status status);
    long countByStatus(PassRequest.Status status);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM PassRequest p WHERE p.routeId = :routeId")
    void deleteByRouteId(Integer routeId);
}
