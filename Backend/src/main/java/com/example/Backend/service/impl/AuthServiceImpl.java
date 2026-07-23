package com.example.Backend.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Backend.dto.request.LoginRequest;
import com.example.Backend.dto.request.RegisterRequest;
import com.example.Backend.dto.response.LoginResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.User;
import com.example.Backend.repository.UserRepository;
import com.example.Backend.security.JwtService;
import com.example.Backend.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username sudah dipakai, coba yang lain");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole() != null ? request.getRole() : User.Role.KASIR)
                .build();

        User saved = userRepository.save(user);
        log.info("User dibuat: username={}, role={}", saved.getUsername(), saved.getRole());
        return saved;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> {
                    log.warn("Login gagal: username {} tidak ditemukan", request.getUsername());
                    return new ResourceNotFoundException("Username atau password salah");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login gagal: password salah untuk username {}", request.getUsername());
            throw new ResourceNotFoundException("Username atau password salah");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        log.info("Login berhasil: username={}, role={}", user.getUsername(), user.getRole());

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
