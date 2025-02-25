
package com.medexpress.entity;

import java.time.LocalDateTime;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Document(collection = "roles")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Role {
    @Id
    private ObjectId id;
    @Indexed(unique = true)
    private String name;
    private String description;
    private List<String> permissions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //Counstructor
    public Role(String name, String description, List<String> permissions, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
}
