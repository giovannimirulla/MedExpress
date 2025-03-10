package com.medexpress.dto;

public class OrderSocket {

    // order id
    private String orderId;
    private CommonDrug drugPackage;
    private String statusEntity; // "statusDoctor" or "statusPharmacy"
    private String statusMessage; // "APPROVED" or "REJECTED"
    private String updateAt;


    public OrderSocket( String orderId, CommonDrug drugPackage, String statusEntity, String statusMessage, String updateAt) {
        this.orderId = orderId;
        this.drugPackage = drugPackage;
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



}
