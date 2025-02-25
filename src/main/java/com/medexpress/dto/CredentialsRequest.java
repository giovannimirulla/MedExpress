package com.medexpress.dto;

public class CredentialsRequest {
    private String email;
    private String password;

    public CredentialsRequest() {
    }

    public CredentialsRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
}
