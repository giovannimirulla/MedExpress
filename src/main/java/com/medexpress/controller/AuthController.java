package com.medexpress.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;
import io.jsonwebtoken.Claims;

import com.medexpress.service.UserService;
import com.medexpress.service.PharmacyService;
import com.medexpress.service.EncryptionService;
import com.medexpress.entity.User;
import com.medexpress.entity.Pharmacy;
import com.medexpress.security.JwtUtil;
import com.medexpress.enums.AuthEntityType;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private PharmacyService pharmacyService;
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private JwtUtil jwtUtil;

  

    // Login for users
    @PostMapping("/login/user")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        User user = userService.findByEmail(email);
        if (user != null && encryptionService.verifyPassword(password, user.getPassword())) {
            String accessToken = jwtUtil.generateAccessToken(user.getId().toString(), AuthEntityType.USER);
            String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshToken);
            return new ResponseEntity<>(tokens, HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("error", "Invalid credentials"), HttpStatus.UNAUTHORIZED);
    }

    // Login for pharmacies
    @PostMapping("/login/pharmacy")
    public ResponseEntity<Map<String, String>> loginPharmacy(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Pharmacy pharmacy = pharmacyService.findByEmail(email);
                if (pharmacy != null && encryptionService.verifyPassword(password, pharmacy.getPassword())) {
                    String accessToken = jwtUtil.generateAccessToken(pharmacy.getId().toString(), AuthEntityType.PHARMACY);
                    String refreshToken = jwtUtil.generateRefreshToken(pharmacy.getEmail());
        
                    Map<String, String> tokens = new HashMap<>();
                    tokens.put("accessToken", accessToken);
                    tokens.put("refreshToken", refreshToken);
                    return new ResponseEntity<>(tokens, HttpStatus.OK);
                }
                return new ResponseEntity<>(Map.of("error", "Invalid credentials"), HttpStatus.UNAUTHORIZED);
    }

    // Refresh token
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        Claims claims = jwtUtil.validateToken(refreshToken);


        if (claims != null) {
            String id = claims.getSubject();
            AuthEntityType role = claims.get("role", AuthEntityType.class);

            String newAccessToken = jwtUtil.generateAccessToken(id, role);
            String newRefreshToken = jwtUtil.generateRefreshToken(claims.getSubject());

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            tokens.put("refreshToken", newRefreshToken);
            return new ResponseEntity<>(tokens, HttpStatus.OK);
        }
        return new ResponseEntity<>(Map.of("error", "Invalid Refresh Token"), HttpStatus.UNAUTHORIZED);
    }
}