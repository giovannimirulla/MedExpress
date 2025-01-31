package com.medexpress.validator;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class PharmacyValidator {

    // This method is used to validate the VAT number.
    public static boolean validateVATNumber(String VATNumber) {
        return VATNumber.matches("[0-9]{9}");
    }

 
    public static void validate(Map<String, String> body) {
        if (!validateVATNumber(body.get("VATnumber"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid VAT number");
        }

        if (!CommonValidator.checkString(body.get("companyName"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid company name");
        }

        if (!CommonValidator.checkString(body.get("address"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid address");
        }

        if (!CommonValidator.validateEmail(body.get("email"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid email");
        }

        if (!CommonValidator.validatePassword(body.get("password"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid password");
        }
    }

    
}
