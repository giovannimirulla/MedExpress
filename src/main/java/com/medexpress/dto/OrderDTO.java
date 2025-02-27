package com.medexpress.dto;

import java.time.LocalDateTime;

import com.medexpress.entity.Order.Priority;
import com.medexpress.entity.Order.StatusDoctor;
import com.medexpress.entity.Order.StatusDriver;
import com.medexpress.entity.Order.StatusPharmacy;




public class OrderDTO {
    private String id;
    private String drugId;
    private StatusPharmacy statusPharmacy;
    private StatusDriver statusDriver;
    private StatusDoctor statusDoctor;
    private Priority priority;
    private CommonDrug drugPackage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderDTO() {
    }

    public OrderDTO(String id, String drugId, StatusPharmacy statusPharmacy, StatusDriver statusDriver, StatusDoctor statusDoctor, Priority priority, CommonDrug drugPackage, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.drugId = drugId;
        this.statusPharmacy = statusPharmacy;
        this.statusDriver = statusDriver;
        this.statusDoctor = statusDoctor;
        this.priority = priority;
        this.drugPackage = drugPackage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public String getDrugId() {
        return drugId;
    }

    public StatusPharmacy getStatusPharmacy() {
        return statusPharmacy;
    }

    public StatusDriver getStatusDriver() {
        return statusDriver;
    }

    public StatusDoctor getStatusDoctor() {
        return statusDoctor;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setDrugId(String drugId) {
        this.drugId = drugId;
    }

    public void setStatusPharmacy(StatusPharmacy statusPharmacy) {
        this.statusPharmacy = statusPharmacy;
    }

    public void setStatusDriver(StatusDriver statusDriver) {
        this.statusDriver = statusDriver;
    }

    public void setStatusDoctor(StatusDoctor statusDoctor) {
        this.statusDoctor = statusDoctor;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public CommonDrug getDrugPackage() {
        return drugPackage;
    }

    public void setDrugPackage(CommonDrug drugPackage) {
        this.drugPackage = drugPackage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}
