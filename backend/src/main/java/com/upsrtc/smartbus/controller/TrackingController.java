package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TrackingController {

    @Autowired
    private TrackingService trackingService;

    @PostMapping("/trips/start/{busId}/{routeId}")
    public ResponseEntity<String> startTrip(@PathVariable Integer busId, @PathVariable Integer routeId) {
        trackingService.startTrip(busId, routeId);
        return ResponseEntity.ok("Trip started successfully");
    }

    @GetMapping("/tracking/bus/{busNumber}")
    public ResponseEntity<Object> getTracking(@PathVariable String busNumber) {
        return ResponseEntity.ok(trackingService.getTrackingByBusNumber(busNumber));
    }
}

