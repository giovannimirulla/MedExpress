package com.medexpress.repository;

import java.util.List;
import java.util.regex.Pattern;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.medexpress.entity.Icon;

public interface IconRepository extends MongoRepository<Icon, ObjectId> {

    public Icon findByName(String name);

    public List<Icon> findByTypeRegex(Pattern pattern);

    public boolean existsByName(String name);

    public boolean existsByType(String type);
    
}
