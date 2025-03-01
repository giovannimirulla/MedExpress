package com.medexpress.dto;

import com.medexpress.entity.Order;

public class UpdateStatusDoctorRequest {
    private String orderId;
    private Order.StatusDoctor status;

    public UpdateStatusDoctorRequest() {
    }

    public UpdateStatusDoctorRequest(String orderId, Order.StatusDoctor status) {
        this.orderId = orderId;
        this.status = status;
    }

    public String getOrderId() {
        return this.orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Order.StatusDoctor getStatus() {
        return this.status;
    }

    public void setStatus(Order.StatusDoctor status) {
        this.status = status;
    }
}

