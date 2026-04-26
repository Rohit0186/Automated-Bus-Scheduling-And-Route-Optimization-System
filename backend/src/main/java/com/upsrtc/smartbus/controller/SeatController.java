package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.dto.SeatAvailabilityDTO;
import com.upsrtc.smartbus.model.Seat;
import com.upsrtc.smartbus.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public/seats")
@CrossOrigin(origins = "*")
public class SeatController {

    @Autowired private SeatService seatService;

    // ── Admin seat configuration endpoints ────────────────────────────────

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Seat> createSeat(@RequestParam Integer busId, @RequestBody Seat seat) {
        return ResponseEntity.ok(seatService.createSeat(busId, seat));
    }

    @GetMapping("/admin/{busId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Seat>> getSeatsByBus(@PathVariable Integer busId) {
        return ResponseEntity.ok(seatService.getSeatsByBus(busId));
    }

    @PutMapping("/admin/update/{seatId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Seat> updateSeat(@PathVariable Integer seatId, @RequestBody Seat seat) {
        return ResponseEntity.ok(seatService.updateSeat(seatId, seat));
    }

    @DeleteMapping("/admin/delete/{seatId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSeat(@PathVariable Integer seatId) {
        seatService.deleteSeat(seatId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/generate/{busId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> generateSeats(@PathVariable Integer busId) {
        seatService.autoGenerateSeats(busId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/bulk-price/{busId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateBulkPrice(
            @PathVariable Integer busId,
            @RequestParam(required = false) Seat.SeatType type,
            @RequestParam Double price) {
        seatService.updateSeatPriceBulk(busId, type, price);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<Seat>> getSeatsForBus(@PathVariable Integer busId) {
        return ResponseEntity.ok(seatService.getSeatsByBus(busId));
    }

    // ── User: dynamic seat availability for a schedule ─────────────────────

    @GetMapping("/{scheduleId}")
    public ResponseEntity<List<SeatAvailabilityDTO>> getSeatsForSchedule(@PathVariable Integer scheduleId) {
        return ResponseEntity.ok(seatService.getSeatAvailabilityBySchedule(scheduleId));
    }

    @GetMapping("/availability/{busId}")
    public ResponseEntity<List<SeatAvailabilityDTO>> getSeatAvailability(
            @PathVariable Integer busId,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) LocalDate date) {
        return ResponseEntity.ok(seatService.getSeatAvailability(busId, source, destination, date));
    }
}



