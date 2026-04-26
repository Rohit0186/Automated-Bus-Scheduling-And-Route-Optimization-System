package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.dto.FareCalculationRequestDTO;
import com.upsrtc.smartbus.dto.FareCalculationResponseDTO;
import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.model.RouteStop;


import com.upsrtc.smartbus.repository.RouteRepository;
import com.upsrtc.smartbus.repository.RouteStopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class FareCalculationService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteStopRepository routeStopRepository;

    private static final Double MIN_FARE = 10.0;

    public FareCalculationResponseDTO calculateFare(FareCalculationRequestDTO request) {
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        RouteStop sourceStop = routeStopRepository.findById(request.getSourceStopId())
                .orElseThrow(() -> new RuntimeException("Source stop not found"));

        RouteStop destStop = routeStopRepository.findById(request.getDestinationStopId())
                .orElseThrow(() -> new RuntimeException("Destination stop not found"));

        if (!sourceStop.getRoute().getId().equals(route.getId()) ||
            !destStop.getRoute().getId().equals(route.getId())) {
            throw new IllegalArgumentException("Stops do not belong to the given route");
        }

        double distance = destStop.getDistanceFromStart() - sourceStop.getDistanceFromStart();

        if (distance <= 0) {
            throw new IllegalArgumentException("Destination must be after source");
        }

        double fare = distance * route.getFarePerKm();
        if (fare < MIN_FARE) {
            fare = MIN_FARE;
        }

        // Round to nearest integer
        fare = Math.round(fare * 100.0) / 100.0;

        return new FareCalculationResponseDTO(distance, fare);
    }
}
