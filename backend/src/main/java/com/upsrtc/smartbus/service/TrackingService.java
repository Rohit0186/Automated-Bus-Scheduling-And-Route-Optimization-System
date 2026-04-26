package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.dto.LiveTrackingDTO;
import com.upsrtc.smartbus.dto.StopDTO;
import com.upsrtc.smartbus.dto.TrackingInfo;
import com.upsrtc.smartbus.model.*;
import com.upsrtc.smartbus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@SuppressWarnings("null")
public class TrackingService {

    @Autowired
    private BusLocationRepository busLocationRepository;

    @Autowired
    private BusRepository busRepository;


    @Autowired
    private RouteStopRepository routeStopRepository;

    @Autowired
    private RoutePolylineRepository routePolylineRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private BusLocationHistoryRepository historyRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // In-memory simulation state: scheduleId -> current polyline index
    private final Map<Integer, Integer> simulationIndex = new ConcurrentHashMap<>();

    // Keep track of which schedule triggered a "Arrival" notification so we don't spam it
    private final Map<String, Boolean> notificationSentMap = new ConcurrentHashMap<>();

    private static final double DEFAULT_SPEED_KMH = 40.0;
    private static final double GEOFENCE_RADIUS_KM = 0.2; // 200 meters

    // ================================================================
    // LIVE TRACKING - Full DTO for a schedule
    // ================================================================
    public LiveTrackingDTO getLiveTracking(Integer scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElse(null);
        if (schedule == null) return createDefaultDTO(scheduleId);

        Bus bus = schedule.getBus();
        List<BusLocation> locs = busLocationRepository.findAllByScheduleId(scheduleId);
        Optional<BusLocation> locOpt = locs.isEmpty() ? Optional.empty() : Optional.of(locs.get(0));

        if (locOpt.isEmpty() && bus != null) {
            List<BusLocation> busLocs = busLocationRepository.findByBusId(bus.getId());
            locOpt = busLocs.isEmpty() ? Optional.empty() : Optional.of(busLocs.get(0));
        }

        double currentLat = schedule.getRoute() != null ? getFirstStopLat(schedule) : 26.8521;
        double currentLng = schedule.getRoute() != null ? getFirstStopLng(schedule) : 80.9363;
        double speed = DEFAULT_SPEED_KMH;

        if (locOpt.isPresent()) {
            BusLocation loc = locOpt.get();
            currentLat = loc.getLatitude() != null ? loc.getLatitude() : currentLat;
            currentLng = loc.getLongitude() != null ? loc.getLongitude() : currentLng;
            speed = loc.getSpeed() != null ? loc.getSpeed() : DEFAULT_SPEED_KMH;
        }

        List<RouteStop> routeStops = routeStopRepository.findByRouteIdOrderByStopOrderAsc(schedule.getRoute().getId());
        List<StopDTO> stopDTOs = buildStopDTOs(routeStops, currentLat, currentLng, speed);
        List<double[]> polyline = buildPolyline(schedule.getRoute().getId());

        String currentStop = "En Route";
        String nextStop = "Destination";
        long etaMinutes = 0;
        int nearestIdx = findNearestStopIndex(routeStops, currentLat, currentLng);

        if (!routeStops.isEmpty()) {
            if (nearestIdx >= 0 && nearestIdx < routeStops.size()) {
                RouteStop s = routeStops.get(nearestIdx);
                double sLat = s.getLatitude() != null ? s.getLatitude() : 0.0;
                double sLng = s.getLongitude() != null ? s.getLongitude() : 0.0;
                double distToNearest = calculateDistance(currentLat, currentLng, sLat, sLng);
                
                // Geofencing: if within radius, we are AT the stop
                if (distToNearest <= GEOFENCE_RADIUS_KM) {
                    currentStop = s.getStopName();
                    if (nearestIdx + 1 < routeStops.size()) {
                        nextStop = routeStops.get(nearestIdx + 1).getStopName();
                        RouteStop next = routeStops.get(nearestIdx + 1);
                        double nLat = next.getLatitude() != null ? next.getLatitude() : 0.0;
                        double nLng = next.getLongitude() != null ? next.getLongitude() : 0.0;
                        double distNext = calculateDistance(currentLat, currentLng, nLat, nLng);
                        etaMinutes = Math.round((distNext / speed) * 60);
                    } else {
                        nextStop = "None"; // At terminal
                    }
                } else {
                    // We are between stops
                    currentStop = "Between "+(nearestIdx > 0 ? routeStops.get(nearestIdx-1).getStopName() : "Origin") +" and "+s.getStopName();
                    nextStop = s.getStopName();
                    etaMinutes = Math.round((distToNearest / speed) * 60);
                }
            }
        }

        // Advanced ETA Delay factor calculation (pseudo-traffic integration)
        String status = "ON_TIME";
        String delayInfo = "";
        if (schedule.getDepartureTime() != null) {
            LocalTime expectedArrival = schedule.getDepartureTime().plusMinutes(estimateTotalMinutes(schedule));
            LocalTime predictedNow = LocalTime.now().plusMinutes(etaMinutes);
            
            // Simulating a traffic multiplier logic
            if (speed < 20.0) {
                etaMinutes = (long)(etaMinutes * 1.5);
                status = "DELAYED";
                delayInfo = "Heavy traffic detected. Speed " + Math.round(speed) + " km/h.";
            } else if (predictedNow.isAfter(expectedArrival.plusMinutes(10))) {
                status = "DELAYED";
                delayInfo = "~" + etaMinutes + " min behind schedule";
            }
        }

        LiveTrackingDTO dto = new LiveTrackingDTO();
        dto.setBusId(bus != null ? bus.getId() : 0);
        dto.setBusNumber(bus != null ? bus.getBusNumber() : "Unknown");
        dto.setScheduleId(scheduleId);
        dto.setCurrentLat(currentLat);
        dto.setCurrentLng(currentLng);
        dto.setSpeed(speed);
        dto.setCurrentStop(currentStop);
        dto.setNextStop(nextStop);
        dto.setEtaMinutes(etaMinutes);
        dto.setStatus(status);
        dto.setDelayInfo(delayInfo);
        dto.setRouteStops(stopDTOs);
        dto.setPolyline(polyline);
        dto.setTimestamp(System.currentTimeMillis());

        return dto;
    }

