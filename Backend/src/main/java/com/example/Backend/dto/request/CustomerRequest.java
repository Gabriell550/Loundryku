package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerRequest {

    @NotBlank(message = "name wajib diisi")
    private String name;

    @NotBlank(message = "phone wajib diisi")
    private String phone;

    private String address; // opsional, tidak wajib
}
