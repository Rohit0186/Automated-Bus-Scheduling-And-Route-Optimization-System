package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.dto.LoginRequest;
import com.upsrtc.smartbus.dto.LoginResponse;
import com.upsrtc.smartbus.dto.TokenRefreshRequest;
import com.upsrtc.smartbus.dto.TokenRefreshResponse;
import com.upsrtc.smartbus.dto.ForgotPasswordRequest;
import com.upsrtc.smartbus.dto.ResetPasswordRequest;
import com.upsrtc.smartbus.model.User;
import com.upsrtc.smartbus.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user, @RequestParam(required = false) String inviteCode) {
        // Advanced role assignment via invite code
        if ("SMART-ADMIN-ROOT".equals(inviteCode)) {
            user.setRole(User.Role.ADMIN);
        } else if ("SMART-DRIVER-2024".equals(inviteCode)) {
            user.setRole(User.Role.DRIVER);
        } else {
            user.setRole(User.Role.USER);
        }
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok().body(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok().body(authService.resetPassword(request));
    }
}

