package com.upsrtc.smartbus.service;

import com.upsrtc.smartbus.model.BusSchedule;
import com.upsrtc.smartbus.repository.BusScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@SuppressWarnings("null")
public class ScheduleStatusJob {

    @Autowired
    private BusScheduleRepository busScheduleRepository;

    @Scheduled(fixedRate = 300000) // Every 5 minutes
    @Transactional
    public void updateScheduleStatuses() {
        LocalTime now = LocalTime.now();
        
        // 1. Mark ONGOING schedules as COMPLETED if arrival time passed
        List<BusSchedule> ongoingSchedules = busScheduleRepository.findCompletedSchedules(now);
        for (BusSchedule sch : ongoingSchedules) {
            sch.setStatus(BusSchedule.Status.COMPLETED);
        }
        busScheduleRepository.saveAll(ongoingSchedules);

        // 2. Mark UPCOMING schedules as ONGOING if departure time passed
        // (Optional logic, but good for completeness)
        List<BusSchedule> upcoming = busScheduleRepository.findByStatus(BusSchedule.Status.UPCOMING);
        for (BusSchedule sch : upcoming) {
            if (now.isAfter(sch.getDepartureTime())) {
                sch.setStatus(BusSchedule.Status.ONGOING);
            }
        }
        busScheduleRepository.saveAll(upcoming);
        
        System.out.println("Schedule statuses updated at " + now);
    }
}
