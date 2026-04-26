package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.model.Bus;
import com.upsrtc.smartbus.model.Schedule;
import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.model.RouteStop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@SuppressWarnings("null")
public class BusService {

    @Autowired private com.upsrtc.smartbus.repository.ScheduleRepository scheduleRepository;
    @Autowired private com.upsrtc.smartbus.repository.BusRepository busRepository;
    @Autowired private com.upsrtc.smartbus.repository.RouteRepository routeRepository;

    public List<Schedule> searchBuses(String source, String destination, LocalDate date) {
        List<Schedule> results = new java.util.ArrayList<>();
        List<Route> allRoutes = routeRepository.findAll();

        for (Route route : allRoutes) {
            // Find source stop index/order
            RouteStop sourceStop = null;
            if (route.getSource().equalsIgnoreCase(source)) {
                sourceStop = new RouteStop();
                sourceStop.setStopName(route.getSource());
                sourceStop.setStopOrder(0);
                sourceStop.setDistanceFromStart(0.0);
                sourceStop.setDurationFromStart(0);
            } else {
                sourceStop = route.getStops().stream()
                        .filter(s -> s.getStopName().equalsIgnoreCase(source))
                        .findFirst().orElse(null);
            }

            // Find destination stop index/order
            RouteStop destStop = null;
            if (route.getDestination().equalsIgnoreCase(destination)) {
                destStop = new RouteStop();
                destStop.setStopName(route.getDestination());
                destStop.setStopOrder(999); // End of route
                destStop.setDistanceFromStart(route.getTotalDistance());
                destStop.setDurationFromStart(999); // Will calculate later
            } else {
                destStop = route.getStops().stream()
                        .filter(s -> s.getStopName().equalsIgnoreCase(destination))
                        .findFirst().orElse(null);
            }

            // If both stops exist and source is before destination
            if (sourceStop != null && destStop != null && 
                (sourceStop.getStopOrder() < destStop.getStopOrder() || 
                 (sourceStop.getStopOrder() == 0 && destStop.getStopOrder() == 999))) {
                
                // Get all buses assigned to this route
                List<Bus> routeBuses = busRepository.findByRouteIdAndIsActiveTrue(route.getId());
                
                for (Bus bus : routeBuses) {
                    // Check if a schedule already exists for this bus/date
                    Schedule schedule = scheduleRepository.findByBusIdAndDepartureDate(bus.getId(), date)
                            .stream().findFirst().orElse(null);
                    
                    if (schedule == null) {
                        schedule = new Schedule();
                        schedule.setRoute(route);
                        schedule.setBus(bus);
                        schedule.setDepartureDate(date);
                        
                        java.time.LocalTime busStart = bus.getStartTime() != null ? bus.getStartTime() : java.time.LocalTime.of(6, 0);
                        schedule.setDepartureTime(busStart.plusMinutes(sourceStop.getDurationFromStart()));
                        
                        int travelDuration = (destStop.getStopOrder() == 999 ? (int)(route.getTotalDistance() * 2) : destStop.getDurationFromStart()) - sourceStop.getDurationFromStart();
                        schedule.setEstimatedArrivalTime(schedule.getDepartureTime().plusMinutes(Math.max(30, travelDuration)));

                        // Calculate Price (Fare = distance * farePerKm)
                        double distance = destStop.getDistanceFromStart() - sourceStop.getDistanceFromStart();
                        double fare = distance * (route.getFarePerKm() != null ? route.getFarePerKm() : 1.5);
                        schedule.setPrice(Math.max(50.0, Math.round(fare * 1.0) / 1.0));
                        
                        schedule.setStatus(Schedule.Status.ON_TIME);
                        schedule = scheduleRepository.save(schedule);
                    }
                    results.add(schedule);
                }
            }
        }
        
        return results;
    }

    public Schedule getScheduleById(Integer id) {
        return scheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    // ─── Bus Management CRUD ───────────────────────────────────────────────

    public Bus createBus(Bus bus) {
        if (busRepository.existsByBusNumber(bus.getBusNumber())) {
            throw new RuntimeException("Asset Number " + bus.getBusNumber() + " already registered in system.");
        }
        if (bus.getAvailableSeats() == null) bus.setAvailableSeats(bus.getTotalSeats());
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(Integer id) {
        return busRepository.findById(id).orElseThrow(() -> new RuntimeException("Bus not found"));
    }

    public Bus updateBus(Integer id, Bus updated) {
        Bus existing = getBusById(id);
        existing.setBusName(updated.getBusName());
        existing.setBusType(updated.getBusType());
        existing.setTotalSeats(updated.getTotalSeats());
        existing.setStatus(updated.getStatus());
        existing.setIsMultiDeck(updated.getIsMultiDeck());
        return busRepository.save(existing);
    }

    @Autowired private com.upsrtc.smartbus.repository.BookingRepository bookingRepository;
    @Autowired private com.upsrtc.smartbus.repository.PaymentRepository paymentRepository;
    @Autowired private com.upsrtc.smartbus.repository.TripRepository tripRepository;
    @Autowired private com.upsrtc.smartbus.repository.BusLocationRepository busLocationRepository;
    @Autowired private com.upsrtc.smartbus.repository.SeatRepository seatRepository;
    @Autowired private com.upsrtc.smartbus.repository.MaintenanceLogRepository maintenanceLogRepository;
    @Autowired private com.upsrtc.smartbus.repository.FuelLogRepository fuelLogRepository;
    @Autowired private com.upsrtc.smartbus.repository.BusLocationHistoryRepository busLocationHistoryRepository;

    @org.springframework.transaction.annotation.Transactional
    public void deleteBus(Integer id) {
        // 1. Purge Vehicle Vitals (Maintenance & Fuel)
        maintenanceLogRepository.deleteByBusId(id);
        fuelLogRepository.deleteByBusId(id);

        // 2. Purge Telemetry History
        busLocationHistoryRepository.deleteByBusId(id);

        // 3. Purge Live Telemetry
        busLocationRepository.deleteByBusId(id);

        // 4. Purge Seating Map (Operational Dependencies)
        seatRepository.deleteByBusId(id);

        // 5. Purge Payments (via Booking linkage)
        paymentRepository.deleteByBusId(id);

        // 6. Purge Bookings (via Schedule linkage)
        bookingRepository.deleteByBusId(id);

        // 7. Purge Trips
        tripRepository.deleteByBusId(id);

        // 8. Purge Schedules
        scheduleRepository.deleteByBusId(id);

        // 9. Delete the Bus Asset
        busRepository.deleteById(id);
    }

    public Bus updateStatus(Integer id, Bus.Status status) {
        Bus bus = getBusById(id);
        bus.setStatus(status);
        return busRepository.save(bus);
    }
}



