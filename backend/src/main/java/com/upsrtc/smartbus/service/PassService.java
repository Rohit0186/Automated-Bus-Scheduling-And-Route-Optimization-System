package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.model.PassRequest;
import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.model.Bus;
import com.upsrtc.smartbus.repository.PassRequestRepository;
import com.upsrtc.smartbus.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Senior-Level Service for processing transport pass and smart card requests.
 */
@Service
@SuppressWarnings("null")
public class PassService {

    @Autowired
    private PassRequestRepository passRequestRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Transactional
    public PassRequest applyForPass(PassRequest request) {
        if (request.getRouteId() == null) {
            throw new IllegalArgumentException("Route ID must not be null");
        }
        
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        // Senior-Level Pricing Logic: Base Fare * Distance * Multiplier
        double baseMultiplier = 1.0;
        if (request.getBusType() == Bus.BusType.AC) baseMultiplier = 1.5;
        if (request.getBusType() == Bus.BusType.SLEEPER) baseMultiplier = 2.0;

        // Monthly Pass logic: Calculated as 20 single fares for 30 days (UPSRTC MST Standard)
        double estimatedCharge = (route.getTotalDistance() * route.getFarePerKm() * 20) * baseMultiplier;
        
        if (request.getRequestType() == PassRequest.RequestType.SMART_CARD) {
            estimatedCharge = 500.0; // Flat initial load for Smart Cards
        }

        request.setPrice(Math.round(estimatedCharge * 100.0) / 100.0);
        request.setStatus(PassRequest.Status.PENDING);
        return passRequestRepository.save(request);
    }

    public List<PassRequest> getUserRequests(Integer userId) {
        return passRequestRepository.findByUserId(userId);
    }

    public List<PassRequest> getAllPendingRequests() {
        return passRequestRepository.findByStatus(PassRequest.Status.PENDING);
    }

    @Transactional
    public PassRequest updateRequestStatus(Integer id, PassRequest.Status status, String remarks) {
        if (id == null) {
            throw new IllegalArgumentException("Request ID must not be null");
        }
        PassRequest request = passRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        request.setStatus(status);
        request.setRemarks(remarks);
        if (status == PassRequest.Status.APPROVED) {
            request.setApprovedAt(LocalDateTime.now());
        }
        return passRequestRepository.save(request);
    }
}
