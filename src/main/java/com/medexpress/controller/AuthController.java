package com.medexpress.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;
import io.jsonwebtoken.Claims;

import com.medexpress.service.UserService;
import com.medexpress.service.PharmacyService;
import com.medexpress.service.EncryptionService;
import com.medexpress.entity.User;
import com.medexpress.dto.CredentialsRequest;
import com.medexpress.dto.RefreshTokenRequest;
import com.medexpress.entity.Pharmacy;
import com.medexpress.security.JwtUtil;
import com.medexpress.enums.AuthEntityType;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final PharmacyService pharmacyService;
    private final EncryptionService encryptionService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, PharmacyService pharmacyService, EncryptionService encryptionService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.pharmacyService = pharmacyService;
        this.encryptionService = encryptionService;
        this.jwtUtil = jwtUtil;
    }

  

    // Login for users
    @PostMapping("/login/user")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody CredentialsRequest body) {
        String email = body.getEmail();
        String password = body.getPassword();

        User user = userService.findByEmail(email);
        if (user != null && encryptionService.verifyPassword(password, user.getPassword())) {
            String accessToken = jwtUtil.generateAccessToken(user.getId().toString(), AuthEntityType.USER);
            String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("role", user.getRole().toString());
            response.put("id", user.getId().toString());
            response.put("nameAndSurname", user.getName()+ " " + user.getSurname());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("error", "Invalid credentials"), HttpStatus.UNAUTHORIZED);
    }

    // Login for pharmacies
    @PostMapping("/login/pharmacy")
    public ResponseEntity<Map<String, String>> loginPharmacy(@RequestBody CredentialsRequest body) {
        String email = body.getEmail();
        String password = body.getPassword();

        Pharmacy pharmacy = pharmacyService.findByEmail(email);
                if (pharmacy != null && encryptionService.verifyPassword(password, pharmacy.getPassword())) {
                    String accessToken = jwtUtil.generateAccessToken(pharmacy.getId().toString(), AuthEntityType.PHARMACY);
                    String refreshToken = jwtUtil.generateRefreshToken(pharmacy.getEmail());
        
                    Map<String, String> response = new HashMap<>();
                    response.put("accessToken", accessToken);
                    response.put("refreshToken", refreshToken);
                    response.put("id", pharmacy.getId().toString());
                    response.put("nameCompany", pharmacy.getCompanyName());
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }
                return new ResponseEntity<>(Map.of("error", "Invalid credentials"), HttpStatus.UNAUTHORIZED);
    }

    // Refresh token
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody RefreshTokenRequest body) {
        String refreshToken = body.getRefreshToken();
        Claims claims = jwtUtil.validateToken(refreshToken);


        if (claims != null) {
            String id = claims.getSubject();
            String entityTypeString = claims.get("entityType", String.class);
            
            AuthEntityType entityType = AuthEntityType.valueOf(entityTypeString);

            String newAccessToken = jwtUtil.generateAccessToken(id, entityType);
            String newRefreshToken = jwtUtil.generateRefreshToken(claims.getSubject());

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            tokens.put("refreshToken", newRefreshToken);
            return new ResponseEntity<>(tokens, HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("error", "Invalid Refresh Token"), HttpStatus.UNAUTHORIZED);
    }
}