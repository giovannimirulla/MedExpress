package com.medexpress.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "icons")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Icon {
    @Id
    private ObjectId id;
    private String name;
    private String type;
    private String color;

    public Icon(String name, String type, String color) {
        this.name = name;
        this.type = type;
        this.color = color;
    }


}