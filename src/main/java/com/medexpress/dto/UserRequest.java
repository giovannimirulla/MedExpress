package com.medexpress.dto;

public class UserRequest {
    private String name;
    private String surname;
    private String fiscalCode;
    private String address;
    private String email;
    private String roleId;
    private String doctorId;
    private String password;

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

    public String getRoleId() {
        return roleId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public String getPassword() {
        return password;
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

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
}
