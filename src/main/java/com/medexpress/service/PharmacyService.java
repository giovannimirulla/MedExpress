package com.medexpress.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medexpress.entity.Pharmacy;
import com.medexpress.repository.PharmacyRepository;

@Service
public class PharmacyService {

    @Autowired 
    private PharmacyRepository pharmacyRepository;

    //create pharmacy
    public Pharmacy createPharmacy(String companyName, String VATnumber, String address, String email, String password) {

        Pharmacy pharmacy = pharmacyRepository.insert(new Pharmacy(companyName, VATnumber, address, email, password, LocalDateTime.now(), LocalDateTime.now()));

        return pharmacyRepository.save(pharmacy);
    }
    
}
