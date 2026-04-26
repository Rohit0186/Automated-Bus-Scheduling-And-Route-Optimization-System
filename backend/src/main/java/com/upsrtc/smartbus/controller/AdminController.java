package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.*;
import com.upsrtc.smartbus.repository.*;
import com.upsrtc.smartbus.service.*;
import com.upsrtc.smartbus.dto.BusSeatStatusDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class AdminController {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private SeatService seatService;

    @GetMapping("/buses/seat-status")
    public ResponseEntity<List<BusSeatStatusDTO>> getBusSeatStatus() {
        return ResponseEntity.ok(seatService.getBusSeatStatus());
    }

    @GetMapping("/buses")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busRepository.findAll());
    }

    @PostMapping("/buses")
    public ResponseEntity<Bus> addBus(@RequestBody Bus bus) {
        return ResponseEntity.ok(busRepository.save(bus));
    }

    // Route endpoints are handled by AdvancedRouteController (/api/admin/routes)
    // Kept here for legacy callers that may use /api/admin/routes via AdvancedRouteService

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private BusLocationRepository busLocationRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @DeleteMapping("/buses/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Void> deleteBus(@PathVariable Integer id) {
        // 1. Purge dependent Telemetry
        busLocationRepository.deleteByBusId(id);

        // 2. Purge dependent Payments (via Booking linkage)
        paymentRepository.deleteByBusId(id);

        // 3. Purge dependent Bookings (via Schedule linkage)
        bookingRepository.deleteByBusId(id);

        // 4. Purge dependent Trips
        tripRepository.deleteByBusId(id);

        // 5. Purge dependent Schedules
        scheduleRepository.deleteByBusId(id);

        // 6. Delete the Bus
        busRepository.deleteById(id);
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }

    @GetMapping("/conductors")
    public ResponseEntity<List<Conductor>> getAllConductors() {
        return ResponseEntity.ok(conductorRepository.findAll());
    }

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/schedules")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @PostMapping("/schedules")
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleService.createSchedule(schedule));
    }

    @PutMapping("/schedules/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Integer id, @RequestBody Schedule schedule) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, schedule));
    }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Integer id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok().build();
    }

    @Autowired
    private StopRepository stopRepository;

    @Autowired
    private TrackingService trackingService;

    @PostMapping("/stops/{routeId}")
    public ResponseEntity<List<Stop>> addStops(@PathVariable Integer routeId, @RequestBody List<Stop> stops) {
        // Clear old stops for this route first to allow complete rewrite
        List<Stop> existing = stopRepository.findByRouteIdOrderByOrderIndexAsc(routeId);
        stopRepository.deleteAll(existing);
        
        stops.forEach(s -> {
            Route r = new Route();
            r.setId(routeId);
            s.setRoute(r);
        });
        return ResponseEntity.ok(stopRepository.saveAll(stops));
    }

    @PostMapping("/trip/start")
    public ResponseEntity<String> startTrip(@RequestBody Map<String, Integer> payload) {
        Integer busId = payload.get("busId");
        Integer routeId = payload.get("routeId");
        trackingService.startTrip(busId, routeId);
        return ResponseEntity.ok("Trip started successfully by Admin. Live tracking active.");
    }
}

