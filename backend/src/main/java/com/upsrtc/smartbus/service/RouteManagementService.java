package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.dto.RouteRequestDTO;
import com.upsrtc.smartbus.dto.RouteStopRequestDTO;
import com.upsrtc.smartbus.model.Bus;
import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.model.RouteStop;
import com.upsrtc.smartbus.repository.BusRepository;
import com.upsrtc.smartbus.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class RouteManagementService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BusRepository busRepository;

    @Transactional
    public Route createOrUpdateRoute(RouteRequestDTO dto) {
        // Ensure stops are sorted and valid
        if (dto.getStops() != null && !dto.getStops().isEmpty()) {
            // Sort by stop order first to handle any out-of-order data
            dto.getStops().sort(java.util.Comparator.comparingInt(RouteStopRequestDTO::getStopOrder));
            
            double lastDistance = -1.0;
            int lastOrder = -1;
            
            for (RouteStopRequestDTO stopDto : dto.getStops()) {
                if (stopDto.getStopOrder() <= lastOrder) {
                    // If we still have duplicates after Excel handling, we skip or handle them
                    continue; 
                }
                // Distance must still be increasing for a valid route
                if (stopDto.getDistanceFromStart() < lastDistance) {
                    stopDto.setDistanceFromStart(lastDistance + 0.1); // Auto-correct minor distance errors
                }
                
                lastDistance = stopDto.getDistanceFromStart();
                lastOrder = stopDto.getStopOrder();
            }
        }

        if (dto.getSource().equalsIgnoreCase(dto.getDestination())) {
            throw new IllegalArgumentException("Source and destination cannot be the same");
        }

        Route route = routeRepository.findByRouteNameAndSourceAndDestination(
                dto.getRouteName(), dto.getSource(), dto.getDestination()
        ).orElse(new Route());

        route.setRouteName(dto.getRouteName());
        route.setSource(dto.getSource());
        route.setDestination(dto.getDestination());
        route.setTotalDistance(dto.getTotalDistance());
        route.setFarePerKm(dto.getFarePerKm());
        route.setIsActive(dto.getIsActive());

        if (route.getStops() == null) {
            route.setStops(new ArrayList<>());
        } else {
            route.getStops().clear();
        }

        if (dto.getStops() != null) {
            for (RouteStopRequestDTO stopDto : dto.getStops()) {
                RouteStop stop = new RouteStop();
                stop.setRoute(route);
                stop.setStopName(stopDto.getStopName());
                stop.setStopOrder(stopDto.getStopOrder());
                stop.setDurationFromStart(stopDto.getDurationFromStart());
                stop.setDistanceFromStart(stopDto.getDistanceFromStart());
                stop.setLatitude(stopDto.getLatitude());
                stop.setLongitude(stopDto.getLongitude());
                route.getStops().add(stop);
            }
        }

        return routeRepository.save(route);
    }

    @Autowired
    private BusScheduleService busScheduleService;

    @Transactional
    public void assignBuses(Integer routeId, List<Integer> busIds) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        for (Integer busId : busIds) {
            Bus bus = busRepository.findById(busId)
                    .orElseThrow(() -> new RuntimeException("Bus not found with id: " + busId));
            bus.setRoute(route);
            busRepository.save(bus);
            
            // Auto-generate per-stop schedules for the next 30 days
            busScheduleService.generateSchedulesForBus(bus, route, java.time.LocalDate.now(), 30);
        }
    }

    @Transactional
    public Route toggleRoute(Integer routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        route.setIsActive(!route.getIsActive());
        return routeRepository.save(route);
    }

    public List<Route> getActiveRoutes() {
        return routeRepository.findByIsActiveTrue();
    }
}
