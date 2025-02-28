package com.medexpress.service;

import java.util.List;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.entity.User;
import com.medexpress.enums.AuthEntityType;
import com.medexpress.repository.UserRepository;
import com.medexpress.security.CustomUserDetails;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.bson.types.ObjectId;
import java.util.Collections;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllDoctors() {
        return userRepository.findByRole(User.Role.DOCTOR);
    }

    public List<User> searchDoctor(String query) {
        return userRepository.findByRoleAndNameOrSurname(User.Role.DOCTOR, query, query);
    }

    // create user
    public User createUser(String name, String surname, String fiscalCode, String address, String email,
            String password, String role, String doctorId) {

        // check if the user already exists by email and fiscal code //
        // userRepository.existsByEmail(email);
        boolean existsByEmail = userRepository.existsByEmail(email);
        boolean existsByFiscalCode = userRepository.existsByFiscalCode(fiscalCode);

        // if user already exists by email or fiscal code, return error message
        if (existsByEmail) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with email " + email + " already exists");
        }
        if (existsByFiscalCode) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "User with fiscal code " + fiscalCode + " already exists");
        }

        //check if role is valid and convert
        if (!role.equals(User.Role.PATIENT.toString()) && !role.equals(User.Role.DOCTOR.toString())
                && !role.equals(User.Role.DRIVER.toString())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role " + role + " is not valid");
        }
        User.Role userRole = User.Role.valueOf(role);


        // find doctor by id
        User doctor = doctorId != null ? userRepository.findById(new ObjectId(doctorId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Doctor with id " + doctorId + " not found"))
                : null; // if doctorId is null, set doctor to null

        User user = userRepository
                .insert(new User(name, surname, fiscalCode, address, email, password, userRole, doctor,
                        LocalDateTime.now(), LocalDateTime.now()));
        return user;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // find user by id
    public CustomUserDetails findById(String id) {
        User user = userRepository.findById(new ObjectId(id)).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id " + id + " not found");
        }

        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole().toString()));
        return new CustomUserDetails(user.getId().toString(),user.getEmail(), user.getPassword(), AuthEntityType.USER, user.getRole(), authorities);
    }

    //get all patients of a doctor
    public List<User> getPatients(String doctorId) {
        User doctor = userRepository.findById(new ObjectId(doctorId)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor with id " + doctorId + " not found"));
       //find by doctor id only, no role
        return userRepository.findByDoctor_Id(doctor.getId());
    }

}
