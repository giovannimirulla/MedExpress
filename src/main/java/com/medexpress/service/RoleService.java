package com.medexpress.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.medexpress.repository.RoleRepository;
import com.medexpress.entity.Role;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    // create role
    public Role createRole(String name, String description, List<String> permissions) {

        // create role
        Role role = new Role(name, description, permissions, LocalDateTime.now(), LocalDateTime.now());
        return roleRepository.save(role);
    }

    //return list of all roles
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    //find role by name
    public Role findByName(String name) {
        return roleRepository.findByName(name).orElse(null);
    }
    
}
