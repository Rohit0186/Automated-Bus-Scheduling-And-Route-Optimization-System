-- Fix for MySQL 8.0 (split ALTER statements)
-- Run this in MySQL Workbench or via mysql CLI

USE smart_bus_system;

-- Step 1: Add columns to bus_locations (safe to run multiple times with IF NOT EXISTS)
ALTER TABLE bus_locations
    ADD COLUMN IF NOT EXISTS schedule_id INT NULL,
    ADD COLUMN IF NOT EXISTS speed DOUBLE DEFAULT 40.0,
    ADD COLUMN IF NOT EXISTS current_stop_id INT NULL;

-- Step 2: Create route_polylines table
CREATE TABLE IF NOT EXISTS route_polylines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    point_order INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id),
    INDEX idx_route_order (route_id, point_order)
);

-- Step 3: Route 1 polyline: Lucknow to Delhi
INSERT IGNORE INTO route_polylines (route_id, point_order, latitude, longitude) VALUES
(1, 1,  26.8521, 80.9363),
(1, 2,  26.8350, 80.8900),
(1, 3,  26.7800, 80.7500),
(1, 4,  26.6900, 80.5800),
(1, 5,  26.5800, 80.4800),
(1, 6,  26.4900, 80.3700),
(1, 7,  26.4499, 80.3319),
(1, 8,  26.4200, 80.2500),
(1, 9,  26.3800, 80.1200),
(1, 10, 26.3200, 79.9800),
(1, 11, 26.2500, 79.7500),
(1, 12, 26.1500, 79.5000),
(1, 13, 26.7770, 79.0220),
(1, 14, 26.8900, 78.9000),
(1, 15, 27.0000, 78.7500),
(1, 16, 27.0800, 78.6000),
(1, 17, 27.1200, 78.3000),
(1, 18, 27.1700, 78.1000),
(1, 19, 27.2140, 77.9351),
(1, 20, 27.3000, 77.8000),
(1, 21, 27.5000, 77.5000),
(1, 22, 27.8000, 77.3500),
(1, 23, 28.0000, 77.3200),
(1, 24, 28.4000, 77.2800),
(1, 25, 28.6675, 77.2285);

-- Step 4: Route 2 polyline: Kanpur to Varanasi
INSERT IGNORE INTO route_polylines (route_id, point_order, latitude, longitude) VALUES
(2, 1,  26.4499, 80.3319),
(2, 2,  26.5200, 80.4400),
(2, 3,  26.6000, 80.5800),
(2, 4,  26.7000, 80.7200),
(2, 5,  26.7800, 80.8500),
(2, 6,  26.8521, 80.9363),
(2, 7,  26.8700, 81.0200),
(2, 8,  26.8400, 81.1500),
(2, 9,  26.7800, 81.3500),
(2, 10, 26.6500, 81.5500),
(2, 11, 26.5000, 81.7500),
(2, 12, 26.3000, 81.9000),
(2, 13, 26.0000, 81.9500),
(2, 14, 25.7000, 81.9500),
(2, 15, 25.5000, 81.8800),
(2, 16, 25.4484, 81.8335),
(2, 17, 25.4000, 81.9500),
(2, 18, 25.3800, 82.1500),
(2, 19, 25.3500, 82.3500),
(2, 20, 25.3300, 82.5500),
(2, 21, 25.3275, 82.7000),
(2, 22, 25.3267, 82.9876);

-- Step 5: Route 3 polyline: Lucknow to Agra
INSERT IGNORE INTO route_polylines (route_id, point_order, latitude, longitude) VALUES
(3, 1,  26.8521, 80.9363),
(3, 2,  26.7800, 80.7500),
(3, 3,  26.6900, 80.5800),
(3, 4,  26.5800, 80.4800),
(3, 5,  26.4499, 80.3319),
(3, 6,  26.3800, 80.1200),
(3, 7,  26.3200, 79.9800),
(3, 8,  26.2500, 79.7500),
(3, 9,  26.1500, 79.5000),
(3, 10, 26.7770, 79.0220),
(3, 11, 27.0000, 78.7500),
(3, 12, 27.1200, 78.3000),
(3, 13, 27.1700, 78.1000),
(3, 14, 27.2140, 77.9351);

-- Step 6: Seed a demo ONGOING bus location for schedule 1
INSERT INTO bus_locations (bus_id, schedule_id, latitude, longitude, trip_status, speed, current_stop_id, last_updated)
SELECT 1, 1, 26.8521, 80.9363, 'ONGOING', 40.0, 1, NOW()
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM bus_locations WHERE bus_id = 1
);

-- If it already exists, update it to ONGOING for demo
UPDATE bus_locations SET
    schedule_id = 1,
    latitude = 26.8521,
    longitude = 80.9363,
    trip_status = 'ONGOING',
    speed = 40.0,
    last_updated = NOW()
WHERE bus_id = 1;
