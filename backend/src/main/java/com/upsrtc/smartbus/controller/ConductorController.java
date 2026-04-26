package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/conductor")
@CrossOrigin(origins = "*")
public class ConductorController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/validate-ticket")
    public ResponseEntity<Map<String, Object>> validateTicket(@RequestBody Map<String, String> payload) {
        String qrData = payload.get("qrCodeData");
        String result = ticketService.validateTicket(qrData);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", result);
        
        // If valid, also send back some basic passenger/seat info for verification
        if (result.equals("VALID") || result.equals("ALREADY USED")) {
            ticketService.getTicketById(Integer.parseInt(qrData.split("-")[1])) // Fallback logic depends on token format
                .ifPresent(ticket -> {
                    response.put("passengerInfo", "Seat: " + ticket.getSeatNumber());
                    response.put("routeInfo", ticket.getSource() + " -> " + ticket.getDestination());
                });
        }
        
        return ResponseEntity.ok(response);
    }
}
