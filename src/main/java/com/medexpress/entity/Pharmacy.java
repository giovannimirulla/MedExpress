package com.medexpress.entity;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "pharmacies") // This annotation is used to specify the name of the collection in the MongoDB database.
@Data // This annotation is used to generate getters and setters for the fields in the class.
@AllArgsConstructor // This annotation is used to generate a constructor with all the fields of the class as arguments.
@NoArgsConstructor // This annotation is used to generate a constructor with no arguments.
public class Pharmacy {
    @Id // This annotation is used to specify the primary key of the document.
    private ObjectId id;
    private String companyName;
    @Indexed(unique = true)
    private String vatNumber;
    private String address;
    @Indexed(unique = true)
    private String email;
    private String password;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // This constructor is used to create a new instance of the Pharmacy class
    public Pharmacy(String companyName, String vatNumber, String address, String email, String password, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.companyName = companyName;
        this.vatNumber = vatNumber;
        this.address = address;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


}
