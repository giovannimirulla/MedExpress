package com.medexpress.entity;

public class OrderStatusMessage { // This class is used to represent the order status message for the client

    private String orderId;
    private String status;

    // Constructor
    public  OrderStatusMessage(String orderId, String status) {
        this.orderId = orderId;
        this.status = status;
    }

    // Getters methods
    public String getOrderId() {
        return orderId;
    }

    public String getStatus() {
        return status;
    }

    // Setters methods
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}