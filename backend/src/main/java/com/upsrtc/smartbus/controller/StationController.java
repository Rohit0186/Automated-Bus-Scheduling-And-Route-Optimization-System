package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Station;
import com.upsrtc.smartbus.repository.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class StationController {

    @Autowired
    private StationRepository stationRepository;

    @GetMapping
    public ResponseEntity<List<Station>> getAllStations() {
        return ResponseEntity.ok(stationRepository.findAll());
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<Station>> getStationsByRegion(@PathVariable Integer regionId) {
        return ResponseEntity.ok(stationRepository.findByRegionId(regionId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Station>> searchStations(@RequestParam String query) {
        return ResponseEntity.ok(stationRepository.searchStations(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Station> getStationById(@PathVariable Integer id) {
        return stationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Station> addStation(@RequestBody Station station) {
        return ResponseEntity.ok(stationRepository.save(station));
    }

    @Autowired private com.upsrtc.smartbus.repository.RouteRepository routeRepository;

    @GetMapping("/reachable-destinations")
    public ResponseEntity<List<String>> getReachableDestinations(@RequestParam String from) {
        return ResponseEntity.ok(routeRepository.findDestinationsBySource(from));
    }
}



