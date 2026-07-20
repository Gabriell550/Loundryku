package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * Bentuk data yang dikirim FRONTEND ke backend saat membuat 1 baris item order.
 * Anotasi @NotBlank, @NotNull, @Positive akan otomatis divalidasi Spring
 * SEBELUM masuk ke controller, jadi kita tidak perlu cek manual satu-satu.
 */
@Data
public class OrderItemRequest {

    @NotBlank(message = "serviceTypeId wajib diisi")
    private String serviceTypeId;

    @NotNull(message = "qty wajib diisi")
    @Positive(message = "qty harus lebih dari 0")
    private Double qty;
}
