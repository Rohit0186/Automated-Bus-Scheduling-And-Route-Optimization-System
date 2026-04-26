package com.upsrtc.smartbus.repository;

import com.upsrtc.smartbus.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByScheduleId(Integer scheduleId);
    List<Notification> findByTypeOrderByCreatedAtDesc(Notification.NotificationType type);
}

