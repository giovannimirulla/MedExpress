package com.medexpress.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Collections;

import com.medexpress.entity.Pharmacy;
import com.medexpress.repository.PharmacyRepository;

import org.bson.types.ObjectId;

@Service
public class PharmacyService {

     @Autowired
     private PharmacyRepository pharmacyRepository;

     // create pharmacy
     public Pharmacy createPharmacy(String companyName, String vatNumber, String address, String email,
               String password) {

          // check if email and VAT number already exist
          boolean existsByEmail = pharmacyRepository.existsByEmail(email);
          boolean existsByvatNumber = pharmacyRepository.existsByvatNumber(vatNumber);

          // throw exception if email or VAT number already exist
          if (existsByEmail) {
               throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                         "User with email " + email + " already exists");
          }
          if (existsByvatNumber) {
               throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                         "User with VAT number " + vatNumber + " already exists");
          }

          // create pharmacy
          Pharmacy pharmacy = pharmacyRepository.insert(new Pharmacy(companyName, vatNumber, address, email, password,
                    LocalDateTime.now(), LocalDateTime.now()));
          return pharmacyRepository.save(pharmacy);
     }

     //find pharmacy by email
     public Pharmacy findByEmail(String email) {
          return pharmacyRepository.findByEmail(email).orElse(null); //orElse(null) is used to return null if the pharmacy is not found.
     }

     // find pharmacy by id
     public UserDetails findById(String id) {
          Pharmacy pharmacy = pharmacyRepository.findById(new ObjectId(id)).orElse(null);
          if(pharmacy == null) {
               throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pharmacy with id " + id + " not found");
          }
          return new org.springframework.security.core.userdetails.User(pharmacy.getEmail(), pharmacy.getPassword(), Collections.emptyList());
     }

     // findAll pharmacies
     public Iterable<Pharmacy> findAll() {
          return pharmacyRepository.findAll();
     }
  
}
