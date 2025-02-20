package com.medexpress.security;

import io.jsonwebtoken.Claims;
import com.medexpress.enums.AuthEntityType;
import com.medexpress.entity.User;
import com.medexpress.entity.Pharmacy;
import com.medexpress.service.UserService;
import com.medexpress.service.PharmacyService;

public class TokenDecoder {

    private final UserService userService;
    private final PharmacyService pharmacyService;

    public TokenDecoder(UserService userService, PharmacyService pharmacyService) {
        this.userService = userService;
        this.pharmacyService = pharmacyService;
    }

    public Object decodeToken(String token) {
        Claims claims = JwtUtil.validateToken(token);
        if (claims == null) {
            return null;
        }
        AuthEntityType role = claims.get("role", AuthEntityType.class);
        String email = claims.get("email", String.class);
        if (role == AuthEntityType.USER) {
            return userService.findByEmail(email);
        } else if (role == AuthEntityType.PHARMACY) {
            return pharmacyService.findByEmail(email);
        }
        return null;
    }
}