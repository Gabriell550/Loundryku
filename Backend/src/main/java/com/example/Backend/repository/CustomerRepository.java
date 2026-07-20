package com.example.Backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.Backend.model.Customer;

public interface CustomerRepository extends MongoRepository<Customer, String> {
}
