package com.example.Backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.Backend.model.Customer;

public interface CustomerRepository extends MongoRepository<Customer, String> {

    @Query("{ '$or': [ { 'name': { '$regex': ?0, '$options': 'i' } }, { 'phone': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Customer> searchByNameOrPhone(String query);
}
