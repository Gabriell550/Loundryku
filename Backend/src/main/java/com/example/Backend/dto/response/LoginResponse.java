package com.example.Backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.example.Backend.model.User;

/**
 * Ini yang dikirim balik ke client setelah login BERHASIL.
 * Perhatikan: tidak ada field "password" di sini sama sekali —
 * inilah gunanya DTO response terpisah dari model User,
 * supaya password (walau sudah di-hash) tidak pernah ikut terkirim ke client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String username;
    private String fullName;
    private User.Role role;
}
