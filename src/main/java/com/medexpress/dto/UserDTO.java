package com.medexpress.dto;

import org.bson.types.ObjectId;

public class UserDTO {
    private String name;
    private String surname;
    private String fiscalCode;
    private String address;
    private String email;
    private Number role;
    private ObjectId doctor;

    // Getter
    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getFiscalCode() {
        return fiscalCode;
    }

    public String getAddress() {
        return address;
    }

    public String getEmail() {
        return email;
    }

    public Number getRole() {
        return role;
    }

    public ObjectId getDoctor() {
        return doctor;
    }

    // Setter
    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setFiscalCode(String fiscalCode) {
        this.fiscalCode = fiscalCode;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(Number role) {
        this.role = role;
    }

    public void setDoctor(ObjectId doctor) {
        this.doctor = doctor;
    }

}
