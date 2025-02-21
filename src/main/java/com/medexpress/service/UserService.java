package com.medexpress.service;

import java.util.List;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.entity.User;
import com.medexpress.repository.UserRepository;
import java.util.Collections;

import org.bson.types.ObjectId;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllDoctors() {
        return userRepository.findAllByRole(2);
    }

    // create user
    public User createUser(String name, String surname, String fiscalCode, String address, String email,
            String password, Number role, ObjectId doctor) {

        // check if the user already exists by email and fiscal code // userRepository.existsByEmail(email);
        boolean existsByEmail = userRepository.existsByEmail(email);
        boolean existsByFiscalCode = userRepository.existsByFiscalCode(fiscalCode);

        // if user already exists by email or fiscal code, return error message
        if (existsByEmail) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"User with email " + email + " already exists");
        }
        if (existsByFiscalCode) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"User with fiscal code " + fiscalCode + " already exists");
        }

        User user = userRepository.insert(new User(name, surname, fiscalCode, address, email, password, role, doctor,
                LocalDateTime.now(), LocalDateTime.now()));
        return user;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    //find user by id
    public UserDetails findById(String id) {
        User user = userRepository.findById(new ObjectId(id)).orElse(null);
        if(user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id " + id + " not found");
        } 
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Collections.emptyList());
    }
    

}
