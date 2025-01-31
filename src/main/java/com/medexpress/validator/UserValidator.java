package com.medexpress.validator;

import java.time.LocalDateTime;
import java.util.Map;

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
    public static void validate(Map<String, String> body) {
        // check fiscal code is not empty
        if (!CommonValidator.checkString(body.get("fiscalCode"))) {
            throw new IllegalArgumentException("Fiscal code is empty");
        }

        // check fiscal code is valid
        if (!validateFiscalCode(body.get("fiscalCode"))) {
            throw new IllegalArgumentException("Fiscal code is not valid");
        }

        // check age is valid
        if (!checkAge(body.get("fiscalCode"))) {
            throw new IllegalArgumentException("User is not 18 years old");
        }

        // check name is not empty
        if (!CommonValidator.checkString(body.get("name"))) {
            throw new IllegalArgumentException("Name is empty");
        }

        // check surname is not empty
        if (!CommonValidator.checkString(body.get("surname"))) {
            throw new IllegalArgumentException("Surname is empty");
        }

        // check email is not empty
        if (!CommonValidator.checkString(body.get("email"))) {
            throw new IllegalArgumentException("Email is empty");
        }

        // check email is valid
        if (!CommonValidator.validateEmail(body.get("email"))) {
            throw new IllegalArgumentException("Email is not valid");
        }

        // check address is not empty
        if (!CommonValidator.checkString(body.get("address"))) {
            throw new IllegalArgumentException("Address is empty");
        }

        // check password is not empty
        if (!CommonValidator.checkString(body.get("password"))) {
            throw new IllegalArgumentException("Password is empty");
        }

        // check password is valid
        if (!CommonValidator.validatePassword(body.get("password"))) {
            throw new IllegalArgumentException("Password is not valid");
        }
    }

}
