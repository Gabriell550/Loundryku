package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "username wajib diisi")
    private String username;

    @NotBlank(message = "password wajib diisi")
    private String password;
}
