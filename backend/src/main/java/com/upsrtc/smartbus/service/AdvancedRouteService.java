package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.model.RouteStop;
import com.upsrtc.smartbus.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class AdvancedRouteService {

    @Autowired
    private RouteRepository routeRepository;

    public Route createRoute(Route routeRequest) {
        routeRequest.setIsActive(true);
        if (routeRequest.getStops() != null) {
            for (RouteStop stop : routeRequest.getStops()) {
                stop.setRoute(routeRequest);
            }
        }
        return routeRepository.save(routeRequest);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Optional<Route> getRouteById(Integer id) {
        return routeRepository.findById(id);
    }

    @Autowired
    private com.upsrtc.smartbus.repository.TripRepository tripRepository;
    
    @Autowired
    private com.upsrtc.smartbus.repository.ScheduleRepository scheduleRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.PassRequestRepository passRequestRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.BookingRepository bookingRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.BusLocationRepository busLocationRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.PaymentRepository paymentRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.StopRepository stopRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.RoutePolylineRepository routePolylineRepository;

    @org.springframework.transaction.annotation.Transactional
    public void deleteRoute(Integer id) {
        // 1. Purge legacy GIS Polylines
        routePolylineRepository.deleteByRouteId(id);

        // 2. Purge legacy 'stops' table records (Ghost Dependencies)
        stopRepository.deleteByRouteId(id);
        
        // 3. Purge dependent Pass Applications
        passRequestRepository.deleteByRouteId(id);
        
        // 4. Deep Purge: Live Telemetry for the route
        busLocationRepository.deleteByRouteId(id);
        
        // 5. Deep Purge: Billing records for the route
        paymentRepository.deleteByRouteId(id);
        
        // 6. Purge dependent Bookings (via Schedule linkage)
        bookingRepository.deleteByRouteId(id);
        
        // 7. Purge dependent Live Trips
        tripRepository.deleteByRouteId(id);
        
        // 8. Purge dependent Schedules
        scheduleRepository.deleteByRouteId(id);
        
        // 9. Delete parent Route (Cascade handle RouteStops)
        routeRepository.deleteById(id);
    }
}
