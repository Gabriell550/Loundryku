package com.example.Backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.dto.request.LoginRequest;
import com.example.Backend.dto.response.ApiResponse;
import com.example.Backend.dto.response.LoginResponse;
import com.example.Backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Endpoint ini SENGAJA dikecualikan dari wajib-login di SecurityConfig
 * (lihat .requestMatchers("/api/auth/**").permitAll()), karena kalau
 * mau login dulu, ya jelas belum punya token buat "buktikan sudah login". Logis kan?
 *
 * Perhatikan: TIDAK ADA endpoint "/register" publik di sini. Bikin akun baru
 * cuma bisa dilakukan ADMIN yang sudah login, lewat UserController
 * (/api/users). Ini pola "admin-managed accounts" — tidak ada orang luar
 * yang bisa daftar sendiri jadi kasir.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login berhasil", response));
    }
}
