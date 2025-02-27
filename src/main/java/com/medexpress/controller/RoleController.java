package com.medexpress.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medexpress.service.RoleService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.medexpress.entity.Role;
import java.util.List;

@RestController
@RequestMapping("/api/v1/role")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping()

    public ResponseEntity<Role> createRole(@RequestBody Role body) {

        Role role = roleService.createRole(body.getName(), body.getDescription(), body.getPermissions()); // This line of code is used to create a new
                                                                            // role.
        return new ResponseEntity<>(role, HttpStatus.CREATED);

    }

    //return list of all roles
    @RequestMapping("/all")
    public ResponseEntity<List<Role>> findAll() {
        List<Role> roles = (List<Role>) roleService.findAll();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }
    
}
