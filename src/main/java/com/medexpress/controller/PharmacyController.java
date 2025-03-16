package com.medexpress.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medexpress.service.PharmacyService;
import com.medexpress.service.EncryptionService;
import com.medexpress.service.OrderService;
import com.medexpress.dto.PharmacyDTO;
import com.medexpress.dto.PharmacyRequest;
import com.medexpress.dto.UpdateStatusPharmacyRequest;
import com.medexpress.entity.Order;
import com.medexpress.entity.Pharmacy;
import com.medexpress.enums.AuthEntityType;
import com.medexpress.security.CustomUserDetails;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;

import com.medexpress.validator.PharmacyValidator;

@RestController
@RequestMapping("/api/v1/pharmacy")
public class PharmacyController {

    private final PharmacyService pharmacyService;
    private final OrderService orderService;
    private final EncryptionService encryptionService;
    private final ModelMapper modelMapper;

    // This constructor is used to create an instance of the PharmacyController
    // class with the specified parameters.
    public PharmacyController(PharmacyService pharmacyService, OrderService orderService,
            EncryptionService encryptionService,
            ModelMapper modelMapper) {
        this.pharmacyService = pharmacyService;
        this.orderService = orderService;
        this.encryptionService = encryptionService;
        this.modelMapper = modelMapper;
    }

    @PostMapping() // This annotation is used to map HTTP POST requests onto specific handler
                   // methods.

    public ResponseEntity<PharmacyDTO> createPharmacy(@RequestBody PharmacyRequest body) {

        PharmacyValidator.validate(body); // This line of code is used to validate the pharmacy details.

        String encryptedPassword = encryptionService.encryptPassword(body.getPassword());

        Pharmacy pharmacy = pharmacyService.createPharmacy(body.getCompanyName(), body.getVatNumber(),
                body.getAddress(), body.getEmail(), encryptedPassword); // This line of code is used to create a new
                                                                        // pharmacy.

        PharmacyDTO pharmacyDTO = modelMapper.map(pharmacy, PharmacyDTO.class); // This line of code is used to map the
                                                                                // pharmacy entity to a pharmacy DTO.

        return new ResponseEntity<>(pharmacyDTO, HttpStatus.CREATED);

    }

    @PostMapping("/updateStatus")
    public ResponseEntity<Order> updateStatus(@RequestBody UpdateStatusPharmacyRequest body) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            System.out.println( userDetails.getEntityType() == AuthEntityType.PHARMACY);
            if (userDetails.getEntityType() != AuthEntityType.PHARMACY) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            //get pharmacy
            Pharmacy pharmacy = pharmacyService.getPharmacy(userDetails.getId());

        Order order = orderService.updateStatusPharmacy(body.getOrderId(), body.getStatus(), pharmacy);
        return new ResponseEntity<Order>(order, HttpStatus.OK);
    }
    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

}
