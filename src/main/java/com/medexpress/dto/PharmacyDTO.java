package com.medexpress.dto;

public class PharmacyDTO {
    private String companyName;
    private String vatNumber;
    private String address;
    private String email;

    // Getter
    public String getCompanyName() {
        return companyName;
    }

    public String getVatNumber() {
        return vatNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getEmail() {
        return email;
    }

    // Setter
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setVatNumber(String vatNumber) {
        this.vatNumber = vatNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setEmail(String email) {
        this.email = email;
    }


}
