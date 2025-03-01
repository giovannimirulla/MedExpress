package com.medexpress.dto;

import java.time.LocalDateTime;

public class OrderSocket {

    // order id
    private String orderId;
    private String statusEntity; // "statusDoctor" or "statusPharmacy"
    private String statusMessage; // "APPROVED" or "REJECTED"
    private LocalDateTime updateAt;

    public OrderSocket( String orderId, String statusEntity, String statusMessage, LocalDateTime updateAt) {
        this.orderId = orderId;
        this.statusEntity = statusEntity;
        this.statusMessage = statusMessage;
        this.updateAt = updateAt;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getStatusEntity() {
        return statusEntity;
    }

    public void setStatusEntity(String statusEntity) {
        this.statusEntity = statusEntity;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }



}
