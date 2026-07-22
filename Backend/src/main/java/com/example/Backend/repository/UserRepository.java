package com.example.Backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.Backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    // Query otomatis dibuatkan Spring dari nama method ini:
    // "cari 1 User yang usernamenya sama persis dengan parameter"
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
