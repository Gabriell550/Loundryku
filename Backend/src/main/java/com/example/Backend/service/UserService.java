package com.example.Backend.service;

import java.util.List;

import com.example.Backend.dto.response.RegisterResponse;

public interface UserService {
    List<RegisterResponse> getAllUsers();
    void deleteUser(String id);
}
