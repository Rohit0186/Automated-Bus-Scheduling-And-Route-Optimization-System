package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.dto.BookingRequest;
import com.upsrtc.smartbus.dto.DashboardStatsDTO;
import com.upsrtc.smartbus.model.*;
import com.upsrtc.smartbus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@SuppressWarnings("null")
public class BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PaymentRepository paymentRepository;

    @Autowired private BusRepository busRepository;
    @Autowired private com.upsrtc.smartbus.repository.BusScheduleRepository busScheduleRepository;
    @Autowired private com.upsrtc.smartbus.repository.PassRequestRepository passRequestRepository;
    @Autowired private com.upsrtc.smartbus.service.TicketService ticketService;

    @Transactional
    public Booking createBooking(BookingRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Bus bus = busRepository.findById(request.getBusId()).orElseThrow(() -> new RuntimeException("Bus not found"));

        if (request.getSeatNumbers() == null || request.getSeatNumbers().isEmpty()) {
            throw new IllegalArgumentException("No seats selected");
        }

        LocalDate reqDate = request.getTravelDate() != null ? request.getTravelDate() : LocalDate.now();

        // Check for double booking for the specific schedule
        if (request.getScheduleId() != null) {
            List<Booking> scheduleBookings = bookingRepository.findByBusScheduleId(request.getScheduleId());
            for (String reqSeat : request.getSeatNumbers()) {
                for (Booking b : scheduleBookings) {
                    if (b.getStatus() == Booking.Status.CANCELLED) continue;
                    if (b.getSeatNumbers() != null) {
                        String[] bookedSeats = b.getSeatNumbers().split(",");
                        for (String bs : bookedSeats) {
                            if (bs.trim().equalsIgnoreCase(reqSeat.trim())) {
                                throw new RuntimeException("Seat " + reqSeat + " is already booked for this trip.");
                            }
                        }
                    }
                }
            }
        } else {
            // Fallback for legacy requests without scheduleId
            List<Booking> existingBookings = bookingRepository.findByBusId(bus.getId());
            for (String reqSeat : request.getSeatNumbers()) {
                for (Booking b : existingBookings) {
                    if (b.getStatus() == Booking.Status.CANCELLED) continue;
                    LocalDate bDate = b.getTravelDate() != null ? b.getTravelDate() : b.getBookingTime().toLocalDate();
                    if (!bDate.equals(reqDate)) continue;
                    if (b.getSeatNumbers() != null) {
                        String[] bookedSeats = b.getSeatNumbers().split(",");
                        for (String bs : bookedSeats) {
                            if (bs.trim().equalsIgnoreCase(reqSeat.trim())) {
                                throw new RuntimeException("Seat " + reqSeat + " already booked for " + reqDate);
                            }
                        }
                    }
                }
            }
        }

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setBus(bus);
        
        if (request.getScheduleId() != null) {
            BusSchedule schedule = busScheduleRepository.findById(request.getScheduleId()).orElse(null);
            booking.setBusSchedule(schedule);
        }

        booking.setTravelDate(reqDate);
        booking.setSeatNumbers(String.join(",", request.getSeatNumbers()));
        booking.setSourceStop(request.getSourceStop());
        booking.setDestinationStop(request.getDestinationStop());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setStatus(Booking.Status.CONFIRMED);
        booking = bookingRepository.save(booking);

        // Create initial payment record (SUCCESS for simulation)
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(request.getTotalAmount());
        payment.setPaymentMethod("MOCK_ONLINE");
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setTransactionId("TXN-" + System.currentTimeMillis());
        paymentRepository.save(payment);

        // Generate Ticket for the booking
        Ticket ticket = new Ticket();
        ticket.setBookingId(booking.getId());
        ticket.setUserId(user.getId());
        ticket.setBusId(bus.getId());
        ticket.setSource(booking.getSourceStop());
        ticket.setDestination(booking.getDestinationStop());
        ticket.setSeatNumber(booking.getSeatNumbers());
        ticket.setJourneyDate(booking.getTravelDate());
        ticket.setFare(booking.getTotalAmount());
        ticketService.bookTicket(ticket);

        return booking;
    }

    @Transactional
    public void cancelBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new RuntimeException("Booking already cancelled");
        }
        
        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return bookingRepository.findByUserId(user.getId());
    }

    public Booking getBookingById(Integer id) {
        return bookingRepository.findById(id).orElseThrow();
    }

    public DashboardStatsDTO getStats(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Booking> all = bookingRepository.findByUserId(user.getId());
        LocalDate today = LocalDate.now();

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalTrips(all.size());
        stats.setUpcomingTrips(all.stream().filter(b -> b.getStatus() != Booking.Status.CANCELLED && (b.getTravelDate() != null && !b.getTravelDate().isBefore(today))).count());
        stats.setPastTrips(all.stream().filter(b -> b.getStatus() != Booking.Status.CANCELLED && (b.getTravelDate() != null && b.getTravelDate().isBefore(today))).count());
        stats.setCancelledTrips(all.stream().filter(b -> b.getStatus() == Booking.Status.CANCELLED).count());
        
        // Count active/approved passes
        stats.setActivePasses(passRequestRepository.findByUserId(user.getId()).stream()
                .filter(p -> PassRequest.Status.APPROVED == p.getStatus())
                .count());

        return stats;
    }
}