    public List<LiveTrackingDTO> getAllActiveBuses() {
        List<BusLocation> activeLocations = busLocationRepository.findAllByTripStatus(BusLocation.TripStatus.ONGOING);
        List<LiveTrackingDTO> result = new ArrayList<>();
        for (BusLocation loc : activeLocations) {
            if (loc.getScheduleId() != null) {
                try {
                    result.add(getLiveTracking(loc.getScheduleId()));
                } catch (Exception ignored) {}
            }
        }
        return result;
    }

    public List<Object> getTrackingByBusNumber(String busNumber) {
        List<Bus> buses = busRepository.findByBusNumberContainingIgnoreCase(busNumber);
        if (buses.isEmpty()) {
            throw new RuntimeException("No bus found matching: " + busNumber);
        }

        List<Object> result = new ArrayList<>();
        for (Bus bus : buses) {
            List<BusLocation> locs = busLocationRepository.findByBusId(bus.getId());
            Optional<BusLocation> locOpt = locs.isEmpty() ? Optional.empty() : Optional.of(locs.get(0));

            if (locOpt.isPresent() && locOpt.get().getScheduleId() != null && locOpt.get().getTripStatus() == BusLocation.TripStatus.ONGOING) {
                result.add(getLiveTracking(locOpt.get().getScheduleId()));
            } else {
                Map<String, Object> inactive = new HashMap<>();
                inactive.put("busNumber", bus.getBusNumber());
                inactive.put("status", "INACTIVE");
                inactive.put("message", "Bus is not currently running");
                
                Map<String, Double> location = new HashMap<>();
                location.put("lat", locOpt.map(BusLocation::getLatitude).orElse(26.8521));
                location.put("lng", locOpt.map(BusLocation::getLongitude).orElse(80.9363));
                inactive.put("lastKnownLocation", location);
                
                result.add(inactive);
            }
        }
        return result;
    }

    public List<BusLocationHistory> getTripPlayback(Integer scheduleId) {
        return historyRepository.findByScheduleIdOrderByRecordedAtAsc(scheduleId);
    }

