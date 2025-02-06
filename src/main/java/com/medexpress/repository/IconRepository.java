package com.medexpress.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.medexpress.entity.Icon;

public interface IconRepository extends MongoRepository<Icon, ObjectId> {

    public Icon findByName(String name);

    public Icon findByType(String type);

    public boolean existsByName(String name);

    public boolean existsByType(String type);
    
}
