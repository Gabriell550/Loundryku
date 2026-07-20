package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ServiceTypeRequest {

    @NotBlank(message = "name wajib diisi")
    private String name;

    @NotBlank(message = "unit wajib diisi")
    private String unit; // "kg" atau "pcs"

    @NotNull(message = "price wajib diisi")
    @Positive(message = "price harus lebih dari 0")
    private Double price;
}
