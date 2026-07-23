package com.example.Backend.service;

import java.util.List;

import com.example.Backend.dto.request.UpdateUserRequest;
import com.example.Backend.dto.response.RegisterResponse;

public interface UserService {
    List<RegisterResponse> getAllUsers();
    RegisterResponse updateUser(String id, UpdateUserRequest request);
    void deleteUser(String id);
}
