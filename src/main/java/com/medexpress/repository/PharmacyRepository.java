package com.medexpress.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.medexpress.entity.Pharmacy; // This import statement is used to import the Pharmacy class.

@Repository
public interface PharmacyRepository extends MongoRepository <Pharmacy, ObjectId> { // This interface is used to define the methods that will be used to interact with the database.
    

}
