package com.medexpress.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;
import com.medexpress.entity.User.Role;
import com.medexpress.enums.AuthEntityType;


public class CustomUserDetails implements UserDetails {

    private final String id;
    private final String username;
    private final String password;
    private final AuthEntityType entityType;
    private final Role role;
    private final List<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String id, String username, String password, AuthEntityType entityType, Role role, List<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.entityType = entityType;
        this.authorities = authorities;
    }

    public Role getRole() {
        return role;
    }
    
    public String getId() {
        return id;
    }

    public AuthEntityType getEntityType() {
        return entityType;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
}