package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.model.*;
import com.upsrtc.smartbus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;


@Service
public class DataBootstrapService {

    @Autowired private BusRepository busRepository;
    @Autowired private RouteRepository routeRepository;
    @Autowired private RouteStopRepository routeStopRepository;
    @Autowired private StationRepository stationRepository;
    @Autowired private SeatService seatService;
    @Autowired private ConductorRepository conductorRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private ScheduleRepository scheduleRepository;
    @Autowired private BusScheduleService busScheduleService;


    private Driver defaultDriver;
    private Conductor defaultConductor;
    @Autowired private UserRepository userRepository;
    @Autowired private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Transactional
    public void bootstrap() {
        System.out.println(">>> BOOTSTRAP STARTING - SYNCHRONIZING SYSTEM DATA...");
        ensureAdminUser();
        initPersonnel();

        // 2. CREATE BUSES
        Bus b1 = createBus("UP32-LS-1001", "Lucknow Express", Bus.BusType.AC, 40);
        Bus b2 = createBus("UP32-AZ-2002", "JanSafar Ayodhya", Bus.BusType.NON_AC, 50);
        Bus b3 = createBus("UP42-VB-3003", "Varanasi Volvo", Bus.BusType.SLEEPER, 30);
        Bus b4 = createBus("UP32-KG-4004", "Kanpur Gati", Bus.BusType.AC, 45);
        Bus b5 = createBus("UP16-DL-5005", "Delhi Rajdhani", Bus.BusType.AC, 40);
        Bus b6 = createBus("UP70-PJ-6006", "Prayagraj Mail", Bus.BusType.NON_AC, 55);

        // 3. CREATE ROUTES
        
        // --- ROUTE 1: LUCKNOW TO KANPUR ---
        Route r1 = createRoute("Lucknow-Kanpur Highway", "Lucknow", "Kanpur", 1.0, 90.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r1.getId()).isEmpty()) {
            addStop(r1, "Lucknow (Charbagh)", 1, 0.0, 0, "08:00 AM", "08:10 AM");
            addStop(r1, "Amausi Airport", 2, 12.0, 20, "08:30 AM", "08:35 AM");
            addStop(r1, "Unnao", 3, 60.0, 75, "09:25 AM", "09:30 AM");
            addStop(r1, "Kanpur Central", 4, 90.0, 110, "10:10 AM", "FINAL");
        }

