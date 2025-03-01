package com.medexpress.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.medexpress.entity.User;


@Repository
public interface UserRepository extends MongoRepository <User, ObjectId> {
    
    public boolean existsByEmail(String email);
    public boolean existsByFiscalCode(String fiscalCode);
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.Role role);
    List<User> findByRoleAndNameOrSurname(User.Role role, String name, String surname);
    List<User> findByRoleAndDoctor(User.Role role, ObjectId doctorId);

    //find by doctor id
    public List<User> findByDoctor_Id(ObjectId doctorId);
}
