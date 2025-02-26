package com.medexpress.service;

import java.util.List;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.entity.User;
import com.medexpress.entity.Role;
import com.medexpress.repository.UserRepository;
import com.medexpress.repository.RoleRepository;
import java.util.Collections;

import org.bson.types.ObjectId;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllDoctors() {
        Role doctorRole = roleRepository.findByName("Doctor")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor role not found"));
        return userRepository.findByRole(doctorRole);
    }

    public List<User> searchDoctor(String query) {
        Role doctorRole = roleRepository.findByName("Doctor")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor role not found"));
        return userRepository.findByRoleAndNameOrSurname(doctorRole, query, query);
    }


    // create user
    public User createUser(String name, String surname, String fiscalCode, String address, String email,
            String password, String roleId, String doctorId) {

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

        // find role by id
        Role role = roleRepository.findById(new ObjectId(roleId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role with id " + roleId + " not found"));

        // find doctor by id
        User doctor = doctorId != null ? userRepository.findById(new ObjectId(doctorId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor with id " + doctorId + " not found")) : null; // if doctorId is null, set doctor to null

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
