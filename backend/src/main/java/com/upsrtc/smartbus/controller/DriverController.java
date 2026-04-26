package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private TrackingService trackingService;

    @PostMapping("/start-trip")
    public ResponseEntity<String> startTrip(
            @RequestParam Integer busId,
            @RequestParam(required = false) Integer scheduleId) {
        trackingService.startTrip(busId, scheduleId);
        return ResponseEntity.ok("Trip started for bus " + busId);
    }

    @PostMapping("/end-trip")
    public ResponseEntity<String> endTrip(
            @RequestParam Integer busId,
            @RequestParam(required = false) Integer scheduleId) {
        trackingService.endTrip(busId, scheduleId);
        return ResponseEntity.ok("Trip ended for bus " + busId);
    }

    @PostMapping("/update-location")
    public ResponseEntity<String> updateLocation(
            @RequestParam Integer busId,
            @RequestParam(required = false) Integer scheduleId,
            @RequestParam Double lat,
            @RequestParam Double lng) {
        trackingService.updateLocation(busId, scheduleId, lat, lng);
        return ResponseEntity.ok("Location updated");
    }
}

