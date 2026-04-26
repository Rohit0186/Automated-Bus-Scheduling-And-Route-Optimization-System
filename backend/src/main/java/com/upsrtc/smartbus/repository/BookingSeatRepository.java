package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Set;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Integer> {

    List<BookingSeat> findByScheduleId(Integer scheduleId);

    @Query("SELECT bs.seat.id FROM BookingSeat bs WHERE bs.schedule.id = :scheduleId")
    Set<Integer> findBookedSeatIdsByScheduleId(@Param("scheduleId") Integer scheduleId);

    @Query("SELECT COUNT(bs) FROM BookingSeat bs " +
           "JOIN bs.seat s " +
           "JOIN bs.schedule sc " +
           "WHERE s.bus.id = :busId AND sc.status = 'ON_TIME'")
    long countBookedSeatsByBusId(@Param("busId") Integer busId);

    @Query("SELECT COUNT(bs) FROM BookingSeat bs " +
           "WHERE bs.seat.bus.id = :busId AND bs.schedule.departureDate = :date")
    long countBookedSeatsByBusIdAndDate(@Param("busId") Integer busId, @Param("date") java.time.LocalDate date);

    List<BookingSeat> findByScheduleIdAndSeatId(Integer scheduleId, Integer seatId);

       @org.springframework.data.jpa.repository.Query("SELECT bs FROM BookingSeat bs WHERE bs.schedule.id = :scheduleId AND bs.seat.id = :seatId")
       @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
       List<BookingSeat> findByScheduleIdAndSeatIdForUpdate(@org.springframework.data.repository.query.Param("scheduleId") Integer scheduleId, @org.springframework.data.repository.query.Param("seatId") Integer seatId);

    void deleteByBookingId(Integer bookingId);

    @Modifying
    @Query("DELETE FROM BookingSeat bs WHERE bs.schedule IN (SELECT s FROM Schedule s WHERE s.bus.id = :busId)")
    void deleteByBusId(@Param("busId") Integer busId);
}

