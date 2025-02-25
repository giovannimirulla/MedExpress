package com.medexpress.entity;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Order {
    @Id
    private ObjectId id;
    private String packageId;
    private User user;
    private String drugId;    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private StatusPharmacy statusPharmacy;
    private StatusDriver statusDriver;
    private StatusDoctor statusDoctor;
    private Priority priority;

    public Order(String packageId, User user, String drugId, LocalDateTime createdAt, LocalDateTime updatedAt, StatusPharmacy statusPharmacy, StatusDriver statusDriver, StatusDoctor statusDoctor, Priority priority) {
        this.packageId = packageId;
        this.user = user;
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
        REJECTED
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
        DELIVERED_TO_THE_USER
        
    }

    public enum Priority {
        LOW,
        HIGH
    }

}
