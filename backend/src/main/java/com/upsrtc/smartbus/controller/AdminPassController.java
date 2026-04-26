package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.PassRequest;
import com.upsrtc.smartbus.service.PassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/passes")
@CrossOrigin(origins = "*")
public class AdminPassController {

    @Autowired
    private PassService passService;

    @GetMapping("/pending")
    public ResponseEntity<List<PassRequest>> getPendingRequests() {
        return ResponseEntity.ok(passService.getAllPendingRequests());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PassRequest> updateStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> payload) {
        
        PassRequest.Status status = PassRequest.Status.valueOf(payload.get("status"));
        String remarks = payload.get("remarks");
        
        return ResponseEntity.ok(passService.updateRequestStatus(id, status, remarks));
    }
}
