package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Depot;
import com.upsrtc.smartbus.repository.DepotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/depots")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class DepotController {

    @Autowired
    private DepotRepository depotRepository;

    @GetMapping
    public ResponseEntity<List<Depot>> getAllDepots() {
        return ResponseEntity.ok(depotRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Depot> addDepot(@RequestBody Depot depot) {
        return ResponseEntity.ok(depotRepository.save(depot));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDepot(@PathVariable Integer id) {
        depotRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}



