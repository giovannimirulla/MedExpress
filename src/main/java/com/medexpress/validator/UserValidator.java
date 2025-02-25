package com.medexpress.validator;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.dto.UserRequest;

public class UserValidator {
    
     public static boolean validateFiscalCode(String fiscalCode) {
        String regex = "^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$";
        return fiscalCode.matches(regex);
    }

    public static boolean checkAge(String fiscalCode) {
        int year = Integer.parseInt(fiscalCode.substring(6, 8));
        if (year < 21) {
            year += 2000;
        } else {
            year += 1900;
        }
        int month = "ABCDEHLMPRST".indexOf(fiscalCode.charAt(8));
        int day = Integer.parseInt(fiscalCode.substring(9, 11));
        LocalDateTime now = LocalDateTime.now();
        if (now.getYear() - year > 18) {
            return true;
        } else if (now.getYear() - year == 18) {
            if (now.getMonthValue() > month) {
                return true;
            } else if (now.getMonthValue() == month) {
                if (now.getDayOfMonth() >= day) {
                    return true;
                }
            }
        }
        return false;
    }

    // validate user
    public static void validate(UserRequest body) {
        // check fiscal code is not empty
        if (!CommonValidator.checkString(body.getFiscalCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Fiscal code is empty");
        }

        // check fiscal code is valid
        if (!validateFiscalCode(body.getFiscalCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Fiscal code is not valid");
        }

        // check age is valid
        if (!checkAge(body.getFiscalCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"User is not 18 years old");
        }

        // check name is not empty
        if (!CommonValidator.checkString(body.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Name is empty");
        }

        // check surname is not empty
        if (!CommonValidator.checkString(body.getSurname())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Surname is empty");
        }

        // check email is not empty
        if (!CommonValidator.checkString(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email is empty");
        }

        // check email is valid
        if (!CommonValidator.validateEmail(body.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email is not valid");
        }

        // check address is not empty
        if (!CommonValidator.checkString(body.getAddress())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Address is empty");
        }

        // check password is not empty
        if (!CommonValidator.checkString(body.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Password is empty");
        }

        // check password is valid
        if (!CommonValidator.validatePassword(body.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Password is not valid");
        }
    }

}
