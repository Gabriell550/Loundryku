package com.example.Backend.security;

public interface JwtService {

    String generateToken(String username, String role);

    String extractUsername(String token);

    String extractRole(String token);

    boolean isTokenValid(String token);
}