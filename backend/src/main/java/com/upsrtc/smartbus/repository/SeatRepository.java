package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByBusId(Integer busId);
    long countByBusId(Integer busId);
    
    List<Seat> findByBusIdAndSeatNumberIn(Integer busId, List<String> seatNumbers);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    void deleteByBusId(Integer busId);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Seat s WHERE s.id = :id")
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    java.util.Optional<Seat> findByIdForUpdate(@org.springframework.data.repository.query.Param("id") Integer id);
}

