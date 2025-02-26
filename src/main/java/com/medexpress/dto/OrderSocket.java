package com.medexpress.dto;

public class OrderSocket {

    // user id and common package class
    private String orderId;
    private String userId;
    private String drugId;
    private CommonDrug drugPackage;

    public OrderSocket(String orderId, String userId, String drugId, CommonDrug drugPackage) {
        this.userId = userId;
        this.drugPackage = drugPackage;
        this.orderId = orderId;
        this.drugId = drugId;

    }

    // getter
    public String getUserId() {
        return userId;
    }

    public CommonDrug getDrugPackage() {
        return drugPackage;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getDrugId() {
        return drugId;
    }

    // setter
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setDrugPackage(CommonDrug drugPackage) {
        this.drugPackage = drugPackage;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public void setDrugId(String drugId) {
        this.drugId = drugId;
    }

}
