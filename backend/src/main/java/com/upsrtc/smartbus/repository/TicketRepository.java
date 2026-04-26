package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    Optional<Ticket> findByQrCodeData(String qrCodeData);
    Optional<Ticket> findByBookingId(Integer bookingId);
}