    // ================================================================
    // UPDATE LOCATION & BROADCAST
    // ================================================================
    public void updateLocation(Integer busId, Integer scheduleId, Double lat, Double lng) {
        BusLocation loc = null;
        if (scheduleId != null) {
            List<BusLocation> locs = busLocationRepository.findAllByScheduleId(scheduleId);
            if (!locs.isEmpty()) {
                loc = locs.get(0);
                if (locs.size() > 1) {
                    // Cleanup duplicates if any
                    for (int i = 1; i < locs.size(); i++) busLocationRepository.delete(locs.get(i));
                }
            }
        } else {
            List<BusLocation> locs = busLocationRepository.findByBusId(busId);
            if (!locs.isEmpty()) loc = locs.get(0);
        }
        
        if (loc == null) loc = new BusLocation();

        if (loc.getId() == null) {
            Bus bus = busRepository.findById(busId).orElse(null);
            if (bus == null) return;
            loc.setBus(bus);
            loc.setTripStatus(BusLocation.TripStatus.ONGOING);
        }

        // Calculate dynamic speed based on previous location
        double currentSpeed = DEFAULT_SPEED_KMH;
        if (loc.getLatitude() != null && loc.getLongitude() != null) {
            // Simulate random traffic variance (between 10 km/h to 60 km/h) to show Delay algorithms
            currentSpeed = Math.max(10.0, Math.min(60.0, 40.0 + (Math.random() * 20 - 10)));
        }

        loc.setScheduleId(scheduleId);
        loc.setLatitude(lat);
        loc.setLongitude(lng);
        loc.setSpeed(currentSpeed);
        loc.setLastUpdated(java.time.LocalDateTime.now());

        busLocationRepository.save(loc);

        if (scheduleId != null) {
            // Save to history for Playback
            BusLocationHistory history = new BusLocationHistory();
            history.setScheduleId(scheduleId);
            history.setBusId(busId);
            history.setLatitude(lat);
            history.setLongitude(lng);
            history.setSpeed(currentSpeed);
            historyRepository.save(history);

            // Fetch live DTO for WS broadcast
            LiveTrackingDTO dto = getLiveTracking(scheduleId);

            // Geofencing Notification trigger
            triggerGeofenceNotifications(scheduleId, dto);

            // BROADCAST -> Single vehicle updates
            messagingTemplate.convertAndSend("/topic/tracking/" + scheduleId, dto);
            messagingTemplate.convertAndSend("/topic/bus-location/" + busId, dto);

            // BROADCAST -> Admin map update
            messagingTemplate.convertAndSend("/topic/admin/active-buses", getAllActiveBuses());
        }
    }

    private void triggerGeofenceNotifications(Integer scheduleId, LiveTrackingDTO dto) {
        String stopIdEvent = scheduleId + "_" + dto.getNextStop();
        
        // If ETA is <= 2 mins to next stop, send notification via WS
        if (dto.getEtaMinutes() <= 2 && !notificationSentMap.containsKey(stopIdEvent + "_arriving")) {
            Map<String, String> notif = new HashMap<>();
            notif.put("message", "Bus " + dto.getBusNumber() + " is arriving at " + dto.getNextStop() + " in " + dto.getEtaMinutes() + " mins!");
            notif.put("type", "INFO");
            messagingTemplate.convertAndSend("/topic/notifications/" + scheduleId, notif);
            notificationSentMap.put(stopIdEvent + "_arriving", true);
        }

        if (dto.getStatus().equals("DELAYED") && !notificationSentMap.containsKey(stopIdEvent + "_delayed")) {
            Map<String, String> notif = new HashMap<>();
            notif.put("message", "Delay Detected: " + dto.getDelayInfo());
            notif.put("type", "WARNING");
            messagingTemplate.convertAndSend("/topic/notifications/" + scheduleId, notif);
            notificationSentMap.put(stopIdEvent + "_delayed", true);
        }
    }

    public void startTrip(Integer busId, Integer scheduleId) {
        List<BusLocation> locs = busLocationRepository.findAllByScheduleId(scheduleId);
        BusLocation loc = locs.isEmpty() ? new BusLocation() : locs.get(0);
        loc.setBus(busRepository.findById(busId).orElseThrow());
        loc.setScheduleId(scheduleId);
        loc.setTripStatus(BusLocation.TripStatus.ONGOING);
        busLocationRepository.save(loc);

        // Also create/update Trip entity if exists
        List<Trip> activeTrips = tripRepository.findByBusBusNumberAndStatus(loc.getBus().getBusNumber(), Trip.TripStatus.ONGOING);
        if (activeTrips.isEmpty()) {
            Trip trip = new Trip();
            trip.setBus(loc.getBus());
            trip.setStatus(Trip.TripStatus.ONGOING);
            trip.setScheduleId(scheduleId);
            trip.setStartTime(java.time.LocalDateTime.now());
            // Lookup route from schedule
            scheduleRepository.findById(scheduleId).ifPresent(s -> trip.setRoute(s.getRoute()));
            tripRepository.save(trip);
        }
    }

