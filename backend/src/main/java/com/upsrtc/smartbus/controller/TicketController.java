package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Ticket;
import com.upsrtc.smartbus.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/book-ticket")
    public ResponseEntity<Map<String, Object>> bookTicket(@RequestBody Ticket ticket) {
        Ticket savedTicket = ticketService.bookTicket(ticket);
        String qrBase64 = ticketService.getTicketQR(savedTicket.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("ticket", savedTicket);
        response.put("qrCode", "data:image/png;base64," + qrBase64);
        
        return ResponseEntity.ok(response);
    }

    @Autowired
    private com.upsrtc.smartbus.repository.BookingRepository bookingRepository;

    @GetMapping("/ticket/{id}")
    public ResponseEntity<Map<String, Object>> getTicket(@PathVariable Integer id) {
        if (id == null) return ResponseEntity.badRequest().build();
        // Try finding by Ticket ID first, then by Booking ID
        return ticketService.getTicketById(id)
                .or(() -> ticketService.getTicketByBookingId(id))
                .or(() -> {
                    // SELF-HEALING: If no ticket exists but booking is CONFIRMED, create one on the fly
                    return bookingRepository.findById(id)
                            .filter(b -> b.getStatus() == com.upsrtc.smartbus.model.Booking.Status.CONFIRMED)
                            .map(b -> {
                                Ticket t = new Ticket();
                                t.setBookingId(b.getId());
                                t.setUserId(b.getUser().getId());
                                t.setBusId(b.getBus().getId());
                                t.setSource(b.getSourceStop());
                                t.setDestination(b.getDestinationStop());
                                t.setSeatNumber(b.getSeatNumbers());
                                t.setJourneyDate(b.getTravelDate());
                                t.setFare(b.getTotalAmount());
                                return ticketService.bookTicket(t);
                            });
                })
                .map(ticket -> {
                    String qrBase64 = ticketService.getTicketQR(ticket.getId());
                    Map<String, Object> response = new HashMap<>();
                    response.put("ticket", ticket);
                    response.put("qrCode", "data:image/png;base64," + qrBase64);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
