package com.medexpress.dto;

import com.medexpress.entity.Order;

public class UpdateStatusDriverRequest {
    private String orderId;
    private Order.StatusDriver status;

    public UpdateStatusDriverRequest() {
    }

    public UpdateStatusDriverRequest(String orderId, Order.StatusDriver status) {
        this.orderId = orderId;
        this.status = status;
    }

    public String getOrderId() {
        return this.orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Order.StatusDriver getStatus() {
        return this.status;
    }

    public void setStatus(Order.StatusDriver status) {
        this.status = status;
    }
}

