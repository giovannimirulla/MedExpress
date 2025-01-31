package com.medexpress.validator;

import java.util.Map;

public class PharmacyValidator {

    // This method is used to validate the VAT number.
    public static boolean validateVATNumber(String VATNumber) {
        return VATNumber.matches("[0-9]{9}");
    }

 
    public static void validate(Map<String, String> body) {
        if (!validateVATNumber(body.get("VATnumber"))) {
            throw new IllegalArgumentException("Invalid VAT number");
        }

        if (!CommonValidator.checkString(body.get("companyName"))) {
            throw new IllegalArgumentException("Invalid company name");
        }

        if (!CommonValidator.checkString(body.get("address"))) {
            throw new IllegalArgumentException("Invalid address");
        }

        if (!CommonValidator.validateEmail(body.get("email"))) {
            throw new IllegalArgumentException("Invalid email");
        }

        if (!CommonValidator.validatePassword(body.get("password"))) {
            throw new IllegalArgumentException("Invalid password");
        }
    }

    
}
