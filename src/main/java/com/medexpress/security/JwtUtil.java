package com.medexpress.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;

import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecureDigestAlgorithm;

import javax.crypto.SecretKey;
import java.util.Date;
import com.medexpress.enums.AuthEntityType;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;


@Component
public class JwtUtil {
  
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;
    @Value("${jwt.refreshExpiration}")
    private int jwtRefreshExpirationMs;
    private SecretKey key;
    private final SecureDigestAlgorithm<SecretKey, ?> algorithm = Jwts.SIG.HS256;

    //constructor with key and algorithm
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    
    }
   
    

    //Generate JWT token with the user id and entityType 
    public String generateAccessToken(String id, AuthEntityType entityType) {
        return Jwts.builder()
            .subject(id)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .claim("entityType", entityType.toString())
            .signWith(key, algorithm)
            .compact();
    }

    // Refresh Token generation
    public String generateRefreshToken(String id, AuthEntityType entityType) {
        return Jwts.builder()
                .subject(id)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtRefreshExpirationMs))
                .claim("entityType", entityType.toString())
                .signWith(key, algorithm)
                .compact();
    }

    // Validate the JWT token
    public Claims validateToken(String token) { 
        try {
            return Jwts.parser()
                    .verifyWith(key)  
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (SecurityException e) {
            System.out.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return null;
    }
}