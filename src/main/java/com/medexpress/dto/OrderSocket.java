package com.medexpress.dto;

import com.medexpress.entity.Order;

public class OrderSocket {

    // order id
    private String orderId;
    private CommonDrug drugPackage;
    private String statusEntity; // "statusDoctor" or "statusPharmacy"
    private String statusMessage; // "APPROVED" or "REJECTED"
    private String updateAt;
    private Order.Priority priority;
    private String sender;


    public OrderSocket( String orderId, CommonDrug drugPackage, String statusEntity, String statusMessage, String updateAt, Order.Priority priority, String sender) {
        this.orderId = orderId;
        this.drugPackage = drugPackage;
        this.statusEntity = statusEntity;
        this.statusMessage = statusMessage;
        this.updateAt = updateAt;
        this.priority = priority;
        this.sender = sender;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public CommonDrug getDrugPackage() {
        return drugPackage;
    }

    public void setDrugPackage(CommonDrug drugPackage) {
        this.drugPackage = drugPackage;
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

    public String getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(String updateAt) {
        this.updateAt = updateAt;
    }

    public Order.Priority getPriority() {
        return priority;
    }

    public void setPriority(Order.Priority priority) {
        this.priority = priority;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

}
