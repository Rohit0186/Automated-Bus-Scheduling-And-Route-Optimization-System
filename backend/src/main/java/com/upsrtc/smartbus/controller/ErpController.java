package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.FuelLog;
import com.upsrtc.smartbus.model.MaintenanceLog;
import com.upsrtc.smartbus.repository.FuelLogRepository;
import com.upsrtc.smartbus.repository.MaintenanceLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.upsrtc.smartbus.model.Bus.Status;

@RestController
@RequestMapping("/api/erp")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class ErpController {

    @Autowired
    private com.upsrtc.smartbus.repository.BusRepository busRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.RouteRepository routeRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.PassRequestRepository passRequestRepository;
    
    @Autowired
    private MaintenanceLogRepository maintenanceLogRepository;

    @Autowired
    private FuelLogRepository fuelLogRepository;

    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Object>> getErpStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        
        long mCount = maintenanceLogRepository.count();
        Double fSum = fuelLogRepository.sumTotalCost();
        
        // Deep Logging for debugging Zero-Data issue
        System.out.println("[ERP STATS] Maintenance Count: " + mCount);
        System.out.println("[ERP STATS] Fuel Total Sum: " + fSum);
        
        stats.put("maintenanceCount", mCount);
        stats.put("fuelTotal", fSum != null ? fSum : 0.0);
        stats.put("workshopCount", busRepository.findByStatus(Status.MAINTENANCE).size());
        stats.put("totalBuses", busRepository.count());
        stats.put("totalRoutes", routeRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/workshop")
    public ResponseEntity<List<com.upsrtc.smartbus.model.Bus>> getWorkshopBuses() {
        return ResponseEntity.ok(busRepository.findByStatus(Status.MAINTENANCE));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<java.util.Map<String, String>>> getFleetAlerts() {
        List<java.util.Map<String, String>> alerts = new java.util.ArrayList<>();
        
        // Logic: Buses in maintenance are 'alerts' until cleared
        List<com.upsrtc.smartbus.model.Bus> inWorkshop = busRepository.findByStatus(Status.MAINTENANCE);
        for (com.upsrtc.smartbus.model.Bus b : inWorkshop) {
            java.util.Map<String, String> alert = new java.util.HashMap<>();
            alert.put("title", "Asset #" + b.getBusNumber() + " Under Maintenance");
            alert.put("severity", "MEDIUM");
            alerts.add(alert);
        }

        // Logic: If no fuel logs today (simulated check)
        if (fuelLogRepository.count() < 5) {
            java.util.Map<String, String> alert = new java.util.HashMap<>();
            alert.put("title", "Daily Fuel Audit Pending");
            alert.put("severity", "HIGH");
            alert.put("type", "FUEL");
            alerts.add(alert);
        }

        // Senior Update: Include Pending Passes as Tasks
        long pendingPasses = passRequestRepository.countByStatus(com.upsrtc.smartbus.model.PassRequest.Status.PENDING);
        if (pendingPasses > 0) {
            java.util.Map<String, String> alert = new java.util.HashMap<>();
            alert.put("title", pendingPasses + " Pass Requests Pending Approval");
            alert.put("severity", "HIGH");
            alert.put("type", "PASS");
            alerts.add(alert);
        }

        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/maintenance")
    public ResponseEntity<List<MaintenanceLog>> getAllMaintenanceLogs() {
        return ResponseEntity.ok(maintenanceLogRepository.findAll());
    }

    @PostMapping("/maintenance")
    public ResponseEntity<MaintenanceLog> addMaintenanceLog(@RequestBody MaintenanceLog log) {
        return ResponseEntity.ok(maintenanceLogRepository.save(log));
    }

    @GetMapping("/fuel")
    public ResponseEntity<List<FuelLog>> getAllFuelLogs() {
        return ResponseEntity.ok(fuelLogRepository.findAll());
    }

    @PostMapping("/fuel")
    public ResponseEntity<FuelLog> addFuelLog(@RequestBody FuelLog log) {
        return ResponseEntity.ok(fuelLogRepository.save(log));
    }
}