        // --- ROUTE 2: LUCKNOW TO GORAKHPUR ---
        Route r2 = createRoute("Gorakhpur Express Way", "Lucknow", "Gorakhpur", 1.0, 275.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r2.getId()).isEmpty()) {
            addStop(r2, "Lucknow (Alambagh)", 1, 0.0, 0, "07:00 AM", "07:15 AM");
            addStop(r2, "Barabanki", 2, 30.0, 45, "08:00 AM", "08:05 AM");
            addStop(r2, "Ayodhya", 3, 135.0, 180, "10:15 AM", "10:30 AM");
            addStop(r2, "Basti", 4, 205.0, 270, "11:45 AM", "11:55 AM");
            addStop(r2, "Gorakhpur", 5, 275.0, 360, "01:30 PM", "FINAL");
        }

        // --- ROUTE 3: LUCKNOW TO VARANASI ---
        Route r3 = createRoute("Kashi Connect", "Lucknow", "Varanasi", 1.0, 300.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r3.getId()).isEmpty()) {
            addStop(r3, "Lucknow (Alambagh)", 1, 0.0, 0, "06:00 AM", "06:15 AM");
            addStop(r3, "Haidergarh", 2, 60.0, 75, "07:30 AM", "07:35 AM");
            addStop(r3, "Sultanpur", 3, 140.0, 160, "09:10 AM", "09:25 AM");
            addStop(r3, "Jaunpur", 4, 235.0, 260, "11:05 AM", "11:15 AM");
            addStop(r3, "Varanasi", 5, 300.0, 340, "12:45 PM", "FINAL");
        }

        // --- ROUTE 4: LUCKNOW TO DELHI ---
        Route r4 = createRoute("National Capital Route", "Lucknow", "Delhi", 1.0, 530.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r4.getId()).isEmpty()) {
            addStop(r4, "Lucknow (Alambagh)", 1, 0.0, 0, "09:00 PM", "09:15 PM");
            addStop(r4, "Kannauj", 2, 125.0, 140, "11:35 PM", "11:45 PM");
            addStop(r4, "Agra", 3, 330.0, 330, "03:00 AM", "03:20 AM");
            addStop(r4, "Noida", 4, 510.0, 510, "06:15 AM", "06:25 AM");
            addStop(r4, "Delhi (ISBT)", 5, 530.0, 560, "07:15 AM", "FINAL");
        }

        // --- ROUTE 5: LUCKNOW TO PRAYAGRAJ ---
        Route r5 = createRoute("Triveni Sangam", "Lucknow", "Prayagraj", 1.0, 200.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r5.getId()).isEmpty()) {
            addStop(r5, "Lucknow (Alambagh)", 1, 0.0, 0, "06:00 AM", "06:15 AM");
            addStop(r5, "Raebareli", 2, 80.0, 100, "08:00 AM", "08:15 AM");
            addStop(r5, "Kunda", 3, 150.0, 180, "09:45 AM", "09:55 AM");
            addStop(r5, "Prayagraj", 4, 200.0, 240, "11:00 AM", "FINAL");
        }

        // --- NEW ROUTE 6: GORAKHPUR TO LUCKNOW ---
        Route r6 = createRoute("Awadh Express", "Gorakhpur", "Lucknow", 1.0, 275.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r6.getId()).isEmpty()) {
            addStop(r6, "Gorakhpur", 1, 0.0, 0, "02:00 PM", "02:15 PM");
            addStop(r6, "Basti", 2, 70.0, 80, "03:35 PM", "03:45 PM");
            addStop(r6, "Ayodhya", 3, 140.0, 160, "05:25 PM", "05:40 PM");
            addStop(r6, "Barabanki", 4, 245.0, 300, "07:40 PM", "07:50 PM");
            addStop(r6, "Lucknow (Alambagh)", 5, 275.0, 340, "08:45 PM", "FINAL");
        }

        // --- NEW ROUTE 7: DEORIA TO GORAKHPUR ---
        Route r7 = createRoute("Deoria Local", "Deoria", "Gorakhpur", 1.0, 50.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r7.getId()).isEmpty()) {
            addStop(r7, "Deoria", 1, 0.0, 0, "09:00 AM", "09:10 AM");
            addStop(r7, "Chauri Chaura", 2, 30.0, 40, "09:50 AM", "10:00 AM");
            addStop(r7, "Gorakhpur", 3, 50.0, 70, "10:30 AM", "FINAL");
        }

        // --- NEW ROUTE 8: GREATER NOIDA TO MATHURA ---
        Route r8 = createRoute("Yamuna Expressway Link", "Greater Noida", "Mathura", 1.0, 110.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r8.getId()).isEmpty()) {
            addStop(r8, "Greater Noida", 1, 0.0, 0, "07:00 AM", "07:10 AM");
            addStop(r8, "Jewar", 2, 40.0, 45, "07:55 AM", "08:05 AM");
            addStop(r8, "Mathura", 3, 110.0, 120, "09:30 AM", "FINAL");
        }

        // --- NEW ROUTE 9: LUCKNOW TO AGRA ---
        Route r9 = createRoute("Taj Expressway Route", "Lucknow", "Agra", 1.0, 330.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r9.getId()).isEmpty()) {
            addStop(r9, "Lucknow", 1, 0.0, 0, "06:00 AM", "06:15 AM");
            addStop(r9, "Kannauj", 2, 125.0, 140, "08:35 AM", "08:45 AM");
            addStop(r9, "Etawah", 3, 210.0, 240, "10:45 AM", "11:00 AM");
            addStop(r9, "Agra", 4, 330.0, 360, "01:00 PM", "FINAL");
        }

        // --- NEW ROUTE 10: LUCKNOW TO BAREILLY ---
        Route r10 = createRoute("Rohilkhand Connect", "Lucknow", "Bareilly", 1.0, 250.0);
        if (routeStopRepository.findByRouteIdOrderByStopOrderAsc(r10.getId()).isEmpty()) {
            addStop(r10, "Lucknow", 1, 0.0, 0, "05:00 AM", "05:15 AM");
            addStop(r10, "Sitapur", 2, 85.0, 100, "06:55 AM", "07:05 AM");
            addStop(r10, "Shahjahanpur", 3, 175.0, 200, "08:45 AM", "09:00 AM");
            addStop(r10, "Bareilly", 4, 250.0, 300, "10:45 AM", "FINAL");
        }

        // 4. ASSIGN BUSES AND GENERATE SCHEDULES
        assignBusToRoute(b1, r1, LocalTime.of(8, 0));
        assignBusToRoute(b4, r1, LocalTime.of(14, 0));
        assignBusToRoute(b2, r2, LocalTime.of(7, 0));
        assignBusToRoute(b3, r3, LocalTime.of(6, 0));
        assignBusToRoute(b5, r4, LocalTime.of(21, 0));
        assignBusToRoute(b6, r5, LocalTime.of(6, 0));
        
        // Add more bus assignments for new routes
        Bus b7 = createBus("UP53-GR-7007", "Gorakhpur Pride", Bus.BusType.AC, 45);
        assignBusToRoute(b7, r6, LocalTime.of(14, 0));
        
        Bus b8 = createBus("UP52-DR-8008", "Deoria Express", Bus.BusType.NON_AC, 50);
        assignBusToRoute(b8, r7, LocalTime.of(9, 0));
        
        Bus b9 = createBus("UP16-GN-9009", "Noida Mathura Link", Bus.BusType.AC, 40);
        assignBusToRoute(b9, r8, LocalTime.of(7, 0));

        System.out.println(">>> BOOTSTRAP COMPLETE. FULL REGIONAL DATASET READY.");
        System.out.println(">>> Total Buses in DB: " + busRepository.count());
        System.out.println(">>> Total Routes in DB: " + routeRepository.count());
        System.out.println(">>> Total Users in DB: " + userRepository.count());
    }

    private void initPersonnel() {
        if (driverRepository.count() == 0) {
            User dUser = userRepository.findByUsername("driver").orElseGet(() -> {
                User u = new User();
                u.setUsername("driver");
                u.setPassword(passwordEncoder.encode("driver123"));
                u.setFullName("Ramesh Kumar (Expert)");
                u.setRole(User.Role.DRIVER);
                return userRepository.save(u);
            });
            Driver d = new Driver();
            d.setUser(dUser);
            d.setLicenseNumber("UP32-DL-2024-001");
            d.setPhone("9876543210");
            defaultDriver = driverRepository.save(d);
        } else {
            defaultDriver = driverRepository.findAll().get(0);
        }

        if (conductorRepository.count() == 0) {
            Conductor c = new Conductor();
            c.setName("Suresh Singh (Smart Conductor)");
            c.setPhone("9988776655");
            defaultConductor = conductorRepository.save(c);
        } else {
            defaultConductor = conductorRepository.findAll().get(0);
        }
    }

    private void ensureAdminUser() {
        Optional<User> adminOpt = userRepository.findByUsername("admin");
        User admin;
        if (adminOpt.isPresent()) {
            admin = adminOpt.get();
        } else {
            admin = new User();
            admin.setUsername("admin");
            admin.setRole(User.Role.ADMIN);
        }
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@jansafar.com");
        admin.setFullName("System Administrator");
        userRepository.save(admin);
        System.out.println("[BOOTSTRAP] >>> ROOT ADMIN SYNCHRONIZED (admin/admin123)");
    }

    private Bus createBus(String num, String name, Bus.BusType type, int seats) {
        return busRepository.findByBusNumber(num).orElseGet(() -> {
            Bus b = new Bus();
            b.setBusNumber(num);
            b.setBusName(name);
            b.setBusType(type);
            b.setTotalSeats(seats);
            b.setStatus(Bus.Status.ACTIVE);
            b.setIsActive(true);
            b.setStartTime(LocalTime.of(6, 0));
            b = busRepository.save(b);
            seatService.autoGenerateSeats(b.getId());
            return b;
        });
    }

    private Route createRoute(String name, String src, String dest, double fare, double dist) {
        return routeRepository.findAll().stream()
            .filter(r -> r.getRouteName().equals(name))
            .findFirst()
            .orElseGet(() -> {
                Route r = new Route();
                r.setRouteName(name);
                r.setSource(src);
                r.setDestination(dest);
                r.setFarePerKm(fare);
                r.setTotalDistance(dist);
                r.setIsActive(true);
                return routeRepository.save(r);
            });
    }

    private void addStop(Route r, String name, int order, double dist, int duration, String arrTime, String depTime) {
        RouteStop s = new RouteStop();
        s.setRoute(r);
        s.setStopName(name);
        s.setStopOrder(order);
        s.setDistanceFromStart(dist);
        s.setDurationFromStart(duration);
        s.setArrivalTime(arrTime);
        s.setDepartureTime(depTime);
        
        Station st;
        List<Station> existing = stationRepository.findByNameIgnoreCase(name);
        if (existing.isEmpty()) {
            st = new Station();
            st.setName(name);
            st.setLatitude(26.8 + (Math.random() * 0.1));
            st.setLongitude(80.9 + (Math.random() * 0.1));
            st = stationRepository.save(st);
        } else {
            st = existing.get(0);
        }
        s.setLatitude(st.getLatitude());
        s.setLongitude(st.getLongitude());
        RouteStop saved = routeStopRepository.save(s);
        if (r.getStops() == null) r.setStops(new java.util.ArrayList<>());
        r.getStops().add(saved);
    }

    private void assignBusToRoute(Bus b, Route r, LocalTime start) {
        b.setRoute(r);
        b.setStartTime(start);
        busRepository.save(b);
        busScheduleService.generateSchedulesForBus(b, r, LocalDate.now(), 7);
        createLegacySchedules(b, r);
    }

    private void createLegacySchedules(Bus b, Route r) {
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 7; i++) {
            LocalDate date = today.plusDays(i);
            if (scheduleRepository.findByBusIdAndDepartureDate(b.getId(), date).isEmpty()) {
                Schedule s = new Schedule();
                s.setBus(b);
                s.setRoute(r);
                s.setDriver(defaultDriver);
                s.setConductor(defaultConductor);
                s.setDepartureDate(date);
                s.setDepartureTime(b.getStartTime() != null ? b.getStartTime() : LocalTime.of(8, 0));
                s.setEstimatedArrivalTime(s.getDepartureTime().plusHours(2).plusMinutes(30));
                s.setPrice(90.0);
                s.setStatus(Schedule.Status.ON_TIME);
                scheduleRepository.save(s);
            }
        }
    }
}
