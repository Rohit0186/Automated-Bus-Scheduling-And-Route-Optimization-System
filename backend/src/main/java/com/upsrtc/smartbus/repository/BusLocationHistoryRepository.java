package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.BusLocationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BusLocationHistoryRepository extends JpaRepository<BusLocationHistory, Integer> {
    List<BusLocationHistory> findByScheduleIdOrderByRecordedAtAsc(Integer scheduleId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM BusLocationHistory b WHERE b.busId = :busId")
    void deleteByBusId(@org.springframework.data.repository.query.Param("busId") Integer busId);
}

