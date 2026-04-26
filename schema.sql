-- Database: smart_bus_system

CREATE DATABASE IF NOT EXISTS smart_bus_system;
USE smart_bus_system;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('USER', 'ADMIN', 'DRIVER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buses Table
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    bus_type ENUM('AC', 'NON_AC', 'SLEEPER', 'SEATER') NOT NULL,
    total_seats INT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') DEFAULT 'ACTIVE'
);

-- Routes Table
CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance_km DECIMAL(10, 2) NOT NULL
);

-- Stops Table
CREATE TABLE stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL
);

-- Route-Stops Mapping (Order matters)
CREATE TABLE route_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT,
    stop_id INT,
    stop_order INT NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (stop_id) REFERENCES stops(id)
);

-- Drivers Table
CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Conductors Table
CREATE TABLE conductors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15)
);

-- Schedules Table
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT,
    bus_id INT,
    driver_id INT,
    conductor_id INT,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    estimated_arrival_time TIME,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('ON_TIME', 'DELAYED', 'CANCELLED') DEFAULT 'ON_TIME',
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (conductor_id) REFERENCES conductors(id)
);

-- Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    schedule_id INT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('CONFIRMED', 'CANCELLED', 'PENDING') DEFAULT 'CONFIRMED',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);

-- Seats Table (Seat layout for each schedule)
CREATE TABLE seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT,
    seat_number VARCHAR(10) NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    booking_id INT,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Bus Locations Table (Live tracking)
CREATE TABLE bus_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    trip_status ENUM('ONGOING', 'COMPLETED', 'NOT_STARTED') DEFAULT 'NOT_STARTED',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Sample Data for Uttar Pradesh

-- Stops (Common UP Cities and Junctions)
INSERT INTO stops (stop_name, latitude, longitude) VALUES
('Lucknow (Kaiserbagh)', 26.8521, 80.9363),
('Kanpur (Jhakarkati)', 26.4499, 80.3319),
('Agra (ISBT)', 27.2140, 77.9351),
('Delhi (Kashmere Gate)', 28.6675, 77.2285),
('Varanasi (Cantt)', 25.3267, 82.9876),
('Prayagraj (Civil Lines)', 25.4484, 81.8335),
('Gorakhpur', 26.7606, 83.3731),
('Bareilly', 28.3670, 79.4304),
('Mathura', 27.4924, 77.6737),
('Jhansi', 25.4484, 78.5685),
('Lucknow (Ayodhya Road)', 26.8647, 80.9856), -- Intermediate
('Etawah', 26.7770, 79.0220), -- Intermediate
('Aligarh', 27.8974, 78.0880); -- Intermediate

-- Routes
INSERT INTO routes (source, destination, distance_km) VALUES
('Lucknow', 'Delhi', 550.00),
('Kanpur', 'Varanasi', 320.00),
('Lucknow', 'Agra', 330.00),
('Delhi', 'Varanasi', 820.00),
('Gorakhpur', 'Lucknow', 270.00);

-- Route Stops (Mapping)
-- Route 1: Lucknow to Delhi
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(1, 1, 1), -- Lucknow
(1, 2, 2), -- Kanpur
(1, 12, 3), -- Etawah
(1, 3, 4), -- Agra
(1, 4, 5); -- Delhi

-- Route 2: Kanpur to Varanasi
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(2, 2, 1), -- Kanpur
(2, 1, 2), -- Lucknow
(2, 6, 3), -- Prayagraj
(2, 5, 4); -- Varanasi

-- Route 3: Lucknow to Agra
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(3, 1, 1), -- Lucknow
(3, 2, 2), -- Kanpur
(3, 12, 3), -- Etawah
(3, 3, 4); -- Agra

-- Buses
INSERT INTO buses (bus_number, bus_type, total_seats) VALUES
('UP32-AT-1234', 'AC', 40),
('UP78-BN-5678', 'SLEEPER', 30),
('DL01-CS-9012', 'AC', 40),
('UP65-DF-3456', 'NON_AC', 50);

-- Users (Demo)
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'admin@upsrtc.com', 'ADMIN'),
('driver1', '$2a$10$p6G7k7qS1p1kFz1k1k1k1u1u1u1u1u1u1u1u1u1u1u1u1u1u1u1', 'driver1@upsrtc.com', 'DRIVER'),
('testuser', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'user@gmail.com', 'USER');

-- Drivers
INSERT INTO drivers (user_id, license_number, phone) VALUES
(2, 'UP-DL-2024-0001', '9876543210');

-- Conductors
INSERT INTO conductors (name, phone) VALUES
('Ramesh Kumar', '9123456789'),
('Suresh Singh', '9234567890');

-- Schedules
INSERT INTO schedules (route_id, bus_id, driver_id, conductor_id, departure_date, departure_time, price) VALUES
(1, 1, 1, 1, '2026-04-10', '08:00:00', 1200.00),
(1, 3, 1, 2, '2026-04-10', '21:00:00', 1500.00),
(2, 4, 1, 1, '2026-04-10', '06:00:00', 600.00);
