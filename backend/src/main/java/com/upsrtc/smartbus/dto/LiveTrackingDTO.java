package com.upsrtc.smartbus.dto;




import java.util.List;




public class LiveTrackingDTO {
    private Integer busId;
    private String busNumber;
    private Integer scheduleId;

    private Double currentLat;
    private Double currentLng;
    private Double speed;

    private String currentStop;
    private String nextStop;
    private long etaMinutes;        // ETA to next stop in minutes

    private String status;          // ON_TIME | DELAYED
    private String delayInfo;

    private long timestamp;         // Current server time in ms

    private List<StopDTO> routeStops;
    private List<double[]> polyline; // [[lat, lng], ...] for Leaflet

    // Manual Getters/Setters
    public Integer getBusId() { return busId; }
    public void setBusId(Integer busId) { this.busId = busId; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public Integer getScheduleId() { return scheduleId; }
    public void setScheduleId(Integer scheduleId) { this.scheduleId = scheduleId; }
    public Double getCurrentLat() { return currentLat; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }
    public Double getCurrentLng() { return currentLng; }
    public void setCurrentLng(Double currentLng) { this.currentLng = currentLng; }
    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }
    public String getCurrentStop() { return currentStop; }
    public void setCurrentStop(String currentStop) { this.currentStop = currentStop; }
    public String getNextStop() { return nextStop; }
    public void setNextStop(String nextStop) { this.nextStop = nextStop; }
    public long getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(long etaMinutes) { this.etaMinutes = etaMinutes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDelayInfo() { return delayInfo; }
    public void setDelayInfo(String delayInfo) { this.delayInfo = delayInfo; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public List<StopDTO> getRouteStops() { return routeStops; }
    public void setRouteStops(List<StopDTO> routeStops) { this.routeStops = routeStops; }
    public List<double[]> getPolyline() { return polyline; }
    public void setPolyline(List<double[]> polyline) { this.polyline = polyline; }
}

