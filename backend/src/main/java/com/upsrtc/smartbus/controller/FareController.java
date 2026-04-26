package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.dto.FareCalculationRequestDTO;
import com.upsrtc.smartbus.dto.FareCalculationResponseDTO;
import com.upsrtc.smartbus.service.FareCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fare")
@CrossOrigin("*")
public class FareController {

    @Autowired
    private FareCalculationService fareCalculationService;

    @PostMapping("/calculate")
    public ResponseEntity<FareCalculationResponseDTO> calculateFare(@RequestBody FareCalculationRequestDTO request) {
        try {
            return ResponseEntity.ok(fareCalculationService.calculateFare(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
