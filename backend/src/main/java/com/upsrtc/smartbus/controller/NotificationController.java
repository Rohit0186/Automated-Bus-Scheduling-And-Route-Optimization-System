package com.upsrtc.smartbus.controller;

import com.upsrtc.smartbus.model.Notification;
import com.upsrtc.smartbus.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/sos")
    public ResponseEntity<Notification> triggerSOS(@RequestBody Notification sosRequest) {
        sosRequest.setType(Notification.NotificationType.SOS);
        sosRequest.setCreatedAt(LocalDateTime.now());
        Notification saved = notificationRepository.save(sosRequest);
        
        // Broadcast to all admins via WebSocket
        messagingTemplate.convertAndSend("/topic/sos", saved);
        
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/chat")
    public ResponseEntity<Notification> sendMessage(@RequestBody Notification chatMsg) {
        chatMsg.setCreatedAt(LocalDateTime.now());
        Notification saved = notificationRepository.save(chatMsg);
        
        // Broadcast to specific chat topic (could be refined to per-schedule chat)
        messagingTemplate.convertAndSend("/topic/chat", saved);
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/active-sos")
    public ResponseEntity<List<Notification>> getActiveSOS() {
        return ResponseEntity.ok(notificationRepository.findByTypeOrderByCreatedAtDesc(Notification.NotificationType.SOS));
    }
}

