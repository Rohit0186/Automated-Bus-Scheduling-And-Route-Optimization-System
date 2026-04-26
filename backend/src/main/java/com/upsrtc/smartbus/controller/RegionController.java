package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Region;
import com.upsrtc.smartbus.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class RegionController {

    @Autowired
    private RegionRepository regionRepository;

    @GetMapping
    public ResponseEntity<List<Region>> getAllRegions() {
        return ResponseEntity.ok(regionRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Region> addRegion(@RequestBody Region region) {
        return ResponseEntity.ok(regionRepository.save(region));
    }
}



