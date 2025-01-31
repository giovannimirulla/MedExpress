package com.medexpress.dto;

public class PharmacyDTO {
    private String companyName;
    private String VATnumber;
    private String address;
    private String email;


    public PharmacyDTO(String companyName, String VATnumber, String address, String email) {
        this.companyName = companyName;
        this.VATnumber = VATnumber;
        this.address = address;
        this.email = email;

    }

    // Getter
    public String getCompanyName() {
        return companyName;
    }

    public String getVATnumber() {
        return VATnumber;
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

    public void setVATnumber(String VATnumber) {
        this.VATnumber = VATnumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setEmail(String email) {
        this.email = email;
    }


}
