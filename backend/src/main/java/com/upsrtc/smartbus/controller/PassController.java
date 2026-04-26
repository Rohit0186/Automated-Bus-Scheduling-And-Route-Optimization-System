package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.PassRequest;
import com.upsrtc.smartbus.service.PassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.upsrtc.smartbus.repository.UserRepository;
import com.upsrtc.smartbus.model.User;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/passes")
@CrossOrigin(origins = "*")
public class PassController {

    @Autowired
    private PassService passService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/apply")
    public ResponseEntity<PassRequest> applyForPass(@RequestBody PassRequest request) {
        return ResponseEntity.ok(passService.applyForPass(request));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<PassRequest>> getMyRequests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(passService.getUserRequests(user.getId()));
    }
}
