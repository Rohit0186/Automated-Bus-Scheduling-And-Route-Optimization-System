package com.upsrtc.smartbus.dto;










public class DashboardSummaryDTO {
    private long totalBuses;
    private long activeBuses;
    private long totalRoutes;
    private long runningTrips;
    private long totalUsers;
    private double todayRevenue;

    // Trends (percentage change or absolute difference)
    private String busesTrend = "+2%";
    private String activeTrend = "+5%";
    private String routesTrend = "0%";
    private String tripsTrend = "+12%";
    private String usersTrend = "+8%";
    private String revenueTrend = "+15%";

    // Manual Getters/Setters
    public long getTotalBuses() { return totalBuses; }
    public void setTotalBuses(long totalBuses) { this.totalBuses = totalBuses; }
    public long getActiveBuses() { return activeBuses; }
    public void setActiveBuses(long activeBuses) { this.activeBuses = activeBuses; }
    public long getTotalRoutes() { return totalRoutes; }
    public void setTotalRoutes(long totalRoutes) { this.totalRoutes = totalRoutes; }
    public long getRunningTrips() { return runningTrips; }
    public void setRunningTrips(long runningTrips) { this.runningTrips = runningTrips; }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public double getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(double todayRevenue) { this.todayRevenue = todayRevenue; }
    public String getBusesTrend() { return busesTrend; }
    public void setBusesTrend(String busesTrend) { this.busesTrend = busesTrend; }
    public String getActiveTrend() { return activeTrend; }
    public void setActiveTrend(String activeTrend) { this.activeTrend = activeTrend; }
    public String getRoutesTrend() { return routesTrend; }
    public void setRoutesTrend(String routesTrend) { this.routesTrend = routesTrend; }
    public String getTripsTrend() { return tripsTrend; }
    public void setTripsTrend(String tripsTrend) { this.tripsTrend = tripsTrend; }
    public String getUsersTrend() { return usersTrend; }
    public void setUsersTrend(String usersTrend) { this.usersTrend = usersTrend; }
    public String getRevenueTrend() { return revenueTrend; }
    public void setRevenueTrend(String revenueTrend) { this.revenueTrend = revenueTrend; }

    // Manual Constructors
    public DashboardSummaryDTO() {}
    public DashboardSummaryDTO(long totalBuses, long activeBuses, long totalRoutes, long runningTrips, long totalUsers, double todayRevenue, String busesTrend, String activeTrend, String routesTrend, String tripsTrend, String usersTrend, String revenueTrend) {
        this.totalBuses = totalBuses;
        this.activeBuses = activeBuses;
        this.totalRoutes = totalRoutes;
        this.runningTrips = runningTrips;
        this.totalUsers = totalUsers;
        this.todayRevenue = todayRevenue;
        this.busesTrend = busesTrend;
        this.activeTrend = activeTrend;
        this.routesTrend = routesTrend;
        this.tripsTrend = tripsTrend;
        this.usersTrend = usersTrend;
        this.revenueTrend = revenueTrend;
    }
}

