package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Bus;
import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.model.Schedule;
import com.upsrtc.smartbus.repository.BusRepository;
import com.upsrtc.smartbus.repository.RouteRepository;
import com.upsrtc.smartbus.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicBusController {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @GetMapping("/buses")
    public ResponseEntity<List<Bus>> getPublicBuses(@RequestParam(required = false) Bus.BusType type) {
        List<Bus> buses = busRepository.findAll();
        if (type != null) {
            buses = buses.stream()
                    .filter(b -> b.getBusType() == type)
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(buses);
    }

    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getPublicRoutes(@RequestParam(required = false) Boolean longRoute) {
        List<Route> routes = routeRepository.findAll();
        if (longRoute != null) {
            routes = routes.stream()
                    .filter(r -> longRoute ? r.getTotalDistance() > 300 : r.getTotalDistance() <= 300)
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/schedules/today")
    public ResponseEntity<List<Schedule>> getTodaySchedules() {
        return ResponseEntity.ok(scheduleRepository.findAll().stream()
                .filter(s -> s.getDepartureDate().equals(LocalDate.now()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/routes/{routeId}/bus-types")
    public ResponseEntity<List<Bus.BusType>> getBusTypesForRoute(@PathVariable Integer routeId) {
        List<Bus.BusType> busTypes = scheduleRepository.findAll().stream()
                .filter(s -> s.getRoute().getId().equals(routeId))
                .map(s -> s.getBus().getBusType())
                .distinct()
                .collect(Collectors.toList());
        return ResponseEntity.ok(busTypes);
    }
}

