package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.dto.BusSeatStatusDTO;
import com.upsrtc.smartbus.dto.SeatAvailabilityDTO;
import com.upsrtc.smartbus.model.Bus;
import com.upsrtc.smartbus.model.Seat;
import com.upsrtc.smartbus.repository.BookingSeatRepository;
import com.upsrtc.smartbus.repository.BusRepository;
import com.upsrtc.smartbus.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BookingSeatRepository bookingSeatRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private com.upsrtc.smartbus.repository.BusScheduleRepository busScheduleRepository;

    // ─── Admin: seat configuration CRUD ─────────────────────────────────────

    public Seat createSeat(Integer busId, Seat seatConfig) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found: " + busId));
        seatConfig.setBus(bus);
        return seatRepository.save(seatConfig);
    }

    public List<Seat> getSeatsByBus(Integer busId) {
        return seatRepository.findByBusId(busId);
    }

    public Seat updateSeat(Integer seatId, Seat updated) {
        Seat existing = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found: " + seatId));
        if (updated.getSeatNumber() != null) existing.setSeatNumber(updated.getSeatNumber());
        if (updated.getSeatType()   != null) existing.setSeatType(updated.getSeatType());
        if (updated.getPosition()   != null) existing.setPosition(updated.getPosition());
        if (updated.getPrice()      != null) existing.setPrice(updated.getPrice());
        return seatRepository.save(existing);
    }

    public void deleteSeat(Integer seatId) {
        seatRepository.deleteById(seatId);
    }

    // ─── Dynamic seat availability for a schedule ────────────────────────────

    @Autowired private com.upsrtc.smartbus.repository.BookingRepository bookingRepository;

    public List<SeatAvailabilityDTO> getSeatAvailabilityBySchedule(Integer scheduleId) {
        com.upsrtc.smartbus.model.BusSchedule schedule = busScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        
        Bus bus = schedule.getBus();
        List<Seat> allSeats = seatRepository.findByBusId(bus.getId());
        List<SeatAvailabilityDTO> result = new ArrayList<>();
        
        List<com.upsrtc.smartbus.model.Booking> scheduleBookings = bookingRepository.findByBusScheduleId(scheduleId);
        
        for (Seat seat : allSeats) {
            boolean isAvailable = true;
            String seatNum = seat.getSeatNumber();
            
            for (com.upsrtc.smartbus.model.Booking b : scheduleBookings) {
                if (b.getStatus() == com.upsrtc.smartbus.model.Booking.Status.CANCELLED) continue;
                
                if (b.getSeatNumbers() != null) {
                    String[] bookedSeats = b.getSeatNumbers().split(",");
                    for (String bs : bookedSeats) {
                        if (bs.trim().equalsIgnoreCase(seatNum.trim())) {
                            isAvailable = false;
                            break;
                        }
                    }
                }
                if (!isAvailable) break;
            }
            result.add(new SeatAvailabilityDTO(seat, isAvailable));
        }
        return result;
    }

    public List<SeatAvailabilityDTO> getSeatAvailability(Integer busId, String sourceStop, String destStop, LocalDate date) {
        // Find a schedule for this bus and date
        List<com.upsrtc.smartbus.model.BusSchedule> schedules = busScheduleRepository.findByBusIdAndTravelDate(busId, date);
        if (schedules.isEmpty()) return new ArrayList<>();
        return getSeatAvailabilityBySchedule(schedules.get(0).getId());
    }

    // ─── Bulk Operations ───────────────────────────────────────────────────

    @org.springframework.transaction.annotation.Transactional
    public void autoGenerateSeats(Integer busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found: " + busId));
        
        // Clear existing seats
        List<Seat> existing = seatRepository.findByBusId(busId);
        seatRepository.deleteAll(existing);

        List<Seat> newSeats = new ArrayList<>();
        int total = bus.getTotalSeats() != null ? bus.getTotalSeats() : 40;
        boolean isMulti = bus.getIsMultiDeck() != null && bus.getIsMultiDeck();
        
        if (bus.getBusType() == Bus.BusType.SLEEPER) {
            // sleeper logic (L for Lower, U for Upper)
            for (int i = 1; i <= total / 2; i++) {
                newSeats.add(createSeatObj(bus, i + "L", Seat.SeatType.SLEEPER, Seat.Position.WINDOW, 1200.0, Seat.Deck.LOWER));
                newSeats.add(createSeatObj(bus, i + "U", Seat.SeatType.SLEEPER, Seat.Position.WINDOW, 1000.0, Seat.Deck.UPPER));
            }
        } else {
            // seater logic (rows of 4)
            for (int i = 1; i <= total; i++) {
                Seat.Position pos = (i % 4 == 0 || i % 4 == 1) ? Seat.Position.WINDOW : Seat.Position.AISLE;
                Seat.Deck deck = (isMulti && i > total / 2) ? Seat.Deck.UPPER : Seat.Deck.LOWER;
                newSeats.add(createSeatObj(bus, String.valueOf(i), Seat.SeatType.SEATER, pos, 600.0, deck));
            }
        }
        
        seatRepository.saveAll(newSeats);
        
        // Sync available seats count
        bus.setAvailableSeats(newSeats.size());
        busRepository.save(bus);
    }

    private Seat createSeatObj(Bus bus, String num, Seat.SeatType type, Seat.Position pos, Double price, Seat.Deck deck) {
        Seat seat = new Seat();
        seat.setBus(bus);
        seat.setSeatNumber(num);
        seat.setSeatType(type);
        seat.setPosition(pos);
        seat.setPrice(price);
        seat.setIsBooked(false);
        seat.setDeck(deck);
        return seat;
    }

    public void updateSeatPriceBulk(Integer busId, Seat.SeatType type, Double price) {
        List<Seat> seats = seatRepository.findByBusId(busId);
        for (Seat s : seats) {
            if (type == null || s.getSeatType() == type) {
                s.setPrice(price);
            }
        }
        seatRepository.saveAll(seats);
    }

    // ─── Admin analytics: occupancy per bus ──────────────────────────────────

    public List<BusSeatStatusDTO> getBusSeatStatus() {
        List<Bus> buses = busRepository.findAll();
        List<BusSeatStatusDTO> result = new ArrayList<>();

        for (Bus bus : buses) {
            if (bus.getStatus() != Bus.Status.ACTIVE) continue;

            long total  = seatRepository.countByBusId(bus.getId());
            if (total == 0) continue;

            long booked    = bookingSeatRepository.countBookedSeatsByBusId(bus.getId());
            long available = total - booked;
            double occupancy = (double) booked / total * 100;

            result.add(new BusSeatStatusDTO(
                    bus.getId(),
                    bus.getBusNumber(),
                    bus.getBusType().name(),
                    total,
                    booked,
                    available,
                    Math.round(occupancy * 10.0) / 10.0
            ));
        }
        return result;
    }
}



