package com.medexpress.dto;

import com.medexpress.entity.User.Role;
import com.medexpress.entity.User;

public class UserDTO {
    private String id;
    private String name;
    private String surname;
    private String fiscalCode;
    private String address;
    private String email;
    private Role role;
    private UserDTO doctor;

    // Costruttore
    public UserDTO() {
    }

    // Costruttore
    public UserDTO(String id, String name, String surname, String fiscalCode, String address, String email, Role role, UserDTO doctor) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.fiscalCode = fiscalCode;
        this.address = address;
        this.email = email;
        this.role = role;
        this.doctor = doctor;
    }

    
    //fromUser
    public static UserDTO fromUser(User user) {
        if (user == null) {
            return null;
        }
        return new UserDTO(
            user.getId().toString(),
            user.getName(),
            user.getSurname(),
            user.getFiscalCode(),
            user.getAddress(),
            user.getEmail(),
            user.getRole(),
            user.getDoctor() != null ? UserDTO.fromUser(user.getDoctor()) : null
        );
    }

    // Getter
    public String getId() {
        return id;
    }
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

    public Role getRole() {
        return role;
    }

    public UserDTO getDoctor() {
        return doctor;
    }

    // Setter
    public void setId(String id) {
        this.id = id;
    }
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

    public void setRole(Role role) {
        this.role = role;
    }

    public void setDoctor(UserDTO doctor) {
        this.doctor = doctor;
    }

}
