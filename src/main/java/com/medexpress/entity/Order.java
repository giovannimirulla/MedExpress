package com.medexpress.entity;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.medexpress.dto.CommonDrug;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Order {
    @Id
    private ObjectId id;
    private String packageId;
    private User user; // This is the user who made the order
    private User driver;
    private Pharmacy pharmacy; // This is the pharmacy that will prepare the order
    private String drugId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private StatusPharmacy statusPharmacy;
    private StatusDriver statusDriver;
    private StatusDoctor statusDoctor;
    private Priority priority;

    // Campo transitorio per i dettagli del package recuperato da AifaService.
    @JsonProperty("drugPackage")
    private transient CommonDrug drugPackage;

    public Order(String packageId, User user, User driver, Pharmacy pharmacy, String drugId, LocalDateTime createdAt,
            LocalDateTime updatedAt, StatusPharmacy statusPharmacy, StatusDriver statusDriver,
            StatusDoctor statusDoctor, Priority priority) {
        this.packageId = packageId;
        this.user = user;
        this.driver = driver;
        this.pharmacy = pharmacy;
        this.drugId = drugId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.statusPharmacy = statusPharmacy;
        this.statusDriver = statusDriver;
        this.statusDoctor = statusDoctor;
        this.priority = priority;
    }

    public enum StatusDoctor {
        PENDING,
        APPROVED,
        REJECTED,
        NO_APPROVAL_NEEDED
    }

    public enum StatusPharmacy {
        PENDING,
        UNDER_PREPARATION,
        READY_FOR_PICKUP,
        DELIVERED_TO_DRIVER
    }

    public enum StatusDriver {
        PENDING,
        TAKEN_OVER,
        IN_DELIVERY,
        DELIVERED_TO_USER
    }

    public enum Priority {
        NORMAL,
        HIGH
    }

    //get id returns a string
    public String getId() {
        return id.toString();
    }
}
