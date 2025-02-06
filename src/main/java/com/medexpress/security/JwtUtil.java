package com.medexpress.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import io.jsonwebtoken.Claims;

public class JwtUtil {
    private static final String SECRET_KEY = "supersecretkeythatshouldbereplacedwitharealone";
    private static final long ACCESS_TOKEN_EXPIRATION = 900000;  // 15 minuti
    private static final long REFRESH_TOKEN_EXPIRATION = 604800000; // 7 giorni

    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Genera un Access Token con il ruolo
    public static String generateAccessToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .addClaims(Map.of("role", role))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Genera un Refresh Token
    public static String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Validare un token JWT
    public static Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            return null; // Token non valido
        }
    }
}