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
        Claims claims = jwtUtil.validateToken(token);
        if (claims == null) {
            return null;
        }
        return claims.getSubject();
    }

    //decode token id and role
    public Object decodeTokenIdAndRole(String token) {
        Claims claims = jwtUtil.validateToken(token);
        if (claims == null) {
            return null;
        }
        String id = claims.getSubject();
        String roleAsString = claims.get("role", String.class); // Recupera il ruolo come String
        AuthEntityType role = AuthEntityType.valueOf(roleAsString); // Converti manualmente in enum
        
        return new Object[]{id, role};
    }
}