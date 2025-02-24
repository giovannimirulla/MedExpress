package com.medexpress.repository;

import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.medexpress.entity.Order;

public interface OrderRepository extends MongoRepository<Order, ObjectId> {
    
    Optional<Order> findByPackageId(String packageId);
    Optional<Order> findByUserId(String userId);
    Optional<Order> findByDrugId(String drugId);
    
}
