package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.model.Schedule;
import com.upsrtc.smartbus.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@SuppressWarnings("null")
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    public Schedule createSchedule(Schedule schedule) {
        // Validation: No bus overlap
        List<Schedule> busSchedules = scheduleRepository.findOverlappingBusSchedules(
                schedule.getBus().getId(), 
                schedule.getDepartureDate(), 
                schedule.getDepartureTime(), 
                schedule.getEstimatedArrivalTime()
        );
        if (!busSchedules.isEmpty()) {
            throw new RuntimeException("Bus is already assigned to another schedule at this time");
        }

        // Validation: No driver overlap
        List<Schedule> driverSchedules = scheduleRepository.findOverlappingDriverSchedules(
                schedule.getDriver().getId(), 
                schedule.getDepartureDate(), 
                schedule.getDepartureTime(), 
                schedule.getEstimatedArrivalTime()
        );
        if (!driverSchedules.isEmpty()) {
            throw new RuntimeException("Driver is already assigned to another schedule at this time");
        }

        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Schedule updateSchedule(Integer id, Schedule scheduleDetails) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow();
        // Update fields
        schedule.setDepartureDate(scheduleDetails.getDepartureDate());
        schedule.setDepartureTime(scheduleDetails.getDepartureTime());
        schedule.setEstimatedArrivalTime(scheduleDetails.getEstimatedArrivalTime());
        schedule.setPrice(scheduleDetails.getPrice());
        schedule.setStatus(scheduleDetails.getStatus());
        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(Integer id) {
        scheduleRepository.deleteById(id);
    }
}



