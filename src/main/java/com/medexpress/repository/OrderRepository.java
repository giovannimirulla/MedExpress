package com.medexpress.repository;

import java.util.List;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.medexpress.entity.Order;

import org.springframework.data.domain.Sort;

public interface OrderRepository extends MongoRepository<Order, ObjectId> {
    
    public  List<Order> findByUser_Id(ObjectId userId, Sort sort);
    public Optional<Order> findByPharmacyId(ObjectId pharmacyId);
    public Optional<Order> findByDriverId(ObjectId driverId);
    //findByDriver_IdOrDriverIsNullAndStatusPharmacy
    public List<Order> findByDriver_IdOrDriverIsNullAndStatusPharmacy(ObjectId driverId, Order.StatusPharmacy statusPharmacy, Sort sort);
    //findByPharmacy_IdOrPharmacyIsNullAndStatusDoctorIn
    public List<Order> findByPharmacy_IdOrPharmacyIsNullAndStatusDoctorIn(ObjectId pharmacyId, List<Order.StatusDoctor> statusDoctor, Sort sort);
    
}   
