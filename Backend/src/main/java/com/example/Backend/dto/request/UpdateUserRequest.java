package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @NotBlank(message = "fullName wajib diisi")
    private String fullName;

    private String password;

    private String role;
}
