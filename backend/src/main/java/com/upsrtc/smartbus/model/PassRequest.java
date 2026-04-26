package com.upsrtc.smartbus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pass_requests")
public class PassRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer userId;
    private Integer routeId;
    
    @Enumerated(EnumType.STRING)
    private Bus.BusType busType;

    @Enumerated(EnumType.STRING)
    private RequestType requestType;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private Double price;
    private String transactionId;
    private String paymentStatus = "PENDING";
    private String remarks;
    
    private LocalDateTime appliedAt = LocalDateTime.now();
    private LocalDateTime approvedAt;

    public enum RequestType {
        MONTHLY_PASS, SMART_CARD
    }

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    // Manual Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getRouteId() { return routeId; }
    public void setRouteId(Integer routeId) { this.routeId = routeId; }
    public Bus.BusType getBusType() { return busType; }
    public void setBusType(Bus.BusType busType) { this.busType = busType; }
    public RequestType getRequestType() { return requestType; }
    public void setRequestType(RequestType requestType) { this.requestType = requestType; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
}
