package com.medexpress.entity;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Document(collection = "pharmacies")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Pharmacy {
    @Id
    private ObjectId id;
    private String companyName;
    @Indexed(unique = true)
    private String VATnumber;
    private String address;
    @Indexed(unique = true)
    private String email;
    private String password;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public Pharmacy(String companyName, String VATnumber, String address, String email, String password, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.companyName = companyName;
        this.VATnumber = VATnumber;
        this.address = address;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


}
