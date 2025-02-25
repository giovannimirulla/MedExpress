package com.medexpress.repository;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.medexpress.entity.Pharmacy; 

@Repository 
public interface PharmacyRepository extends MongoRepository <Pharmacy, ObjectId> { // This interface is used to define the methods that will be used to interact with the database.
    
    public boolean existsByEmail(String email); // This method is used to check if a pharmacy with the specified email exists in the database.
    public boolean existsByVatNumber(String vatNumber); // This method is used to check if a pharmacy with the specified vatNumber exists in the database.
    Optional<Pharmacy> findByEmail(String email);
}
