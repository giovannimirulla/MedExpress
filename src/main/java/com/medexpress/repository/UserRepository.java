package com.medexpress.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

import com.medexpress.entity.User;

@Repository
public interface UserRepository extends MongoRepository <User, ObjectId> {
    
    public List<User> findAllByRole(Number role);
    
}
