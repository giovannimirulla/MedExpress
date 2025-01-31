package com.medexpress.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medexpress.service.PharmacyService;

import java.util.Map;
import com.medexpress.entity.Pharmacy;
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.http.HttpStatus;  

import com.medexpress.validator.PharmacyValidator;

@RestController
@RequestMapping("/api/v1/pharmacy")
public class PharmacyController {

    @Autowired // This annotation tells Spring to inject an instance of PharmacyService into this class.
    private PharmacyService pharmacyService;

    public PharmacyController(PharmacyService pharmacyService) { // This constructor is used to inject the PharmacyService dependency into this class.
        this.pharmacyService = pharmacyService;
    }
    
    @PostMapping() 
    public ResponseEntity<Pharmacy> createPharmacy(@RequestBody Map<String, String> body) {// This method is used to create a new pharmacy.

        PharmacyValidator.validate(body); // This line of code is used to validate the pharmacy details.
        Pharmacy pharmacy = pharmacyService.createPharmacy(body.get("companyName"), body.get("VATnumber"), body.get("address"), body.get("email"), body.get("password")); // This line of code is used to create a new pharmacy.
        return new ResponseEntity<Pharmacy>(pharmacy, HttpStatus.CREATED);
        
    }

}