    public void endTrip(Integer busId, Integer scheduleId) {
        List<BusLocation> locs = busLocationRepository.findByScheduleId(scheduleId);
        if (!locs.isEmpty()) {
            BusLocation loc = locs.get(0);
            loc.setTripStatus(BusLocation.TripStatus.COMPLETED);
            busLocationRepository.save(loc);
            
            List<Trip> activeTrips = tripRepository.findByBusBusNumberAndStatus(loc.getBus().getBusNumber(), Trip.TripStatus.ONGOING);
            activeTrips.forEach(t -> {
                t.setStatus(Trip.TripStatus.COMPLETED);
                t.setEndTime(java.time.LocalDateTime.now());
                tripRepository.save(t);
                simulationIndex.remove(t.getId());
            });
        }
    }

    // ================================================================
    // SIMULATION - Background task
    // ================================================================

    @Autowired
    private TripRepository tripRepository;

    @Scheduled(fixedRate = 3000)
    public void simulateAllOngoingBuses() {
        List<Trip> ongoing = tripRepository.findByStatus(Trip.TripStatus.ONGOING);
        for (Trip trip : ongoing) {
            try {
                processTripSimulation(trip);
            } catch (Exception e) {
                System.err.println("Simulation Error for Trip " + trip.getId() + ": " + e.getMessage());
            }
        }
    }

    private void processTripSimulation(Trip trip) {
        Integer busId = trip.getBus().getId();
        List<RouteStop> stops = routeStopRepository.findByRouteIdOrderByStopOrderAsc(trip.getRoute().getId());
        if (stops.isEmpty()) return;

        int currentStep = simulationIndex.getOrDefault(trip.getId(), 0);
        
        // Final destination reached
        if (currentStep >= stops.size() - 1) {
            trip.setStatus(Trip.TripStatus.COMPLETED);
            trip.setEndTime(java.time.LocalDateTime.now());
            tripRepository.save(trip);
            simulationIndex.remove(trip.getId());
            return;
        }

        RouteStop currentStop = stops.get(currentStep);
        RouteStop nextStop = stops.get(currentStep + 1);

        // Simple interpolation: in a real system we'd use polyline points.
        // For this 3s simulation, we'll just move 20% of the way each time
        // to make it look smooth over 5 intervals between stops.
        int subStep = simulationIndex.getOrDefault(trip.getId() + 1000000, 0); // Hacky sub-step key
        double ratio = (subStep + 1) / 5.0;

        double currentLat = currentStop.getLatitude() != null ? currentStop.getLatitude() : 26.8467;
        double currentLng = currentStop.getLongitude() != null ? currentStop.getLongitude() : 80.9462;
        double nextLat = nextStop.getLatitude() != null ? nextStop.getLatitude() : currentLat;
        double nextLng = nextStop.getLongitude() != null ? nextStop.getLongitude() : currentLng;

        double lat = currentLat + (nextLat - currentLat) * ratio;
        double lng = currentLng + (nextLng - currentLng) * ratio;

        // Use unified updateLocation to trigger full DTO broadcast and geofencing
        updateLocation(busId, trip.getScheduleId(), lat, lng);

        if (subStep >= 4) {
            simulationIndex.put(trip.getId(), currentStep + 1);
            simulationIndex.put(trip.getId() + 1000000, 0);
        } else {
            simulationIndex.put(trip.getId() + 1000000, subStep + 1);
        }
    }

    public TrackingInfo getTrackingInfo(Integer busId, Integer routeStopId) {
        List<BusLocation> locs = busLocationRepository.findByBusId(busId);
        RouteStop stop = routeStopRepository.findById(routeStopId).orElseThrow();
        if (locs.isEmpty()) return new TrackingInfo(stop.getStopName(), 0.0, 0.0, "N/A", 0.0, "UNKNOWN");
        BusLocation busLoc = locs.get(0);
        double distance = calculateDistance(busLoc.getLatitude(), busLoc.getLongitude(), stop.getLatitude(), stop.getLongitude());
        double hours = distance / DEFAULT_SPEED_KMH;
        return new TrackingInfo(stop.getStopName(), busLoc.getLatitude(), busLoc.getLongitude(), (int)(hours * 60) + " mins", distance, "ON_TIME");
    }

