package com.upsrtc.smartbus.dto;

public class DashboardStatsDTO {
    private long upcomingTrips;
    private long pastTrips;
    private long cancelledTrips;
    private long totalTrips;
    private long activePasses;

    // Getters and Setters
    public long getUpcomingTrips() { return upcomingTrips; }
    public void setUpcomingTrips(long upcomingTrips) { this.upcomingTrips = upcomingTrips; }

    public long getPastTrips() { return pastTrips; }
    public void setPastTrips(long pastTrips) { this.pastTrips = pastTrips; }

    public long getCancelledTrips() { return cancelledTrips; }
    public void setCancelledTrips(long cancelledTrips) { this.cancelledTrips = cancelledTrips; }

    public long getTotalTrips() { return totalTrips; }
    public void setTotalTrips(long totalTrips) { this.totalTrips = totalTrips; }

    public long getActivePasses() { return activePasses; }
    public void setActivePasses(long activePasses) { this.activePasses = activePasses; }
}
