package com.medexpress.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.medexpress.entity.User;
import com.medexpress.entity.Role;

@Repository
public interface UserRepository extends MongoRepository <User, ObjectId> {
    
    public boolean existsByEmail(String email);
    public boolean existsByFiscalCode(String fiscalCode);
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
}
