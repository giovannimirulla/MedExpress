package com.medexpress.dto;

import com.medexpress.entity.Order;

public class UpdateStatusPharmacyRequest {
    private String orderId;
    private Order.StatusPharmacy status;

    public UpdateStatusPharmacyRequest() {
    }

    public UpdateStatusPharmacyRequest(String orderId, Order.StatusPharmacy status) {
        this.orderId = orderId;
        this.status = status;
    }

    public String getOrderId() {
        return this.orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Order.StatusPharmacy getStatus() {
        return this.status;
    }

    public void setStatus(Order.StatusPharmacy status) {
        this.status = status;
    }
}

