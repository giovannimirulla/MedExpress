package com.medexpress.validator;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.entity.Pharmacy;

public class PharmacyValidator {

    // This method is used to validate the VAT number.
    public static boolean validateVATNumber(String VATNumber) {
        return VATNumber.matches("[0-9]{9}"); // This line of code is used to check if the VAT number is a 9 digit number.
    }

 
    public static void validate(Pharmacy body) {
        if (!validateVATNumber(body.getVATnumber())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid VAT number");
        }

        if (!CommonValidator.checkString(body.getCompanyName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid company name");
        }

        if (!CommonValidator.checkString(body.getAddress())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid address");
        }

        if (!CommonValidator.validateEmail(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid email");
        }

        if (!CommonValidator.validatePassword(body.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid password");
        }
    }

    
}
