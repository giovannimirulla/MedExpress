package com.medexpress.dto;

import com.medexpress.entity.Order;

public class OrderSocket {

    // order id
    private String orderId;
    private CommonDrug drugPackage;
    private String statusEntity; // "statusDoctor" or "statusPharmacy"
    private String statusMessage; // "APPROVED" or "REJECTED"
    private String updatedAt;
    private Order.Priority priority;
    private EntityDTO updatedBy;


    public OrderSocket( String orderId, CommonDrug drugPackage, String statusEntity, String statusMessage, String updatedAt, Order.Priority priority, EntityDTO updatedBy) {
        this.orderId = orderId;
        this.drugPackage = drugPackage;
        this.statusEntity = statusEntity;
        this.statusMessage = statusMessage;
        this.updatedAt = updatedAt;
        this.priority = priority;
        this.updatedBy = updatedBy;
    }

    //Getters and Setters
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
        return updatedAt;
    }

    public void setUpdateAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Order.Priority getPriority() {
        return priority;
    }

    public void setPriority(Order.Priority priority) {
        this.priority = priority;
    }

    public EntityDTO getUpdateFrom() {
        return updatedBy;
    }

    public void setUpdateFrom(EntityDTO updatedBy) {
        this.updatedBy = updatedBy;
    }

}
