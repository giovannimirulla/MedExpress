package com.medexpress.dto;


public class OrderDTO {
    private String packageId;
    private String userId;
    private String drugId;

    public OrderDTO() {
    }

    public OrderDTO(String packageId, String userId, String drugId) {
        this.packageId = packageId;
        this.userId = userId;
        this.drugId = drugId;
    }

    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDrugId() {
        return drugId;
    }

    public void setDrugId(String drugId) {
        this.drugId = drugId;
    }
}
