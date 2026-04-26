-- Reset the table if we just want a clean slate (optional, but let's just delete existing data)
DELETE FROM seats;

-- Insert sample seats for Bus 1 (AC SEATER - bus_id=1)
INSERT INTO seats (bus_id, seat_number, seat_type, position, price) VALUES
(1, '1A', 'SEATER', 'WINDOW', 500.0),
(1, '1B', 'SEATER', 'AISLE', 500.0),
(1, '1C', 'SEATER', 'AISLE', 500.0),
(1, '1D', 'SEATER', 'WINDOW', 500.0),
(1, '2A', 'SEATER', 'WINDOW', 500.0),
(1, '2B', 'SEATER', 'AISLE', 500.0),
(1, '2C', 'SEATER', 'AISLE', 500.0),
(1, '2D', 'SEATER', 'WINDOW', 500.0);

-- Insert sample seats for Bus 2 (SLEEPER - bus_id=2)
INSERT INTO seats (bus_id, seat_number, seat_type, position, price) VALUES
(2, 'L1', 'SLEEPER', 'WINDOW', 1200.0),
(2, 'L2', 'SLEEPER', 'WINDOW', 1200.0),
(2, 'U1', 'SLEEPER', 'WINDOW', 1100.0),
(2, 'U2', 'SLEEPER', 'WINDOW', 1100.0);
