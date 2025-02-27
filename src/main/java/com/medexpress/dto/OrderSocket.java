package com.medexpress.dto;

public class OrderSocket {

    // order id
    private String orderId;
    private String statusEntity; // "statusDoctor" or "statusPharmacy"
    private String statusMessage; // "APPROVED" or "REJECTED"

    public OrderSocket( String orderId, String statusEntity, String statusMessage) {
        this.orderId = orderId;
        this.statusEntity = statusEntity;
        this.statusMessage = statusMessage;
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

}
