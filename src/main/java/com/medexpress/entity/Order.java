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
    private String idPackage;
    private ObjectId idUser;
    private String idDrug;    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Order(String idPackage, ObjectId idUser, String idDrug, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.idPackage = idPackage;
        this.idUser = idUser;
        this.idDrug = idDrug;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}
