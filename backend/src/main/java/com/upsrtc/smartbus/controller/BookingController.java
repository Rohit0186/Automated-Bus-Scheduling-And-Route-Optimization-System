package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.dto.BookingRequest;
import com.upsrtc.smartbus.dto.DashboardStatsDTO;
import com.upsrtc.smartbus.model.Booking;
import com.upsrtc.smartbus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return ResponseEntity.ok(bookingService.createBooking(request, username));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().header("X-Error", e.getMessage()).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).header("X-Error", e.getMessage()).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).header("X-Error", "Booking failed").build();
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bookingService.getUserBookings(username));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Integer id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(bookingService.getStats(username));
    }

    @GetMapping("/{id}/ticket")
    public ResponseEntity<com.upsrtc.smartbus.dto.TicketDTO> getTicketDetails(@PathVariable Integer id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(new com.upsrtc.smartbus.dto.TicketDTO(booking));
    }
}

