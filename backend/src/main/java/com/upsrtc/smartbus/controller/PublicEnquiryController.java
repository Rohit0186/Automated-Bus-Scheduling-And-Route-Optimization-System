package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.model.RouteStop;
import com.upsrtc.smartbus.model.Bus.BusType;
import com.upsrtc.smartbus.repository.RouteRepository;
import com.upsrtc.smartbus.repository.RouteStopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiry")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class PublicEnquiryController {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteStopRepository routeStopRepository;

    @GetMapping("/fare")
    public ResponseEntity<Map<String, Object>> calculateFare(
            @RequestParam Integer routeId,
            @RequestParam BusType busType) {
        
        return routeRepository.findById(routeId).map((Route route) -> {
            double ratePerKm;
            switch (busType) {
                case AC: ratePerKm = 1.5; break;
                case SLEEPER: ratePerKm = 2.0; break;
                default: ratePerKm = 1.0; break;
            }

            double totalFare = route.getTotalDistance() * ratePerKm;
            
            Map<String, Object> response = new HashMap<>();
            response.put("routeId", routeId);
            response.put("busType", busType);
            response.put("distanceKm", route.getTotalDistance());
            response.put("ratePerKm", ratePerKm);
            response.put("totalFare", Math.round(totalFare * 100.0) / 100.0);
            
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/route/{routeId}/details")
    public ResponseEntity<List<RouteStop>> getRouteDetails(@PathVariable Integer routeId) {
        List<RouteStop> stops = routeStopRepository.findByRouteIdOrderByStopOrderAsc(routeId);
        return ResponseEntity.ok(stops);
    }
}



