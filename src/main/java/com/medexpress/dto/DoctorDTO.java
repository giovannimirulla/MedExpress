package com.medexpress.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.medexpress.entity.User;

public class DoctorDTO {
    //only id name and surname
    private String id;
    private String name;
    private String surname;

    public DoctorDTO() {
    }

    public DoctorDTO(String id, String name, String surname) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getSurname() {
        return this.surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

     public static List<DoctorDTO> fromEntityList(List<User> users) {
        return users.stream()
                    .map(user -> new DoctorDTO(user.getId().toString(), user.getName(), user.getSurname()))
                    .collect(Collectors.toList());
    }
    
}
