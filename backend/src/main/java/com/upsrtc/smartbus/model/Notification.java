package com.upsrtc.smartbus.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer scheduleId; // Reference to schedule
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationType {
        INFO, ALERT, SOS
    }

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getScheduleId() { return scheduleId; }
    public void setScheduleId(Integer scheduleId) { this.scheduleId = scheduleId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

