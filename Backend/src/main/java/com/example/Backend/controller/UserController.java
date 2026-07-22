package com.example.Backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.dto.request.RegisterRequest;
import com.example.Backend.dto.response.ApiResponse;
import com.example.Backend.dto.response.RegisterResponse;
import com.example.Backend.model.User;
import com.example.Backend.service.AuthService;
import com.example.Backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Ini menu "Pengaturan > Tambah User" yang kamu maksud. Endpoint di sini
 * WAJIB login SEBAGAI ADMIN (diatur di SecurityConfig:
 * .requestMatchers("/api/users/**").hasRole("ADMIN")).
 *
 * Jadi alurnya: Admin login dulu di /api/auth/login → dapat token →
 * pakai token itu buat akses /api/users (bikin akun kasir baru).
 * Kasir yang baru dibuat TIDAK PERNAH bisa akses endpoint ini sendiri.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService; // reuse logic register yang sudah ada
    private final UserService userService;

    // Admin bikin akun baru (kasir atau admin lain), sambil tentukan role-nya
    @PostMapping
    public ResponseEntity<ApiResponse<RegisterResponse>> createUser(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);

        RegisterResponse response = RegisterResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Akun berhasil dibuat", response));
    }

    // Admin lihat daftar semua akun staff yang ada
    @GetMapping
    public ResponseEntity<ApiResponse<List<RegisterResponse>>> getAllUsers() {
        List<RegisterResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data user", users));
    }

    // Admin hapus akun staff (misal kasir sudah tidak kerja lagi)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User berhasil dihapus", null));
    }
}
