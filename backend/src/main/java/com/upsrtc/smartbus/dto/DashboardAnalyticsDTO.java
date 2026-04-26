package com.upsrtc.smartbus.dto;





import java.util.List;
import java.util.Map;





public class DashboardAnalyticsDTO {
    private List<ChartDataPoint> revenueChart;
    private List<ChartDataPoint> tripsChart;
    private List<Map<String, Object>> routeUsage;
    private List<Map<String, Object>> passStats;

    // Manual Getters/Setters
    public List<ChartDataPoint> getRevenueChart() { return revenueChart; }
    public void setRevenueChart(List<ChartDataPoint> revenueChart) { this.revenueChart = revenueChart; }
    public List<ChartDataPoint> getTripsChart() { return tripsChart; }
    public void setTripsChart(List<ChartDataPoint> tripsChart) { this.tripsChart = tripsChart; }
    public List<Map<String, Object>> getRouteUsage() { return routeUsage; }
    public void setRouteUsage(List<Map<String, Object>> routeUsage) { this.routeUsage = routeUsage; }
    public List<Map<String, Object>> getPassStats() { return passStats; }
    public void setPassStats(List<Map<String, Object>> passStats) { this.passStats = passStats; }

    // Manual Constructors
    public DashboardAnalyticsDTO() {}
    public DashboardAnalyticsDTO(List<ChartDataPoint> revenueChart, List<ChartDataPoint> tripsChart, List<Map<String, Object>> routeUsage, List<Map<String, Object>> passStats) {
        this.revenueChart = revenueChart;
        this.tripsChart = tripsChart;
        this.routeUsage = routeUsage;
        this.passStats = passStats;
    }

    
    
    
    public static class ChartDataPoint {
        private String label;
        private double value;

        // Manual Getters/Setters
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }

        // Manual Constructors
        public ChartDataPoint() {}
        public ChartDataPoint(String label, double value) {
            this.label = label;
            this.value = value;
        }
    }
}

