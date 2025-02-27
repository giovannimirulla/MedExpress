package com.medexpress.dto;

public class OrderRequest {
    private String packageId;
    private String userId;
    private String drugId;

    public OrderRequest() {
    }

    public OrderRequest(String packageId, String userId, String drugId) {
        this.packageId = packageId;
        this.userId = userId;
        this.drugId = drugId;
    }

    public String getPackageId() {
        return packageId;
    }

    public String getUserId() {
        return userId;
    }

    public String getDrugId() {
        return drugId;
    }
    
    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setDrugId(String drugId) {
        this.drugId = drugId;
    }
}
