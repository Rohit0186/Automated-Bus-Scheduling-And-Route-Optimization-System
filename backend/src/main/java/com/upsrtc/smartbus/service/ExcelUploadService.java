package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.dto.RouteRequestDTO;
import com.upsrtc.smartbus.dto.RouteStopRequestDTO;
import com.upsrtc.smartbus.model.Bus;
import com.upsrtc.smartbus.model.Route;
import com.upsrtc.smartbus.repository.BusRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.*;

@Service
public class ExcelUploadService {
    private static final Logger logger = LoggerFactory.getLogger(ExcelUploadService.class);

    @Autowired
    private RouteManagementService routeManagementService;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private SeatService seatService;

    @Autowired
    private BusScheduleService busScheduleService;

    @Transactional
    public void processExcelFile(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            if (!rows.hasNext()) {
                throw new IllegalArgumentException("Sheet is empty");
            }

            // Skip header row
            rows.next();

            Map<String, RouteRequestDTO> routeMap = new HashMap<>();
            Map<String, List<Integer>> routeBuses = new HashMap<>();

            int rowNum = 1;
            while (rows.hasNext()) {
                Row row = rows.next();
                rowNum++;

                if (isRowEmpty(row)) continue;

                try {
                    String routeName = getCellValueAsString(row.getCell(0));
                    String source = getCellValueAsString(row.getCell(1));
                    String destination = getCellValueAsString(row.getCell(2));
                    String stopName = getCellValueAsString(row.getCell(3));
                    
                    if (routeName == null || source == null || destination == null || stopName == null) {
                        logger.warn("Skipping row {}: Missing essential route/stop info", rowNum);
                        continue;
                    }

                    Integer stopOrder = getCellValueAsInteger(row.getCell(4));
                    Integer durationFromStart = getCellValueAsInteger(row.getCell(5));
                    Double distance = getCellValueAsDouble(row.getCell(6));
                    String busNumber = getCellValueAsString(row.getCell(7));
                    Double farePerKm = getCellValueAsDouble(row.getCell(8)); // Optional 9th column

                    if (stopOrder == null || distance == null) {
                        logger.warn("Skipping row {}: Missing stop order or distance", rowNum);
                        continue;
                    }

                    String key = routeName.trim() + "_" + source.trim() + "_" + destination.trim();

                    routeMap.putIfAbsent(key, new RouteRequestDTO());
                    RouteRequestDTO routeDto = routeMap.get(key);
                    routeDto.setRouteName(routeName.trim());
                    routeDto.setSource(source.trim());
                    routeDto.setDestination(destination.trim());
                    
                    double currentTotal = routeDto.getTotalDistance() != null ? routeDto.getTotalDistance() : 0.0;
                    routeDto.setTotalDistance(Math.max(currentTotal, distance));
                    
                    if (farePerKm != null) {
                        routeDto.setFarePerKm(farePerKm);
                    } else if (routeDto.getFarePerKm() == null) {
                        routeDto.setFarePerKm(1.5); // Default
                    }
                    
                    routeDto.setIsActive(true);

                    if (routeDto.getStops() == null) {
                        routeDto.setStops(new ArrayList<>());
                    }

                    // Avoid duplicate stops if multiple rows mention the same stop for different buses
                    boolean stopExists = routeDto.getStops().stream()
                            .anyMatch(s -> s.getStopOrder().equals(stopOrder));
                    
                    if (!stopExists) {
                        RouteStopRequestDTO stopDto = new RouteStopRequestDTO();
                        stopDto.setStopName(stopName.trim());
                        stopDto.setStopOrder(stopOrder);
                        stopDto.setDurationFromStart(durationFromStart != null ? durationFromStart : 0);
                        stopDto.setDistanceFromStart(distance);
                        routeDto.getStops().add(stopDto);
                    }

                    if (busNumber != null && !busNumber.trim().isEmpty()) {
                        String bNum = busNumber.trim();
                        Bus bus = busRepository.findByBusNumberContainingIgnoreCase(bNum)
                                .stream().findFirst().orElse(null);
                        
                        if (bus == null) {
                            logger.info("Creating new bus asset for number: {}", bNum);
                            bus = new Bus();
                            bus.setBusNumber(bNum);
                            bus.setBusName("UPSRTC-" + bNum);
                            bus.setBusType(Bus.BusType.AC);
                            bus.setTotalSeats(40);
                            bus.setAvailableSeats(40);
                            bus.setStatus(Bus.Status.ACTIVE);
                            bus.setIsActive(true);
                            bus.setStartTime(java.time.LocalTime.of(6, 0));
                            bus = busRepository.save(bus);
                            seatService.autoGenerateSeats(bus.getId());
                            // Trigger per-stop schedule generation for today
                            busScheduleService.generateSchedulesForBus(bus, null, java.time.LocalDate.now(), 1); 
                        }
                        
                        routeBuses.putIfAbsent(key, new ArrayList<>());
                        if (!routeBuses.get(key).contains(bus.getId())) {
                            routeBuses.get(key).add(bus.getId());
                        }

                        // Register stop as a station for autocomplete
                        registerStopAsStation(stopName.trim());
                    }
                } catch (Exception e) {
                    logger.error("Error processing row {}: {}", rowNum, e.getMessage());
                }
            }

            if (routeMap.isEmpty()) {
                throw new Exception("No valid data found in Excel");
            }

            // Save routes and assign buses
            for (Map.Entry<String, RouteRequestDTO> entry : routeMap.entrySet()) {
                RouteRequestDTO routeDto = entry.getValue();
                logger.info("Finalizing route: {} with {} stops", routeDto.getRouteName(), routeDto.getStops().size());
                routeDto.getStops().sort(Comparator.comparingInt(RouteStopRequestDTO::getStopOrder));

                try {
                    Route savedRoute = routeManagementService.createOrUpdateRoute(routeDto);
                    
                    List<Integer> busIds = routeBuses.get(entry.getKey());
                    if (busIds != null && !busIds.isEmpty()) {
                        routeManagementService.assignBuses(savedRoute.getId(), busIds);
                    }
                } catch (Exception e) {
                    logger.error("Failed to save route {}: {}", routeDto.getRouteName(), e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.error("Excel processing failed", e);
            throw e;
        }
    }

    @Autowired private com.upsrtc.smartbus.repository.StationRepository stationRepository;
    
    private void registerStopAsStation(String name) {
        if (stationRepository.findAll().stream().noneMatch(s -> s.getName().equalsIgnoreCase(name))) {
            com.upsrtc.smartbus.model.Station station = new com.upsrtc.smartbus.model.Station();
            station.setName(name);
            stationRepository.save(station);
        }
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) return true;
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) return false;
        }
        return true;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: return String.valueOf((int)cell.getNumericCellValue());
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA: return cell.getCellFormula();
            default: return null;
        }
    }

    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return (int) cell.getNumericCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            try {
                return Integer.parseInt(cell.getStringCellValue().trim());
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    private Double getCellValueAsDouble(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue().trim());
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}

