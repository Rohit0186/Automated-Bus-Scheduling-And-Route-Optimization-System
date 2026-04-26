-- History tracking schema for Trip Playback feature
USE smart_bus_system;

CREATE TABLE IF NOT EXISTS bus_location_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DOUBLE DEFAULT 40.0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id),
    INDEX idx_history_schedule (schedule_id, recorded_at)
);
