package com.example.Backend.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

/**
 * Bentuk data JSON yang dikirim client saat membuat order baru, contoh:
 * {
 *   "customerId": "664f...",
 *   "items": [
 *     { "serviceTypeId": "664a...", "qty": 3 },
 *     { "serviceTypeId": "664b...", "qty": 1 }
 *   ]
 * }
 */
@Data
public class OrderRequest {

    @NotBlank(message = "customerId wajib diisi")
    private String customerId;

    @NotEmpty(message = "items tidak boleh kosong")
    @Valid // penting! supaya validasi di dalam OrderItemRequest ikut dijalankan
    private List<OrderItemRequest> items;
}
