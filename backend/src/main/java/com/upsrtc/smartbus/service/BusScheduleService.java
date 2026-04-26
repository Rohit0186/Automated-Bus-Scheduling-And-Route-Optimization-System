package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.model.*;
import com.upsrtc.smartbus.repository.BusScheduleRepository;
import com.upsrtc.smartbus.dto.BusSearchResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BusScheduleService {

    @Autowired private BusScheduleRepository busScheduleRepository;
    @Autowired private SeatService seatService;

    @Transactional
    public void generateSchedulesForBus(Bus bus, Route route, LocalDate startDate, int days) {
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            
            // Check if schedule already exists for this bus and date
            if (busScheduleRepository.findByBusIdAndTravelDate(bus.getId(), date).isEmpty()) {
                BusSchedule sch = new BusSchedule();
                sch.setBus(bus);
                sch.setRoute(route);
                sch.setTravelDate(date);
                
                LocalTime departure = bus.getStartTime() != null ? bus.getStartTime() : LocalTime.of(8, 0);
                sch.setDepartureTime(departure);
                
                // Estimate arrival based on distance (avg 40km/h)
                int durationMins = (int) (route.getTotalDistance() != null ? (route.getTotalDistance() / 40.0 * 60) : 120);
                sch.setArrivalTime(departure.plusMinutes(durationMins));
                
                sch.setStatus(BusSchedule.Status.UPCOMING);
                busScheduleRepository.save(sch);
            }
        }
    }

    @Autowired private com.upsrtc.smartbus.repository.RouteRepository routeRepository;

    public List<BusSearchResponseDTO> searchBuses(String source, String destination, LocalDate date) {
        List<BusSearchResponseDTO> results = new ArrayList<>();
        
        // Find routes matching the source and destination (lenient matching for station names)
        List<Route> matchingRoutes = routeRepository.findAll().stream()
            .filter(r -> 
                (source.toLowerCase().contains(r.getSource().toLowerCase()) || r.getSource().toLowerCase().contains(source.toLowerCase())) &&
                (destination.toLowerCase().contains(r.getDestination().toLowerCase()) || r.getDestination().toLowerCase().contains(destination.toLowerCase()))
            )
            .toList();

        for (Route route : matchingRoutes) {
            // Find all schedules for this route and date
            List<BusSchedule> schedules = busScheduleRepository.findByRouteIdAndTravelDate(route.getId(), date);
            
            for (BusSchedule sch : schedules) {
                Bus bus = sch.getBus();
                BusSearchResponseDTO dto = new BusSearchResponseDTO();
                dto.setTripId(sch.getId()); 
                dto.setBusId(bus.getId());
                dto.setBusNumber(bus.getBusNumber());
                dto.setBusType(bus.getBusType() != null ? bus.getBusType().name() : "NON_AC");
                
                dto.setArrivalAtSource(sch.getDepartureTime());
                dto.setDepartureFromSource(sch.getDepartureTime().plusMinutes(10));
                dto.setArrivalTimeAtDest(sch.getArrivalTime());
                
                double farePerKm = route.getFarePerKm() != null ? route.getFarePerKm() : 1.0;
                dto.setFare(Math.max(50.0, Math.round((route.getTotalDistance() != null ? route.getTotalDistance() : 100) * farePerKm)));
                
                // Calculate real available seats
                int available = (int) seatService.getSeatAvailabilityBySchedule(sch.getId()).stream()
                    .filter(s -> s.isAvailable())
                    .count();
                dto.setAvailableSeats(available);
                
                results.add(dto);
            }
        }
        return results;
    }
    public BusSchedule getScheduleById(Integer id) {
        if (id == null) throw new IllegalArgumentException("Schedule ID cannot be null");
        return busScheduleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("The selected bus schedule (ID: " + id + ") is no longer active. Please go back to the search results and refresh to get the latest availability."));
    }
}
