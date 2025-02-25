package com.medexpress.security;

import org.springframework.lang.NonNull;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.medexpress.enums.AuthEntityType;
import com.medexpress.service.PharmacyService;
import com.medexpress.service.UserService;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

@Autowired
private static JwtDecoder jwtDecoder;

@Autowired
private static JwtUtil jwtUtil;

@Autowired
private static PharmacyService pharmacyService;

@Autowired
private static UserService userService;
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtil.validateToken(jwt)!=null) {
                Object[] idAndRole = (Object[]) jwtDecoder.decodeTokenIdAndRole(jwt);
                UserDetails userDetails = null;
                if (idAndRole[1] == AuthEntityType.PHARMACY) {
                    userDetails = pharmacyService.findById((String) idAndRole[0]);
                } else if (idAndRole[1] == AuthEntityType.USER) {
                    userDetails = userService.findById((String) idAndRole[0]);
                }
          
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            System.out.println("Cannot set user authentication: " + e);
        }
        filterChain.doFilter(request, response);
    }
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}