    public List<TrackingInfo> getIncomingBuses(Integer routeStopId) {
        List<TrackingInfo> incoming = new ArrayList<>();
        busLocationRepository.findAllByTripStatus(BusLocation.TripStatus.ONGOING).forEach(loc -> {
            try {
                if (loc.getScheduleId() != null) {
                    Schedule sch = scheduleRepository.findById(loc.getScheduleId()).orElse(null);
                    if (sch != null && routeStopRepository.findByRouteIdOrderByStopOrderAsc(sch.getRoute().getId()).stream().anyMatch(rs -> rs.getId().equals(routeStopId))) {
                        incoming.add(getTrackingInfo(loc.getBus().getId(), routeStopId));
                    }
                }
            } catch (Exception ignored) {}
        });
        return incoming;
    }

    private List<StopDTO> buildStopDTOs(List<RouteStop> routeStops, double busLat, double busLng, double speed) {
        List<StopDTO> result = new ArrayList<>();
        int nearestIdx = findNearestStopIndex(routeStops, busLat, busLng);

        for (int i = 0; i < routeStops.size(); i++) {
            RouteStop rs = routeStops.get(i);
            double rLat = rs.getLatitude() != null ? rs.getLatitude() : 0.0;
            double rLng = rs.getLongitude() != null ? rs.getLongitude() : 0.0;
            double dist = calculateDistance(busLat, busLng, rLat, rLng);
            long eta = Math.round((dist / speed) * 60);

            StopDTO dto = new StopDTO();
            dto.setStopId(rs.getId());
            dto.setStopName(rs.getStopName());
            dto.setLatitude(rLat);
            dto.setLongitude(rLng);
            dto.setStopOrder(rs.getStopOrder());
            dto.setEtaMinutes(eta);
            
            // Geofencing checking to mark "Passed" dynamically
            boolean isPassed = i < nearestIdx;
            boolean isCurrent = false;
            boolean isNext = false;
            
            if (i == nearestIdx && dist <= GEOFENCE_RADIUS_KM) {
                isCurrent = true;
                isPassed = false;
            } else if (i == nearestIdx) {
                isNext = true;
            } else if (i == nearestIdx + 1 && dist > GEOFENCE_RADIUS_KM) {
                // If nearest was behind us
                isNext = true;
            }

            dto.setCurrentStop(isCurrent);
            dto.setNextStop(isNext);
            dto.setPassed(isPassed);
            result.add(dto);
        }
        return result;
    }

    private List<double[]> buildPolyline(Integer routeId) {
        List<double[]> result = new ArrayList<>();
        routePolylineRepository.findByRouteIdOrderByPointOrderAsc(routeId)
            .forEach(p -> result.add(new double[]{p.getLatitude(), p.getLongitude()}));
        return result;
    }

    private int findNearestStopIndex(List<RouteStop> stops, double lat, double lng) {
        if (stops == null || stops.isEmpty()) return -1;
        int nearest = 0;
        double minDist = Double.MAX_VALUE;
        for (int i = 0; i < stops.size(); i++) {
            RouteStop s = stops.get(i);
            if (s.getLatitude() == null || s.getLongitude() == null) continue;
            double dist = calculateDistance(lat, lng, s.getLatitude(), s.getLongitude());
            if (dist < minDist) {
                minDist = dist;
                nearest = i;
            }
        }
        return nearest;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private long estimateTotalMinutes(Schedule schedule) {
        if (schedule.getDepartureTime() != null && schedule.getEstimatedArrivalTime() != null) {
            return java.time.Duration.between(schedule.getDepartureTime(), schedule.getEstimatedArrivalTime()).toMinutes();
        }
        return 120;
    }

    private double getFirstStopLat(Schedule schedule) { return routeStopRepository.findByRouteIdOrderByStopOrderAsc(schedule.getRoute().getId()).stream().findFirst().map(rs -> rs.getLatitude() != null ? rs.getLatitude() : 26.8521).orElse(26.8521); }
    private double getFirstStopLng(Schedule schedule) { return routeStopRepository.findByRouteIdOrderByStopOrderAsc(schedule.getRoute().getId()).stream().findFirst().map(rs -> rs.getLongitude() != null ? rs.getLongitude() : 80.9363).orElse(80.9363); }
    private LiveTrackingDTO createDefaultDTO(Integer scheduleId) {
        LiveTrackingDTO dto = new LiveTrackingDTO();
        dto.setScheduleId(scheduleId);
        dto.setCurrentLat(26.8521);
        dto.setCurrentLng(80.9363);
        dto.setStatus("UNKNOWN");
        dto.setCurrentStop("N/A");
        dto.setNextStop("N/A");
        dto.setRouteStops(new ArrayList<>());
        dto.setPolyline(new ArrayList<>());
        return dto;
    }
}



