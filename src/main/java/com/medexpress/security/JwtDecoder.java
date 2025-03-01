package com.medexpress.security;

import io.jsonwebtoken.Claims;

import com.medexpress.enums.AuthEntityType;
import com.medexpress.service.UserService;
import com.medexpress.service.PharmacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JwtDecoder {

    @Autowired
    private final UserService userService;
    @Autowired
    private final PharmacyService pharmacyService;
    @Autowired
    private final JwtUtil jwtUtil;

    public JwtDecoder(UserService userService, PharmacyService pharmacyService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.pharmacyService = pharmacyService;
        this.jwtUtil = jwtUtil;
    }

    public Object decodeToken(String token) {
        Claims claims = jwtUtil.validateToken(token);
        if (claims == null) {
            return null;
        }
        AuthEntityType entityType = claims.get("entityType", AuthEntityType.class);
        String id = claims.getSubject();

        if (entityType == AuthEntityType.USER) {
            return userService.findById(id);
        } else if (entityType == AuthEntityType.PHARMACY) {
            return pharmacyService.findById(id);
        }
        return null;
    }

    //decode token only id
    public String decodeTokenId(String token) {
        Claims claims = jwtUtil.validateToken(token);
        if (claims == null) {
            return null;
        }
        return claims.getSubject();
    }

    //decode token id and entityType
    public Object decodeTokenIdAndEntityType(String token) {
        Claims claims = jwtUtil.validateToken(token);
        if (claims == null) {
            return null;
        }
        String id = claims.getSubject();
        String entityTypeString = claims.get("entityType", String.class);
        AuthEntityType entityType = AuthEntityType.valueOf(entityTypeString);

        return new Object[]{id, entityType};
    }
}