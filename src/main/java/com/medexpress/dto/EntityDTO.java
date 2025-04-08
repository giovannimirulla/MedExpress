package com.medexpress.dto;

import com.medexpress.enums.AuthEntityType;

public class EntityDTO {

    private String id; // Id of user or pharmacy
    private AuthEntityType entityType;
    private String name;
    private String email;
    private String address;

    public EntityDTO() {
    }

    // Constructor
    public EntityDTO(String id, AuthEntityType entityType, String name, String email, String address) {
        this.id = id;
        this.entityType = entityType;
        this.name = name;
        this.email = email;
        this.address = address;
    }

    // Getter
    public String getId() {
        return id;
    }

    public AuthEntityType getEntityType() {
        return entityType;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    // Setter
    public void setId(String id) {
        this.id = id;
    }

    public void setEntityType(AuthEntityType entityType) {
        this.entityType = entityType;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
