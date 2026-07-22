package com.example.Backend.service;

import com.example.Backend.dto.response.LoginResponse;
import com.example.Backend.dto.request.LoginRequest;
import com.example.Backend.dto.request.RegisterRequest;
import com.example.Backend.model.User;


public interface AuthService {
    User register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
