package com.medexpress.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpStatus;

import com.medexpress.entity.User;

import com.medexpress.service.UserService;

@RestController
@RequestMapping("/api/v1/doctor")
public class DoctorController {

    @Autowired
    private UserService userService;

    public DoctorController(UserService userService) {
        this.userService = userService;
    }

    // search doctor by name or lastname using one query string
    @RequestMapping("/search")
    public ResponseEntity<List<User>> searchDoctor(@RequestParam String query) {
        return new ResponseEntity<List<User>>(userService.searchDoctor(query), HttpStatus.OK);
    }
}
