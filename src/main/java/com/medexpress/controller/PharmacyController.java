package com.medexpress.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medexpress.service.PharmacyService;
import com.medexpress.service.EncryptionService;
import com.medexpress.dto.PharmacyDTO;

import java.util.Map;
import com.medexpress.entity.Pharmacy;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.medexpress.validator.PharmacyValidator;

@RestController
@RequestMapping("/api/v1/pharmacy")
public class PharmacyController {

    @Autowired // This annotation tells Spring to inject an instance of PharmacyService into
               // this class.
    private PharmacyService pharmacyService;

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private ModelMapper modelMapper;

    public PharmacyController(PharmacyService pharmacyService, EncryptionService encryptionService,
            ModelMapper modelMapper) {
        this.pharmacyService = pharmacyService;
        this.encryptionService = encryptionService;
        this.modelMapper = modelMapper;
    }

    @PostMapping()

    public ResponseEntity<PharmacyDTO> createPharmacy(@RequestBody Map<String, String> body) {

        PharmacyValidator.validate(body); // This line of code is used to validate the pharmacy details.

        String encryptedPassword = encryptionService.encryptPassword(body.get("password"));

        Pharmacy pharmacy = pharmacyService.createPharmacy(body.get("companyName"), body.get("VATnumber"),
                body.get("address"), body.get("email"), encryptedPassword); // This line of code is used to create a new
                                                                            // pharmacy.

        PharmacyDTO pharmacyDTO = modelMapper.map(pharmacy, PharmacyDTO.class);

        return new ResponseEntity<>(pharmacyDTO, HttpStatus.CREATED);

    }

}
