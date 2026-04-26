package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.dto.BusTimingResponseDTO;
import com.upsrtc.smartbus.model.Bus;
import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.model.RouteStop;
import com.upsrtc.smartbus.repository.BusRepository;
import com.upsrtc.smartbus.repository.RouteRepository;
import com.upsrtc.smartbus.repository.RouteStopRepository;
import com.upsrtc.smartbus.repository.DriverRepository;
import com.upsrtc.smartbus.repository.ConductorRepository;
import com.upsrtc.smartbus.model.Driver;
import com.upsrtc.smartbus.model.Conductor;

import com.upsrtc.smartbus.service.RouteManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import com.upsrtc.smartbus.model.Schedule;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin("*")
@SuppressWarnings("null")
public class UserRouteController {

    @Autowired
    private RouteManagementService routeManagementService;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteStopRepository routeStopRepository;
    @Autowired
    private DriverRepository driverRepository;
    @Autowired
    private ConductorRepository conductorRepository;
    @Autowired
    private com.upsrtc.smartbus.repository.ScheduleRepository scheduleRepository;


    @GetMapping
    public ResponseEntity<List<Route>> getActiveRoutes() {
        return ResponseEntity.ok(routeManagementService.getActiveRoutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Integer id) {
        return routeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/buses")
    public ResponseEntity<List<BusTimingResponseDTO>> getBusesForRoute(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer sourceStopId,
            @RequestParam(required = false) Integer destinationStopId) {

        System.out.println(">>> UserRouteController: Searching buses for Route ID: " + id + ", Source Stop: " + sourceStopId + ", Dest Stop: " + destinationStopId);
        List<Bus> buses = busRepository.findByRouteIdAndIsActiveTrue(id);
        System.out.println(">>> Found " + buses.size() + " active buses for route " + id);
        List<BusTimingResponseDTO> response = new ArrayList<>();

        Integer sourceDuration = 0;
        Integer destDuration = 0;

        if (sourceStopId != null) {
            RouteStop source = routeStopRepository.findById(sourceStopId).orElse(null);
            if (source != null) sourceDuration = source.getDurationFromStart() != null ? source.getDurationFromStart() : 0;
        }

        if (destinationStopId != null) {
            RouteStop dest = routeStopRepository.findById(destinationStopId).orElse(null);
            if (dest != null) destDuration = dest.getDurationFromStart() != null ? dest.getDurationFromStart() : 0;
        }

        for (Bus bus : buses) {
            try {
                LocalTime baseTime = bus.getStartTime() != null ? bus.getStartTime() : LocalTime.of(8, 0);
                LocalTime sourceArrivalTime = baseTime.plusMinutes(sourceDuration);
                LocalTime destArrivalTime = baseTime.plusMinutes(destDuration);

                // Find or Create Schedule for today
                LocalDate today = LocalDate.now();
                Schedule schedule = scheduleRepository.findByBusIdAndDepartureDate(bus.getId(), today)
                        .stream().findFirst().orElse(null);
                
                if (schedule == null) {
                    System.out.println(">>> Auto-creating missing legacy schedule for bus " + bus.getBusNumber());
                    schedule = new Schedule();
                    schedule.setBus(bus);
                    schedule.setRoute(bus.getRoute());
                    schedule.setDepartureDate(today);
                    schedule.setDepartureTime(baseTime);
                    schedule.setEstimatedArrivalTime(baseTime.plusHours(4));
                    schedule.setPrice(90.0);
                    schedule.setStatus(Schedule.Status.ON_TIME);
                    
                    // Add personnel if available
                    List<Driver> drivers = driverRepository.findAll();
                    if (!drivers.isEmpty()) schedule.setDriver(drivers.get(0));
                    
                    List<Conductor> conductors = conductorRepository.findAll();
                    if (!conductors.isEmpty()) schedule.setConductor(conductors.get(0));

                    
                    schedule = scheduleRepository.save(schedule);
                }

                BusTimingResponseDTO dto = new BusTimingResponseDTO();
                dto.setBusId(bus.getId());
                dto.setScheduleId(schedule.getId());
                dto.setBusNumber(bus.getBusNumber());
                dto.setBusName(bus.getBusName() != null ? bus.getBusName() : "JanSafar Express");
                dto.setBusType(bus.getBusType() != null ? bus.getBusType().name() : "AC");
                dto.setAvailableSeats(bus.getAvailableSeats() != null ? bus.getAvailableSeats() : 40);
                dto.setSourceArrivalTime(sourceArrivalTime);
                dto.setDestinationArrivalTime(destArrivalTime);
                response.add(dto);
            } catch (Exception e) {
                System.err.println(">>> Error processing bus " + bus.getBusNumber() + ": " + e.getMessage());
            }
        }

        return ResponseEntity.ok(response);
    }
}
