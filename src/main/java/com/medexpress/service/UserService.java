package com.medexpress.service;

import java.util.List;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medexpress.entity.User;
import com.medexpress.repository.UserRepository;

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

        User user = userRepository.insert(new User(name, surname, fiscalCode, address, email, password, role, doctor,
                LocalDateTime.now(), LocalDateTime.now()));
        return user;
    }

   
}
