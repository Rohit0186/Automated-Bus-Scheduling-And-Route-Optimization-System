package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FuelLogRepository extends JpaRepository<FuelLog, Integer> {
    List<FuelLog> findByBusId(Integer busId);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(f.totalCost), 0.0) FROM FuelLog f")
    Double sumTotalCost();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM FuelLog f WHERE f.bus.id = :busId")
    void deleteByBusId(Integer busId);
}

