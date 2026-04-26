package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Bus;
// import com.upsrtc.smartbus.model.Schedule; // Removed unused import
import com.upsrtc.smartbus.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bus")
@CrossOrigin(origins = "*")
public class BusController {

    @Autowired
    private BusService busService;

    @Autowired
    private com.upsrtc.smartbus.service.BusScheduleService busScheduleService;

    @GetMapping("/search")
    public ResponseEntity<List<com.upsrtc.smartbus.dto.BusSearchResponseDTO>> searchBuses(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(busScheduleService.searchBuses(source, destination, date));
    }

    @GetMapping("/schedule/{id}")
    public ResponseEntity<com.upsrtc.smartbus.model.BusSchedule> getSchedule(@PathVariable Integer id) {
        return ResponseEntity.ok(busScheduleService.getScheduleById(id));
    }

    // ─── Bus Management CRUD ───────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
        return ResponseEntity.ok(busService.createBus(bus));
    }

    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bus> getBus(@PathVariable Integer id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> updateBus(@PathVariable Integer id, @RequestBody Bus bus) {
        return ResponseEntity.ok(busService.updateBus(id, bus));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBus(@PathVariable Integer id) {
        busService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> updateStatus(@PathVariable Integer id, @RequestParam Bus.Status status) {
        return ResponseEntity.ok(busService.updateStatus(id, status));
    }
}

