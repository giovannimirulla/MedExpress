package com.medexpress.validator;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class PharmacyValidator {

    // This method is used to validate the VAT number.
    public static boolean validateVATNumber(String VATNumber) {
        return VATNumber.matches("[0-9]{9}"); // This line of code is used to check if the VAT number is a 9 digit number.
    }

 
    public static void validate(Map<String, String> body) { // This method is used to validate the pharmacy details.

        // check VAT number is not empty
        if (!validateVATNumber(body.get("VATnumber"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid VAT number"); //httpstatus.bad_request is used to return a 400 bad request status code when the VAT number is invalid.
        }

        // check company name is not empty
        if (!CommonValidator.checkString(body.get("companyName"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid company name");
        }

        // check address is not empty
        if (!CommonValidator.checkString(body.get("address"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid address");
        }

        // check email is not empty
        if (!CommonValidator.validateEmail(body.get("email"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid email");
        }

        // check password is not empty
        if (!CommonValidator.validatePassword(body.get("password"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid password");
        }
    }

    
}
