package com.medexpress.security;

import io.jsonwebtoken.Claims;
import com.medexpress.enums.AuthEntityType;
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
        String id = claims.getSubject();

        if (role == AuthEntityType.USER) {
            return userService.findById(id);
        } else if (role == AuthEntityType.PHARMACY) {
            return pharmacyService.findById(id);
        }
        return null;
    }

    //decode token only id
    public String decodeTokenId(String token) {
        Claims claims = JwtUtil.validateToken(token);
        if (claims == null) {
            return null;
        }
        return claims.getSubject();
    }
}