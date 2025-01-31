package com.medexpress.validator;


public class CommonValidator {

    // check if strig is not empty
    public static boolean checkString(String string) {
        return !string.isEmpty() && string != null;
    }

    public static boolean validateEmail(String email) {
        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(regex);
    }

    public static boolean validatePassword(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{12,16}$";
        return password.matches(regex);
    }
 
}

