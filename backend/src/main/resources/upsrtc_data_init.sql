SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS regions;

CREATE TABLE regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region_id INT,
    depot_id INT,
    latitude DOUBLE,
    longitude DOUBLE,
    type VARCHAR(50),
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

SET FOREIGN_KEY_CHECKS = 1;

-- 20 OFFICIAL UPSRTC REGIONS
INSERT INTO regions (id, name) VALUES (1, 'AGRA');
INSERT INTO regions (id, name) VALUES (2, 'GHAZIABAD');
INSERT INTO regions (id, name) VALUES (3, 'MEERUT');
INSERT INTO regions (id, name) VALUES (4, 'SAHARANPUR');
INSERT INTO regions (id, name) VALUES (5, 'NOIDA');
INSERT INTO regions (id, name) VALUES (6, 'ALIGARH');
INSERT INTO regions (id, name) VALUES (7, 'MORADABAD');
INSERT INTO regions (id, name) VALUES (8, 'BAREILLY');
INSERT INTO regions (id, name) VALUES (9, 'HARDOI');
INSERT INTO regions (id, name) VALUES (10, 'ETAWAH');
INSERT INTO regions (id, name) VALUES (11, 'KANPUR');
INSERT INTO regions (id, name) VALUES (12, 'JHANSI');
INSERT INTO regions (id, name) VALUES (13, 'LUCKNOW');
INSERT INTO regions (id, name) VALUES (14, 'AYODHYA');
INSERT INTO regions (id, name) VALUES (15, 'ALLAHABAD');
INSERT INTO regions (id, name) VALUES (16, 'AZAMGARH');
INSERT INTO regions (id, name) VALUES (17, 'GORAKHPUR');
INSERT INTO regions (id, name) VALUES (18, 'VARANASI');
INSERT INTO regions (id, name) VALUES (19, 'DEVIPATAN');
INSERT INTO regions (id, name) VALUES (20, 'CHITRAKOOT');

-- STATIONS MAPPING
-- AGRA (1)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Agra Fort', 1, 27.1788, 78.0215, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Idgah', 1, 27.1652, 77.9950, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kagaraul', 1, 27.0200, 77.8500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Jagner', 1, 26.8500, 77.6000, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Tanthpur', 1, 26.7500, 77.5500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bhooteshwar', 1, 27.4900, 77.6700, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Transport Nagar', 1, 27.2000, 77.9800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Fatehabad', 1, 27.0100, 78.3100, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bah', 1, 26.8600, 78.5900, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Pinhat', 1, 26.8800, 78.3800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Shamshabad', 1, 27.0100, 78.1200, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Mathura', 1, 27.4924, 77.6737, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kosi', 1, 27.7900, 77.4400, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Fatehpur Sikri', 1, 27.0945, 77.6675, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Maanth', 1, 27.7100, 77.6900, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Naujhil', 1, 27.8500, 77.6500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Shergarh', 1, 27.8100, 77.6100, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Govardhan', 1, 27.4900, 77.4700, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Barsana', 1, 27.6500, 77.3800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Chata', 1, 27.7200, 77.5000, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Raaya', 1, 27.5600, 77.7800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Vrindavan', 1, 27.5650, 77.6593, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Farah', 1, 27.3200, 77.7600, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Tundla', 1, 27.2000, 78.2300, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Achhnera', 1, 27.1800, 77.7600, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Saiya', 1, 26.9600, 77.9900, 'BUS_STOP');

-- GHAZIABAD (2)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Ghaziabad', 2, 28.6692, 77.4538, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Loni', 2, 28.7500, 77.2800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Muradnagar', 2, 28.7800, 77.5000, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kaushambi', 2, 28.6443, 77.3195, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Hapur', 2, 28.7200, 77.7700, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Khurja', 2, 28.2500, 77.8500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Modinagar', 2, 28.8300, 77.5800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Mohan Nagar', 2, 28.6700, 77.3900, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sikandrabad', 2, 28.4500, 77.6900, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Dadri', 2, 28.5500, 77.5500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sahibabad', 2, 28.6600, 77.3400, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bulandshahar', 2, 28.4069, 77.8446, 'BUS_STATION');

