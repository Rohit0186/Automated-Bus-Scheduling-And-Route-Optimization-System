package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByBookingId(Integer bookingId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.createdAt >= :after")
    Double sumAmountByStatusAndCreatedAtAfter(@Param("status") Payment.PaymentStatus status, @Param("after") LocalDateTime after);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.createdAt >= :start AND p.createdAt < :end")
    Double sumAmountBetween(@Param("status") Payment.PaymentStatus status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Modifying
    @Query("DELETE FROM Payment p WHERE p.booking IN (SELECT b FROM Booking b WHERE b.bus.route.id = :routeId)")
    void deleteByRouteId(@Param("routeId") Integer routeId);

    @Modifying
    @Query("DELETE FROM Payment p WHERE p.booking IN (SELECT b FROM Booking b WHERE b.bus.id = :busId)")
    void deleteByBusId(@Param("busId") Integer busId);
}
