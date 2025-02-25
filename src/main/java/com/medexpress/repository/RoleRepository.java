package com.medexpress.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.medexpress.entity.Role;
import org.bson.types.ObjectId;
import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, ObjectId> {
    public Optional<Role> findByName(String name);
}