-- MEERUT (3)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Meerut', 3, 28.9845, 77.7064, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Garhmukteshwar', 3, 28.7800, 78.1000, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Baraut', 3, 29.1000, 77.2600, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sohrabgate', 3, 28.9600, 77.7300, 'BUS_STATION');

-- SAHARANPUR (4)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Chutmalpur', 4, 30.0300, 77.7500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Muzaffarnagar', 4, 29.4727, 77.7085, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Saharanpur', 4, 29.9640, 77.5460, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Jalalabad', 4, 29.9300, 77.3500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Purkazi', 4, 29.7000, 77.8500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Khatauli', 4, 29.2800, 77.7200, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kairana', 4, 29.4000, 77.2000, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Gangoh', 4, 29.7800, 77.2500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Shamli', 4, 29.4500, 77.3100, 'BUS_STATION');

-- NOIDA (5)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Noida', 5, 28.5355, 77.3910, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Greater Noida', 5, 28.4744, 77.5040, 'BUS_STATION');

-- ALIGARH (6)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Aligarh', 6, 27.8974, 78.0880, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sasni', 6, 27.7000, 78.0800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kasganj', 6, 27.8100, 78.6400, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Gabhana', 6, 28.0100, 77.9400, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Akrabad', 6, 27.8000, 78.2800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Khandauli', 6, 27.2800, 78.0600, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Soron', 6, 27.8900, 78.7400, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Masudabad', 6, 27.8800, 78.0500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Etah', 6, 27.5500, 78.6600, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Naraura', 6, 28.2000, 78.3800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Hathras', 6, 27.6000, 78.0500, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Iglas', 6, 27.7100, 77.9300, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sadabad', 6, 27.4400, 77.9900, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Atrauli', 6, 28.0300, 78.2800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Khair', 6, 27.9400, 77.8400, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Jalesar', 6, 27.4800, 78.3100, 'BUS_STOP');

-- MORADABAD (7)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Moradabad', 7, 28.8351, 78.7733, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Hasanpur', 7, 28.7200, 78.2800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Chandpur', 7, 29.1300, 78.2800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Nazibabad', 7, 29.6200, 78.3300, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Rampur', 7, 28.8100, 79.0200, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Gazraula', 7, 28.8400, 78.2400, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Noorpur', 7, 29.1500, 78.4100, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Chandausi', 7, 28.4500, 78.7800, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bilari', 7, 28.6200, 78.8000, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Dhampur', 7, 29.3100, 78.5100, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bijnore', 7, 29.3700, 78.1300, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Amroha', 7, 28.9100, 78.4700, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sambhal', 7, 28.5800, 78.5500, 'BUS_STATION');

-- BAREILLY (8)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bareilly', 8, 28.3670, 79.4304, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sahsawan', 8, 28.0700, 78.7500, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Pilibhit', 8, 28.6200, 79.8000, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bisalpur', 8, 28.3000, 79.8000, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Nawabganj', 8, 28.5300, 79.6300, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Badaun', 8, 28.0300, 79.1200, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Faridpur', 8, 28.2100, 79.5400, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Puranpur', 8, 28.5100, 80.1400, 'BUS_STOP');

-- HARDOI (9)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sitapur', 9, 27.5600, 80.6800, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Hardoi', 9, 27.3800, 80.1200, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Shahjahanpur', 9, 27.8800, 79.9100, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Lakhimpur', 9, 27.9400, 80.7700, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kannauj', 9, 27.0500, 79.9200, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Mohammadi', 9, 28.0300, 80.2100, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Tilhar', 9, 27.9800, 79.7300, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Gola', 9, 28.0800, 80.4700, 'BUS_STOP');

