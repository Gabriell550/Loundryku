package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotBlank(message = "orderId wajib diisi")
    private String orderId;

    @NotNull(message = "amount wajib diisi")
    @Positive(message = "amount harus lebih dari 0")
    private Double amount;

    @NotBlank(message = "method wajib diisi (CASH / TRANSFER)")
    private String method;
}
