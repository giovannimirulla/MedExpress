package com.medexpress.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.medexpress.entity.Pharmacy;
import com.medexpress.repository.PharmacyRepository;

@Service
public class PharmacyService {

    @Autowired 
    private PharmacyRepository pharmacyRepository;

    //create pharmacy
    public Pharmacy createPharmacy(String companyName, String VATnumber, String address, String email, String password) {

         //check if email and VAT number already exist
         boolean existsByEmail = pharmacyRepository.existsByEmail(email);
         boolean existsByVATnumber = pharmacyRepository.existsByVATnumber(VATnumber);

        //  throw exception if email or VAT number already exist
         if (existsByEmail) {
              throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"User with email " + email + " already exists");
         }
         if (existsByVATnumber) {
              throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"User with VAT number " + VATnumber + " already exists");
         }

        //create pharmacy
        Pharmacy pharmacy = pharmacyRepository.insert(new Pharmacy(companyName, VATnumber, address, email, password, LocalDateTime.now(), LocalDateTime.now()));
        return pharmacyRepository.save(pharmacy);
    }

     public Pharmacy findByEmail(String email) {
          return pharmacyRepository.findByEmail(email).orElse(null);
     }
    
}