-- ETAWAH (10)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Etawah', 10, 26.7720, 79.0220, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Auraiya', 10, 26.4600, 79.5100, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Mainpuri', 10, 27.2300, 79.0100, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Farrukhabad', 10, 27.3800, 79.5800, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Shikohabad', 10, 27.1000, 78.5800, 'BUS_STOP');

-- KANPUR (11)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kanpur Central', 11, 26.4520, 80.3340, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Rawatpur', 11, 26.4800, 80.2900, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Unnao', 11, 26.5400, 80.4900, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Fatehpur', 11, 25.9300, 80.8100, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bindki', 11, 26.0400, 80.5900, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Ghatampur', 11, 26.1600, 80.1600, 'BUS_STOP');

-- JHANSI (12)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Jhansi', 12, 25.4484, 78.5685, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Lalitpur', 12, 24.6900, 78.4100, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Orai', 12, 25.9900, 79.4500, 'BUS_STATION');

-- LUCKNOW (13)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Charbagh', 13, 26.8322, 80.9197, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Alambagh', 13, 26.8157, 80.8978, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kaiserbagh', 13, 26.8521, 80.9363, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Barabanki', 13, 26.9300, 81.1800, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Raebareli', 13, 26.2200, 81.2400, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Haidergarh', 13, 26.6000, 81.6300, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Mohanlalganj', 13, 26.6800, 80.9800, 'BUS_STOP');

-- AYODHYA (14)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Ayodhya', 14, 26.7922, 82.1998, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sultanpur', 14, 26.2600, 82.0700, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Akbarpur', 14, 26.4300, 82.5300, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Amethi', 14, 26.1500, 81.8100, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Tanda', 14, 26.5400, 82.6500, 'BUS_STOP');

-- ALLAHABAD (15)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Prayagraj (Zero Road)', 15, 25.4320, 81.8480, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Civil Lines', 15, 25.4549, 81.8340, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Koraon', 15, 24.9600, 82.0700, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Pratapgarh', 15, 25.9100, 81.9900, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Mirzapur', 15, 25.1300, 82.5600, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Kunda', 15, 25.7100, 81.5100, 'BUS_STOP');

-- AZAMGARH (16)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Azamgarh', 16, 26.0600, 83.1800, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Mau', 16, 25.9400, 83.5600, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Ballia', 16, 25.7600, 84.1400, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Shahganj', 16, 26.0400, 82.7000, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Ghosi', 16, 26.1100, 83.5400, 'BUS_STOP');

-- GORAKHPUR (17)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Gorakhpur', 17, 26.7606, 83.3731, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Basti', 17, 26.7900, 82.7500, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Deoria', 17, 26.5000, 83.7700, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Maharajganj', 17, 27.1400, 83.5600, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Nautanwa', 17, 27.4300, 83.4200, 'BUS_STOP');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Padrauna', 17, 26.9000, 83.9800, 'BUS_STATION');

-- VARANASI (18)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Varanasi', 18, 25.3176, 82.9739, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Jaunpur', 18, 25.7400, 82.6800, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Ghazipur', 18, 25.5800, 83.5700, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Chandauli', 18, 25.2600, 83.2600, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Sonbhadra', 18, 24.6800, 83.0600, 'BUS_STATION');

-- DEVIPATAN (19)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Gonda', 19, 27.1300, 81.9600, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Bahraich', 19, 27.5700, 81.5900, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Balrampur', 19, 27.4300, 82.1800, 'BUS_STATION');

-- CHITRAKOOT (20)
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Banda', 20, 25.4800, 80.3300, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Chitrakoot', 20, 25.2000, 80.8500, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Mahoba', 20, 25.2900, 79.8700, 'BUS_STATION');
INSERT INTO stations (name, region_id, latitude, longitude, type) VALUES ('Hamirpur', 20, 25.9500, 80.1500, 'BUS_STATION');
