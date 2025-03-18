package com.medexpress.dto;

import com.medexpress.entity.Pharmacy;

public class PharmacyDTO {
    private String companyName;
    private String vatNumber;
    private String address;
    private String email;

    public PharmacyDTO() {
    }

    // Constructor
    public PharmacyDTO(String companyName, String vatNumber, String address, String email) {
        this.companyName = companyName;
        this.vatNumber = vatNumber;
        this.address = address;
        this.email = email;
    }

    //fromPharmacy
    public static PharmacyDTO fromPharmacy(Pharmacy pharmacy) {
        if (pharmacy == null) {
            return null;
        }
        return new PharmacyDTO(
            pharmacy.getCompanyName(),
            pharmacy.getVatNumber(),
            pharmacy.getAddress(),
            pharmacy.getEmail()
        );
    }

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
