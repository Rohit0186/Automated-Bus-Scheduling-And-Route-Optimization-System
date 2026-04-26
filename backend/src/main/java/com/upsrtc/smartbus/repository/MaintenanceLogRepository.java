package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Integer> {
    List<MaintenanceLog> findByBusId(Integer busId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM MaintenanceLog m WHERE m.bus.id = :busId")
    void deleteByBusId(Integer busId);
}

