package com.medexpress.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medexpress.entity.User;
import com.medexpress.service.EncryptionService;
import com.medexpress.service.UserService;
import com.medexpress.validator.UserValidator;
import com.medexpress.dto.UserDTO;
import com.medexpress.dto.UserRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import org.modelmapper.ModelMapper;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    
    private final UserService userService;
    private final EncryptionService encryptionService;
    private final ModelMapper modelMapper;
    
    public UserController(UserService userService, EncryptionService encryptionService, ModelMapper modelMapper) {
        this.userService = userService;
        this.encryptionService = encryptionService;
        this.modelMapper = modelMapper;
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<List<User>>(userService.getAllUsers(), HttpStatus.OK);
    }


    @PostMapping()
    public ResponseEntity<UserDTO> createUser(@RequestBody UserRequest body) {

        UserValidator.validate(body);

        String encryptedPassword = encryptionService.encryptPassword(body.getPassword());
        User user;

        if(User.Role.valueOf(body.getRole()) == User.Role.DOCTOR && body.getDoctorId() == null) {
           user = userService.createUser(body.getName(), body.getSurname(), body.getFiscalCode(), body.getAddress(), body.getEmail(), encryptedPassword, body.getRole(), null);
           userService.updateDoctorId(user.getId().toString(), user.getId().toString());
        } else {
            if(body.getDoctorId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select a doctor");
            }
           user = userService.createUser(body.getName(), body.getSurname(), body.getFiscalCode(), body.getAddress(), body.getEmail(), encryptedPassword, body.getRole(), body.getDoctorId());
        }
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        
        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }
}
