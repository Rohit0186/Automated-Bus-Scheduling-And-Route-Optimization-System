package com.upsrtc.smartbus.dto;








public class StopDTO {
    private Integer stopId;
    private String stopName;
    private Double latitude;
    private Double longitude;
    private Integer stopOrder;
    private long etaMinutes;
    private boolean isCurrentStop;
    private boolean isNextStop;
    private boolean isPassed;

    // Manual Getters/Setters
    public Integer getStopId() { return stopId; }
    public void setStopId(Integer stopId) { this.stopId = stopId; }
    public String getStopName() { return stopName; }
    public void setStopName(String stopName) { this.stopName = stopName; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Integer getStopOrder() { return stopOrder; }
    public void setStopOrder(Integer stopOrder) { this.stopOrder = stopOrder; }
    public long getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(long etaMinutes) { this.etaMinutes = etaMinutes; }
    public boolean isCurrentStop() { return isCurrentStop; }
    public void setCurrentStop(boolean currentStop) { isCurrentStop = currentStop; }
    public boolean isNextStop() { return isNextStop; }
    public void setNextStop(boolean nextStop) { isNextStop = nextStop; }
    public boolean isPassed() { return isPassed; }
    public void setPassed(boolean passed) { isPassed = passed; }
}

