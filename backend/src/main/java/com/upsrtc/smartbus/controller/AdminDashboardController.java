package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.dto.DashboardSummaryDTO;
import com.upsrtc.smartbus.dto.LiveTrackingDTO;
import com.upsrtc.smartbus.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(adminDashboardService.getDashboardSummary());
    }

    @GetMapping("/live-status")
    public ResponseEntity<List<LiveTrackingDTO>> getLiveStatus() {
        return ResponseEntity.ok(adminDashboardService.getLiveStatus());
    }

    @GetMapping("/analytics")
    public ResponseEntity<com.upsrtc.smartbus.dto.DashboardAnalyticsDTO> getAnalytics() {
        return ResponseEntity.ok(adminDashboardService.getAnalytics());
    }
}

