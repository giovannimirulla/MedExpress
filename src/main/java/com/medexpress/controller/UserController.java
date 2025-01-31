package com.medexpress.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medexpress.entity.User;
import com.medexpress.service.EncryptionService;
import com.medexpress.service.UserService;
import com.medexpress.validator.UserValidator;
import com.medexpress.dto.UserDTO;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private EncryptionService encryptionService;
    
    public UserController(UserService userService, EncryptionService encryptionService) {
        this.userService = userService;
        this.encryptionService = encryptionService;
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<List<User>>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return new ResponseEntity<List<User>>(userService.getAllDoctors(), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<UserDTO> createUser(@RequestBody Map<String, String> body) {

        UserValidator.validate(body);

        String encryptedPassword = encryptionService.encryptPassword(body.get("password"));

        User user = userService.createUser(body.get("name"), body.get("surname"), body.get("fiscalCode"), body.get("address"), body.get("email"), encryptedPassword, Integer.parseInt(body.get("role")), new ObjectId(body.get("doctor")));

        UserDTO userDTO = new UserDTO(user.getName(), user.getSurname(), user.getFiscalCode(), user.getAddress(), user.getEmail(), user.getRole(), user.getDoctor());

        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }
}
