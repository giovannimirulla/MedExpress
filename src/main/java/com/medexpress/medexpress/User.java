package com.medexpress.medexpress;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    
    @Id
    private ObjectId id;
    private String name;
    private String surname;
    private String fiscalCode;
    private String address;
    private String email;
    private String password;
    private Number role;
    private ObjectId doctor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User(String name, String surname, String fiscalCode, String address, String email, String password, Number role, ObjectId doctor, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.name = name;
        this.surname = surname;
        this.fiscalCode = fiscalCode;
        this.address = address;
        this.email = email;
        this.password = password;
        this.role = role;
        this.doctor = doctor;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
