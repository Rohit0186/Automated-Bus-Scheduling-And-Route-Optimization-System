package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.dto.AssignBusesRequestDTO;
import com.upsrtc.smartbus.dto.RouteRequestDTO;
import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.service.ExcelUploadService;
import com.upsrtc.smartbus.service.RouteManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/routes")
@CrossOrigin("*")
public class AdminRouteController {

    @Autowired
    private RouteManagementService routeManagementService;

    @Autowired
    private ExcelUploadService excelUploadService;

    @PostMapping
    public ResponseEntity<Route> createRoute(@RequestBody RouteRequestDTO dto) {
        return ResponseEntity.ok(routeManagementService.createOrUpdateRoute(dto));
    }

    @PostMapping("/{id}/assign-bus")
    public ResponseEntity<String> assignBuses(@PathVariable Integer id, @RequestBody AssignBusesRequestDTO dto) {
        routeManagementService.assignBuses(id, dto.getBusIds());
        return ResponseEntity.ok("Buses assigned successfully");
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Route> toggleRoute(@PathVariable Integer id) {
        return ResponseEntity.ok(routeManagementService.toggleRoute(id));
    }

    @PostMapping("/upload-excel")
    public ResponseEntity<String> uploadExcel(@RequestParam("file") MultipartFile file) {
        try {
            excelUploadService.processExcelFile(file);
            return ResponseEntity.ok("File uploaded and processed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing file: " + e.getMessage());
        }
    }
}
