package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import com.example.Backend.model.User;

@Data
public class RegisterRequest {

    @NotBlank(message = "username wajib diisi")
    private String username;

    @NotBlank(message = "password wajib diisi")
    @Size(min = 6, message = "password minimal 6 karakter")
    private String password;

    @NotBlank(message = "fullName wajib diisi")
    private String fullName;

    // Opsional dari client; kalau tidak dikirim, defaultnya KASIR (diatur di service)
    private User.Role role;
}
