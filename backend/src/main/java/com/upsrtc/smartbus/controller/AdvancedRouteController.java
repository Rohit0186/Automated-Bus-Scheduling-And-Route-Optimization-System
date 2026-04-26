package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.service.AdvancedRouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class AdvancedRouteController {

    @Autowired
    private AdvancedRouteService routeService;

    // ADMIN ENDPOINTS
    /*
    @PostMapping("/api/admin/routes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        return ResponseEntity.ok(routeService.createRoute(route));
    }
    */

    @GetMapping("/api/admin/routes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Route>> getAdminRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @DeleteMapping("/api/admin/routes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoute(@PathVariable Integer id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok().build();
    }

    // USER ENDPOINTS
    /*
    @GetMapping("/api/routes")
    public ResponseEntity<List<Route>> getRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/api/routes/{id}")
    public ResponseEntity<Route> getRoute(@PathVariable Integer id) {
        return routeService.getRouteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    */
}
