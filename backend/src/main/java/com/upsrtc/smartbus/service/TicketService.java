package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.model.Ticket;
import com.upsrtc.smartbus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private QRGeneratorService qrGeneratorService;

    @Transactional
    public Ticket bookTicket(Ticket ticket) {
        // Generate unique QR data: BUSID-USERID-TIMESTAMP-RANDOM
        String uniqueToken = String.format("%d-%d-%d-%s",
                ticket.getBusId(),
                ticket.getUserId(),
                System.currentTimeMillis(),
                UUID.randomUUID().toString().substring(0, 8)
        );
        
        ticket.setQrCodeData(uniqueToken);
        ticket.setStatus(Ticket.Status.BOOKED);
        return ticketRepository.save(ticket);
    }

    public Optional<Ticket> getTicketById(Integer id) {
        if (id == null) return Optional.empty();
        return ticketRepository.findById(id);
    }

    public Optional<Ticket> getTicketByBookingId(Integer bookingId) {
        if (bookingId == null) return Optional.empty();
        return ticketRepository.findByBookingId(bookingId);
    }

    public String getTicketQR(Integer id) {
        if (id == null) throw new IllegalArgumentException("ID cannot be null");
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return qrGeneratorService.generateQRCodeBase64(ticket.getQrCodeData(), 300, 300);
    }

    @Transactional
    public String validateTicket(String qrData) {
        Optional<Ticket> ticketOpt = ticketRepository.findByQrCodeData(qrData);

        if (ticketOpt.isEmpty()) {
            return "INVALID";
        }

        Ticket ticket = ticketOpt.get();

        if (ticket.getStatus() == Ticket.Status.USED) {
            return "ALREADY USED";
        }

        if (ticket.getStatus() == Ticket.Status.CANCELLED) {
            return "CANCELLED";
        }

        // Check if journey date is today
        if (!ticket.getJourneyDate().isEqual(LocalDate.now())) {
            return "WRONG DATE (Scheduled: " + ticket.getJourneyDate() + ")";
        }

        // Mark as USED
        ticket.setStatus(Ticket.Status.USED);
        ticketRepository.save(ticket);

        return "VALID";
    }
}
