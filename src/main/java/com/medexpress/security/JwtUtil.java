package com.medexpress.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecureDigestAlgorithm;
import javax.crypto.SecretKey;
import java.util.Date;
import com.medexpress.enums.AuthEntityType;

public class JwtUtil {
    private static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY");
    
    static {
        if (SECRET_KEY == null || SECRET_KEY.isEmpty()) {
            throw new IllegalStateException("The environment variable JWT_SECRET_KEY is not set.");
        }
    }
    
    private static final long ACCESS_TOKEN_EXPIRATION = 900000;  // 15 minuti
    private static final long REFRESH_TOKEN_EXPIRATION = 604800000; // 7 giorni

    private static final SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY)); 
    private static final SecureDigestAlgorithm<SecretKey, ?> algorithm = Jwts.SIG.HS256;  

    // Genera un Access Token con il ruolo
    public static String generateAccessToken(String id, AuthEntityType role) {
        return Jwts.builder()
                .subject(id)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .claim("role", role.name())
                .signWith(key)  
                .compact();
    }

    // Genera un Refresh Token
    public static String generateRefreshToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key)  
                .compact();
    }

    // Validare un token JWT
    public static Claims validateToken(String token) { 
        try {
            return Jwts.parser()
                    .verifyWith(key)  
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            return null; // Token non valido
        }
    }
}