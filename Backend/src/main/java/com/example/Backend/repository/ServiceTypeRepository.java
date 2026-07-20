package com.example.Backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.Backend.model.ServiceType;

public interface ServiceTypeRepository extends MongoRepository<ServiceType, String> {
}
